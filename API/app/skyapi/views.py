from rest_framework.views import APIView
from rest_framework.response import Response
from django.core import serializers
# import numpy as np
from datetime import datetime
from .models import Star
from .models import CitiesModel
from django.db.models.functions import Power
from django.db.models import F, Value

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

class SkyView(APIView):

    # def julian_date(self, dt):
    #     """Calculate Julian Date from datetime object"""
    #     a = (14 - dt.month) // 12
    #     y = dt.year + 4800 - a
    #     m = dt.month + 12 * a - 3
        
    #     jdn = dt.day + (153 * m + 2) // 5 + 365 * y + y // 4 - y // 100 + y // 400 - 32045
    #     jd = jdn + (dt.hour - 12) / 24.0 + dt.minute / 1440.0 + dt.second / 86400.0
        
    #     return jd
    
    # def local_sidereal_time(self, dt):
    #     """Calculate Local Sidereal Time"""
    #     jd = self.julian_date(dt)
        
    #     # Days since J2000.0
    #     d = jd - 2451545.0
        
    #     # Greenwich Mean Sidereal Time at 0h UT
    #     gmst = 18.697374558 + 24.06570982441908 * d
        
    #     # Normalize to 0-24 hours
    #     gmst = gmst % 24
        
    #     # Convert to radians and add longitude
    #     lst = gmst + np.degrees(self.longitude) / 15.0
    #     lst = (lst % 24) * 15  # Convert to degrees
        
    #     return np.radians(lst)
    
    # def equatorial_to_horizontal(self, ra, dec, lst):
    #     """
    #     Convert equatorial coordinates (RA, Dec) to horizontal (Alt, Az)
        
    #     Parameters:
    #     - ra: Right Ascension in radians
    #     - dec: Declination in radians
    #     - lst: Local Sidereal Time in radians
        
    #     Returns:
    #     - altitude: Altitude angle in degrees
    #     - azimuth: Azimuth angle in degrees (0° = North, 90° = East)
    #     """
    #     # Hour Angle
    #     ha = lst - ra
        
    #     # Altitude
    #     sin_alt = (np.sin(dec) * np.sin(self.latitude) + 
    #                np.cos(dec) * np.cos(self.latitude) * np.cos(ha))
    #     altitude = np.arcsin(sin_alt)
        
    #     # Azimuth
    #     cos_az = ((np.sin(dec) - np.sin(altitude) * np.sin(self.latitude)) / 
    #               (np.cos(altitude) * np.cos(self.latitude)))
        
    #     # Clamp cos_az to [-1, 1] to avoid numerical errors
    #     cos_az = np.clip(cos_az, -1, 1)
    #     azimuth = np.arccos(cos_az)
        
    #     # Adjust azimuth based on hour angle
    #     if np.sin(ha) > 0:
    #         azimuth = 2 * np.pi - azimuth
        
    #     return np.degrees(altitude), np.degrees(azimuth)
    
    # def calculate_star_positions(self, stars_data, dt):
    #     """
    #     Calculate positions of all stars for given date/time
        
    #     Parameters:
    #     - stars_data: List of star dictionaries
    #     - dt: datetime object
        
    #     Returns:
    #     - List of star dictionaries with added alt/az coordinates
    #     """
    #     lst = self.local_sidereal_time(dt)
    #     visible_stars = []
        
    #     for star in stars_data:
    #         ra = star['rarad']
    #         dec = star['decrad']
            
    #         altitude, azimuth = self.equatorial_to_horizontal(ra, dec, lst)
            
    #         star_info = star.copy()
    #         star_info['altitude'] = altitude
    #         star_info['azimuth'] = azimuth
    #         star_info['visible'] = altitude > 0  # Star is visible if above horizon
            
    #         visible_stars.append(star_info)
        
    #     return visible_stars
    
    # def get_visible_stars(self, stars_data, dt, min_altitude=0):
    #     """
    #     Get only visible stars above the horizon
        
    #     Parameters:
    #     - stars_data: List of star dictionaries
    #     - dt: datetime object
    #     - min_altitude: Minimum altitude in degrees (default 0, can increase to avoid horizon haze)
        
    #     Returns:
    #     - Sorted list of visible stars (brightest first)
    #     """
    #     all_stars = self.calculate_star_positions(stars_data, dt)
    #     visible = [s for s in all_stars if s['altitude'] > min_altitude]
        
    #     # Sort by magnitude (brightness)
    #     visible.sort(key=lambda x: x['mag'])
        
    #     return visible
    
    # def print_star_chart(self, stars_data, dt, top_n=20):
    #     """
    #     Print a text-based star chart
        
    #     Parameters:
    #     - stars_data: List of star dictionaries
    #     - dt: datetime object
    #     - top_n: Number of brightest stars to display
    #     """
    #     visible = self.get_visible_stars(stars_data, dt)
        
    #     print(f"\n{'='*80}")
    #     print(f"SKY VIEW FROM PARIS")
    #     print(f"Date/Time: {dt.strftime('%Y-%m-%d %H:%M:%S')}")
    #     print(f"{'='*80}\n")
    #     print(f"Total visible stars: {len(visible)}")
    #     print(f"\nTop {min(top_n, len(visible))} brightest stars:\n")
    #     print(f"{'Star ID':<10} {'HIP':<10} {'Mag':<8} {'Alt°':<10} {'Az°':<10} {'Const':<8}")
    #     print(f"{'-'*70}")
        
    #     for star in visible[:top_n]:
    #         print(f"{star['id']:<10} {star['hip']:<10} {star['mag']:<8.2f} "
    #               f"{star['altitude']:<10.1f} {star['azimuth']:<10.1f} {star['con']:<8}")


# # Example usage
# if __name__ == "__main__":
#     # Your star data
#     stars_data = [
#         # ... (paste your JSON star data here)
#     ]
    
#     # Create sky view calculator for Paris
#     sky = SkyView(latitude=48.8566, longitude=2.3522)
    
#     # Example 1: Current time
#     now = datetime.now()
#     sky.print_star_chart(stars_data, now, top_n=20)
    
#     # Example 2: Specific date and time
#     specific_time = datetime(2024, 12, 31, 22, 0, 0)  # New Year's Eve at 10 PM
#     sky.print_star_chart(stars_data, specific_time, top_n=15)
    
#     # Example 3: Get visible stars programmatically
#     visible_stars = sky.get_visible_stars(stars_data, now, min_altitude=10)
#     print(f"\n\nStars above 10° altitude: {len(visible_stars)}")
    
#     # Example 4: Get position of a specific star (e.g., Sirius - id 32263)
#     all_positions = sky.calculate_star_positions(stars_data, now)
#     sirius = next(s for s in all_positions if s['id'] == 32263)
#     print(f"\nSirius position:")
#     print(f"  Altitude: {sirius['altitude']:.2f}°")
#     print(f"  Azimuth: {sirius['azimuth']:.2f}°")
#     print(f"  Visible: {sirius['visible']}")
    def get(self, request, **kwargs):
        possible_filter_mapping = {
            "brightness":"mag"
        }
        latitude = self.kwargs.get('latitude')
        longitude = self.kwargs.get('longitude')
        datetime = self.kwargs.get('datetime')
        stars_filter = self.kwargs.get('stars_filter')
        if stars_filter == "nearest":
            stars_to_show = Star.objects.annotate(dist2=Power(F("x") - Value(latitude), 2) + Power(F("y") - Value(longitude), 2)).order_by("dist2")[:50]
        else:
            stars_to_show = Star.objects.order_by(possible_filter_mapping[stars_filter])[:50]
        
        return Response(serializers.serialize("json", stars_to_show))