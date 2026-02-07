import pandas as pd
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from reportlab.pdfgen import canvas

# Import the model we created earlier
from .models import EquipmentAnalysis

@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Requires login to upload
def upload_csv(request):
    file = request.FILES.get('file')
    if not file:
        return Response({"error": "No file uploaded"}, status=400)

    try:
        # 1. Process the CSV
        df = pd.read_csv(file)
        total_count = len(df)
        
        # Simple risk calculation (assumes a 'risk_score' column exists)
        avg_risk = df['risk_score'].mean() if 'risk_score' in df.columns else 0

        # 2. SAVE to History Database
        EquipmentAnalysis.objects.create(
            filename=file.name,
            total_items=total_count,
            average_risk=round(float(avg_risk), 2)
        )

        # 3. Get Recent History to send back to React
        history_objs = EquipmentAnalysis.objects.all()[:5]
        history_list = [
            {"filename": h.filename, "date": h.upload_date.strftime("%Y-%m-%d %H:%M")} 
            for h in history_objs
        ]

        return Response({
            "total_count": total_count,
            "avg_risk": avg_risk,
            "history": history_list
        })
        
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Requires login to download
def export_pdf(request):
    # Create the PDF response
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="Equipment_Report.pdf"'

    # Initialize the PDF Canvas
    p = canvas.Canvas(response)
    
    # Title
    p.setFont("Helvetica-Bold", 18)
    p.drawString(100, 800, "Industrial Equipment Analytics Report")
    
    p.setFont("Helvetica", 12)
    p.drawString(100, 775, "Summary of Recent Data Processing:")
    p.line(100, 770, 500, 770)

    # Fetch History from Database
    history = EquipmentAnalysis.objects.all()[:10]
    
    y = 740
    p.setFont("Helvetica-Bold", 10)
    p.drawString(100, y, "Filename")
    p.drawString(300, y, "Total Items")
    p.drawString(400, y, "Avg Risk Score")
    
    p.setFont("Helvetica", 10)
    y -= 20
    
    for item in history:
        if y < 50: # Simple page break check
            p.showPage()
            y = 800
            
        p.drawString(100, y, str(item.filename))
        p.drawString(300, y, str(item.total_items))
        p.drawString(400, y, f"{item.average_risk}%")
        y -= 20

    # Finalize PDF
    p.showPage()
    p.save()
    return response