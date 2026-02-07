import pandas as pd
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from reportlab.pdfgen import canvas

# Import the model we created earlier
from .models import EquipmentAnalysis

@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Ensures SEEMA is logged in
def upload_csv(request):
    file = request.FILES.get('file')
    if not file:
        return Response({"error": "No file uploaded"}, status=400)

    try:
        # 1. Process the CSV using Pandas
        df = pd.read_csv(file)
        
        # --- DATA CLEANING FIX ---
        # Ensure 'risk_score' is a number; if it's empty or text, make it 0
        if 'risk_score' in df.columns:
            df['risk_score'] = pd.to_numeric(df['risk_score'], errors='coerce').fillna(0)
        else:
            df['risk_score'] = 0  # Fallback if column is totally missing
            
        # Ensure 'name' exists for the graph labels
        if 'name' not in df.columns:
            df['name'] = [f"Item {i+1}" for i in range(len(df))]
        
        total_count = len(df)
        avg_risk = df['risk_score'].mean()

        # 2. PREPARE GRAPH DATA
        # This creates the exact list format Recharts needs: [{"name": "A", "risk_score": 50}]
        equipment_list = df[['name', 'risk_score']].to_dict('records')

        # 3. SAVE to History Database
        EquipmentAnalysis.objects.create(
            filename=file.name,
            total_items=total_count,
            average_risk=round(float(avg_risk), 2)
        )

        # 4. Get Recent History (Order by newest first)
        history_objs = EquipmentAnalysis.objects.all().order_by('-upload_date')[:5]
        history_list = [
            {"filename": h.filename, "date": h.upload_date.strftime("%Y-%m-%d %H:%M")} 
            for h in history_objs
        ]

        # 5. Final Response
        return Response({
            "total_count": total_count,
            "avg_risk": round(float(avg_risk), 2),
            "equipment_list": equipment_list,  # THIS POWERS THE GRAPH
            "history": history_list
        })
        
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])  # PDF download also requires login
def export_pdf(request):
    # Create the PDF response
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="Equipment_Report.pdf"'

    # Initialize the PDF Canvas
    p = canvas.Canvas(response)
    
    # Title and Styling
    p.setFont("Helvetica-Bold", 18)
    p.drawString(100, 800, "Industrial Equipment Analytics Report")
    
    p.setFont("Helvetica", 12)
    p.drawString(100, 775, "Summary of Recent Data Processing:")
    p.line(100, 770, 500, 770)

    # Fetch Data for PDF table
    history = EquipmentAnalysis.objects.all().order_by('-upload_date')[:15]
    
    y = 740
    p.setFont("Helvetica-Bold", 10)
    p.drawString(100, y, "Filename")
    p.drawString(300, y, "Total Items")
    p.drawString(400, y, "Avg Risk Score")
    
    p.setFont("Helvetica", 10)
    y -= 20
    
    for item in history:
        if y < 50: # Page break logic
            p.showPage()
            y = 800
            
        p.drawString(100, y, str(item.filename))
        p.drawString(300, y, str(item.total_items))
        p.drawString(400, y, f"{item.average_risk}%")
        y -= 20

    # Finalize
    p.showPage()
    p.save()
    return response