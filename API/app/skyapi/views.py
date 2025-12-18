from django.shortcuts import render
# Create your views here.
import os 
import math 
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import datetime, timezone
from django.http import JsonResponse
# Attention le modèle Star doit exister 
from .models import Star

class Date(APIView):
    def get(self, request):
        maintenant = timezone.now()
        
        data = {
            "current_datetime": maintenant
        }
        
        return Response(data)

""" class Top(APIView):
    def get(self, request):
        query_type = request.GET.get('type', 'brightest')
        
        # 2. Heure et Temps Sidéral (Paris)
        now = datetime.now(timezone.utc)
        decimal_hours = now.hour + now.minute/60 + now.second/3600
        day_of_year = now.timetuple().tm_yday
        seasonal_offset = (day_of_year - 80) * 0.0657
        lst_hours = (decimal_hours * 1.0027 + seasonal_offset + 6.64 + 0.15) % 24
        
        # 3. Tri des données
        config = {
            'brightest': ('mag', False),
            'nearest': ('dist', False),
            'hottest': ('ci', False),
            'largest': ('lum', True)
        }
        sort_key, reverse_order = config.get(query_type, ('mag', False))
        
        # On trie en filtrant les valeurs None pour éviter les crashs
        all_stars.sort(
            key=lambda x: x.get(sort_key) if x.get(sort_key) is not None else 999, 
            reverse=reverse_order
        )

        # 4. Filtrage visibilité Paris
        PARIS_LAT_RAD = math.radians(48.85)
        visible_stars = []

        for star in all_stars:
            if star.get('ra') is None or star.get('dec') is None:
                continue

            # Conversion RA (heures) en degrés pour l'angle horaire
            h_rad = math.radians((lst_hours - star['ra']) * 15)
            dec_rad = math.radians(star['dec'])
            
            # Sin(Altitude)
            sin_a = (math.sin(PARIS_LAT_RAD) * math.sin(dec_rad) + 
                     math.cos(PARIS_LAT_RAD) * math.cos(dec_rad) * math.cos(h_rad))
            
            if sin_a > 0:
                star['altitude'] = math.degrees(math.asin(sin_a))
                visible_stars.append(star)
            
            if len(visible_stars) >= 50:
                break

        return JsonResponse(visible_stars, safe=False) """
    
class TopId(APIView):
    def get(self, request):
        # 1. On récupère les 50 premières étoiles triées par ID
        # .values() transforme les objets Star en dictionnaires JSON-friendly
        stars = Star.objects.all().order_by('id').values(
            'id', 'hip', 'hd', 'hr', 'gl', 'bf', 'proper', 'ra', 'dec', 
            'dist', 'pmra', 'pmdec', 'rv', 'mag', 'absmag', 'spect', 
            'ci', 'x', 'y', 'z', 'vx', 'vy', 'vz', 'rarad', 'decrad', 
            'pmrarad', 'pmdecrad', 'bayer', 'flam', 'con', 'comp', 
            'comp_primary', 'base', 'lum', 'var', 'var_min', 'var_max'
        )[:50]

        # 2. On retourne la liste
        return Response(list(stars))
