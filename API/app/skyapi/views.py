from django.shortcuts import render
# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from django.http import JsonResponse
# Attention le modèle Star doit exister 
#from .models import Star

class Date(APIView):
    def get(self, request):
        maintenant = timezone.now()
        
        data = {
            "current_datetime": maintenant
        }
        
        return Response(data)
    
class TopBrightness(APIView):
    def get(self, request):
        # On récupère les 50 étoiles avec la magnitude la plus basse (les plus brillantes)
        # .values() permet de transformer directement le QuerySet en dictionnaires
        #stars = Star.objects.order_by('mag').values('id', 'hip', 'hd', 'hr', 'gl', 'bf', 'ra', 'dec', 'mag')[:50]
        
        # stars est déjà une liste de dictionnaires grâce à .values()
        #return JsonResponse(list(stars), safe=False)
        mock_data = [
            {
                "id": 1,
                "hip": 1,
                "hd": 224700,
                "hr": "",
                "gl": "",
                "bf": "",
                "proper": "Toto",
                "ra": 0.00006,
                "dec": 1.089009,
                "dist": 219.7802,
                "pmra": -5.2,
                "pmdec": -1.88,
                "rv": 0,
                "mag": 9.1,
                "absmag": 2.39,
                "spect": "F5",
                "ci": 0.482,
        q        "x": 219.740502,
                "y": 0.003449,
                "z": 4.177065,
                "vx": 4e-8,
                "vy": -0.00000554,
                "vz": -0.000002,
                "rarad": 0.0000156934097753,
                "decrad": 0.01900678824815125,
                "pmrarad": -2.52103114e-8,
                "pmdecrad": -9.114497e-9,
                "bayer": "",
                "flam": "",
                "con": "Psc",
                "comp": 1,
                "comp_primary": 1,
                "base": "",
                "lum": 9.638290236239703,
                "var": "",
                "var_min": "",
                "var_max": ""
            }
        ]
        
        # On retourne les fausses données directement
        return JsonResponse(mock_data, safe=False)
