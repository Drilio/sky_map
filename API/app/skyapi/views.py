from django.shortcuts import render
# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone

class SkyStateView(APIView):
    def get(self, request):
        maintenant = timezone.now()
        
        data = {
            "current_datetime": maintenant
        }
        
        return Response(data)
