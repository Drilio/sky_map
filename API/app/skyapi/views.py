from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Star
from .models import CitiesModel

PARIS_LAT = 48.8566
MIN_DEC_VISIBLE = -(90 - PARIS_LAT)  # -41.1434


class TopBrightestParis(APIView):
    def get(self, request):
        rows = (
            Star.objects
            .exclude(id=0)
            .filter(dec__gte=MIN_DEC_VISIBLE)
            .order_by("mag")[:50]
            .values(
                "id", "hip",
                "ra", "dec", "dist",
                "mag", "absmag", "spect", "ci",
                "x", "y", "z",
                "rarad", "decrad",
                "con", "comp", "comp_primary", "lum",
            )
        )
        return Response(rows)
    
class Cities(APIView):
    def get(self, request):
        all_cities = CitiesModel.objects.all().order_by('id').values('id', 'city', 'lat', 'lng')
        return Response(list(all_cities))

