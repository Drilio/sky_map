from rest_framework.views import APIView
from rest_framework.response import Response
import numpy as np
from datetime import datetime
from .models import Star
from .models import CitiesModel
from django.db.models.functions import Power
from django.db.models import F, Value, FloatField, ExpressionWrapper
    
class Cities(APIView):
    def get(self, request):
        all_cities = CitiesModel.objects.all().order_by('id').values('id', 'city', 'lat', 'lng')
        return Response(list(all_cities))

class SkyView(APIView):
    def julian_date(self, dt):
        """
        Convert a datetime object (UTC) to Julian Date.

        Julian Date is a continuous time scale used in astronomy
        to calculate Earth's rotation independently of calendars.

        Input:
        - dt: datetime (UTC)

        Output:
        - jd: float, Julian date (e.g., 2460000.5)
        """   
        a = (14 - dt.month) // 12
        y = dt.year + 4800 - a
        m = dt.month + 12 * a - 3
        
        jdn = dt.day + (153 * m + 2) // 5 + 365 * y + y // 4 - y // 100 + y // 400 - 32045
        jd = jdn + (dt.hour - 12) / 24.0 + dt.minute / 1440.0 + dt.second / 86400.0
        
        return jd
    
    def local_sidereal_time(self, dt, longitude):
        """
        Compute Local Sidereal Time (LST).

        LST represents Earth's rotation angle relative to the stars
        instead of the Sun. It determines how the celestial sphere rotates
        with time.

        Inputs:
        - dt: datetime (UTC)
        - longitude: geographic longitude in radians

        Output:
        - lst: float, angle in radians (0 → 2π)
        """
        jd = self.julian_date(dt)
        
        # Days since J2000.0
        d = jd - 2451545.0
        
        # Greenwich Mean Sidereal Time at 0h UT
        gmst = 18.697374558 + 24.06570982441908 * d
        
        # Normalize to 0-24 hours
        gmst = gmst % 24
        
        # Convert to radians and add longitude
        lst = gmst + np.degrees(longitude) / 15.0
        lst = (lst % 24) * 15  # Convert to degrees
        
        return np.radians(lst)
    
    def rotate_cartesian_equatorial_to_local(self, x, y, z, latitude, lst):
        """
        Transform fixed equatorial Cartesian coordinates (x,y,z) 
        into local Cartesian coordinates for a given observer.

        Step 1:
        - Rotate around Z-axis using Local Sidereal Time (lst)
          → rotates the sky according to the current time

        Step 2:
        - Rotate around X-axis according to observer's latitude
          → inclines the sky according to position on Earth

        Inputs:
        - x, y, z: equatorial Cartesian coordinates (parsecs or arbitrary units)
        - latitude: observer latitude in radians
        - lst: local sidereal time in radians

        Outputs:
        - x2, y2: local Cartesian coordinates projected for front-end
        """
        x1 =  x * np.cos(lst) + y * np.sin(lst)
        y1 = -x * np.sin(lst) + y * np.cos(lst)
        z1 =  z

        x2 = x1
        y2 = y1 * np.cos(latitude) + z * np.sin(latitude)
        z2 = -y1 * np.sin(latitude) + z1 * np.cos(latitude)

        return x2, y2, z2

    def calculate_star_positions(self, latitude, longitude, stars_data, dt):
        """
        Compute the apparent positions of all stars for a given observer.

        For each star:
        - take its original Cartesian coordinates (x, y, z)
        - apply time rotation (LST)
        - apply latitude rotation

        Output is in the same Cartesian frame as the front-end expects.

        Inputs:
        - latitude: in radians
        - longitude: in radians
        - stars_data: Django QuerySet of Star objects
        - dt: datetime object (UTC)

        Outputs:
        - List of dictionaries with updated x/y positions
        """
        lst = self.local_sidereal_time(dt, longitude)
        stars_out = []
        
        for star in stars_data:
            x, y, z = self.rotate_cartesian_equatorial_to_local(
                star.x,
                star.y,
                star.z,
                latitude,
                lst
            )            
            stars_out.append({
            "id": star.id,
            "luminosite": star.mag,
            "taille": star.lum,
            "x": x,
            "y": y,
            "z": z,
            "con": star.con,
            "ci": star.ci,
            "approx_temp": star.approx_temp,
        })
        return stars_out 

    def get(self, request, **kwargs):
        """
        Main API endpoint.

        Steps:
        1. Extract latitude, longitude, datetime from the URL
        2. Select stars (nearest or by brightness)
        3. Convert latitude/longitude to radians
        4. Compute local Cartesian positions for all stars
        5. Return JSON response to front-end
        """
        possible_filter_mapping = {
            "brightest":"mag",
            "hottest":"approx_temp",
            "largest":"lum"
        }
        ref_latitude = float(self.kwargs.get('latitude'))
        ref_longitude = float(self.kwargs.get('longitude'))
        dt = datetime.strptime(self.kwargs.get('datetime'), "%Y-%m-%d %H:%M:%S") 
        stars_filter = self.kwargs.get('stars_filter')
        limit = self.kwargs.get('limit')
        stars_with_temp = Star.objects.annotate(
            approx_temp=ExpressionWrapper( 
        #This formula is an approximation of a star’s effective temperature derived from its B−V color index (ci).
                4600 * (
                    (1 / (0.92 * F("ci") + Value(1.7))) +
                    (1 / (0.92 * F("ci") + Value(0.62)))
                ) - Value(273.15),
                output_field=FloatField()
            )
        )
        if stars_filter == "nearest":
            stars_to_show = stars_with_temp.annotate(dist2=Power(F("x") - Value(ref_latitude), 2) + Power(F("y") - Value(ref_longitude), 2)).order_by("dist2")[:limit]
        else:
            stars_to_show = stars_with_temp.order_by(possible_filter_mapping[stars_filter])[:limit]
        ref_latitude_in_rad = np.radians(ref_latitude)
        ref_longitude_in_rad = np.radians(ref_longitude)
        all_stars_pos = self.calculate_star_positions(ref_latitude_in_rad, ref_longitude_in_rad, stars_to_show, dt) 

        return Response(all_stars_pos)