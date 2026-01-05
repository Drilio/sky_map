# skyapi/models.py
from django.db import models


class Star(models.Model):
    id = models.IntegerField(primary_key=True)
    hip = models.IntegerField(null=True, blank=True)

    ra = models.FloatField()
    dec = models.FloatField()
    dist = models.FloatField()

    pmra = models.FloatField(null=True, blank=True)
    pmdec = models.FloatField(null=True, blank=True)
    rv = models.FloatField(null=True, blank=True)

    mag = models.FloatField()
    absmag = models.FloatField(null=True, blank=True)
    spect = models.CharField(max_length=50, null=True, blank=True)
    ci = models.FloatField(null=True, blank=True)

    x = models.FloatField()
    y = models.FloatField()
    z = models.FloatField()
    vx = models.FloatField(null=True, blank=True)
    vy = models.FloatField(null=True, blank=True)
    vz = models.FloatField(null=True, blank=True)

    rarad = models.FloatField()
    decrad = models.FloatField()
    pmrarad = models.FloatField(null=True, blank=True)
    pmdecrad = models.FloatField(null=True, blank=True)

    con = models.CharField(max_length=5, null=True, blank=True)
    comp = models.IntegerField(null=True, blank=True)
    comp_primary = models.IntegerField(null=True, blank=True)
    lum = models.FloatField(null=True, blank=True)

    class Meta:
        db_table = "stars"
        managed = False

class CitiesModel(models.Model):
    id = models.IntegerField(primary_key=True)
    city = models.CharField(max_length=23)
    lat = models.FloatField()
    lng = models.FloatField()
