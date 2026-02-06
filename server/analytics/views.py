from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
import pandas as pd

class FileUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get('file')
        try:
            df = pd.read_csv(file_obj)
            avg_p = df.get('Pressure', pd.Series([0])).mean()
            avg_f = df.get('Flowrate', pd.Series([0])).mean()
            type_col = 'Equipment_Type' if 'Equipment_Type' in df.columns else df.columns[0]
            dist = df[type_col].value_counts().to_dict()

            return Response({
                "avg_pressure": float(avg_p),
                "avg_flowrate": float(avg_f),
                "type_distribution": dist
            }, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)