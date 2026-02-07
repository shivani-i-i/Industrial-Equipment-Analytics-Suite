import pandas as pd
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from reportlab.pdfgen import canvas
from .models import EquipmentAnalysis
from django.utils import timezone

@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def upload_csv(request):
    # GET: Fetch History for Sidebar
    if request.method == 'GET':
        history_objs = EquipmentAnalysis.objects.all().order_by('-upload_date')[:5]
        history_list = [
            {
                "filename": h.filename, 
                "date": h.upload_date.strftime("%Y-%m-%d %H:%M"),
                "avg": h.average_risk
            } for h in history_objs
        ]
        return Response({"history": history_list})

    # POST: Process Uploaded JSON Data
    try:
        json_data = request.data.get('data', [])
        filename = request.data.get('filename', 'Manual_Upload.csv')

        if not json_data:
            return Response({"error": "No data received"}, status=400)

        df = pd.DataFrame(json_data)
        
        total_count = len(df)
        # We use 'load' because React cleans the CSV and sends it as 'load'
        avg_val = df['load'].mean() if 'load' in df.columns else 0
        critical_count = int((df['load'] > 140).sum()) if 'load' in df.columns else 0

        # Save to Database History
        EquipmentAnalysis.objects.create(
            filename=filename,
            total_items=total_count,
            average_risk=round(float(avg_val), 2)
        )

        # Get Updated History for response
        history_objs = EquipmentAnalysis.objects.all().order_by('-upload_date')[:5]
        history_list = [
            {
                "filename": h.filename, 
                "date": h.upload_date.strftime("%Y-%m-%d %H:%M"),
                "avg": h.average_risk
            } for h in history_objs
        ]

        return Response({
            "total_count": total_count,
            "avg_value": round(float(avg_val), 2),
            "distribution": {
                "critical": critical_count,
                "stable": total_count - critical_count
            },
            "history": history_list
        })
        
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@permission_classes([AllowAny])
def export_pdf(request):
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="Equipment_Report.pdf"'

    p = canvas.Canvas(response)
    p.setFont("Helvetica-Bold", 16)
    p.drawString(100, 800, "Industrial Equipment Analytics Report")
    p.setFont("Helvetica", 10)
    p.drawString(100, 780, f"Report Date: {timezone.now().strftime('%Y-%m-%d %H:%M')}")
    p.line(100, 775, 500, 775)

    history = EquipmentAnalysis.objects.all().order_by('-upload_date')[:15]
    y = 740
    p.setFont("Helvetica-Bold", 10)
    p.drawString(100, y, "Filename")
    p.drawString(300, y, "Items")
    p.drawString(400, y, "Avg Flowrate")
    
    p.setFont("Helvetica", 10)
    y -= 20
    for item in history:
        if y < 50:
            p.showPage()
            y = 800
        p.drawString(100, y, str(item.filename)[:30])
        p.drawString(300, y, str(item.total_items))
        p.drawString(400, y, f"{item.average_risk}")
        y -= 20

    p.showPage()
    p.save()
    return response