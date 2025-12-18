from django.db import models

class Star(models.Model):
    # L'ID est fourni dans ton JSON, on peut forcer Django à l'utiliser comme clé primaire
    id = models.IntegerField(primary_key=True)
    
    # Identifiants de catalogues
    hip = models.IntegerField(null=True, blank=True, db_index=True)
    hd = models.IntegerField(null=True, blank=True)
    hr = models.IntegerField(null=True, blank=True)
    gl = models.CharField(max_length=30, null=True, blank=True)
    bf = models.CharField(max_length=50, null=True, blank=True)
    proper = models.CharField(max_length=100, null=True, blank=True)

    # Position et Distance
    ra = models.FloatField()
    dec = models.FloatField()
    dist = models.FloatField(db_index=True)
    
    # Mouvement (Données très précises : FloatField est parfait)
    pmra = models.FloatField(null=True, blank=True)
    pmdec = models.FloatField(null=True, blank=True)
    rv = models.FloatField(null=True, blank=True)

    # Physique (Mag, Absmag et Lum sont des nombres à virgule longue)
    mag = models.FloatField(db_index=True)
    absmag = models.FloatField(null=True, blank=True)
    spect = models.CharField(max_length=50, null=True, blank=True)
    ci = models.FloatField(null=True, blank=True, db_index=True)
    lum = models.FloatField(null=True, blank=True, db_index=True)

    # Coordonnées Cartésiennes
    x = models.FloatField()
    y = models.FloatField()
    z = models.FloatField()
    vx = models.FloatField(null=True, blank=True)
    vy = models.FloatField(null=True, blank=True)
    vz = models.FloatField(null=True, blank=True)

    # Radians (Haute précision requise)
    rarad = models.FloatField()
    decrad = models.FloatField()
    pmrarad = models.FloatField(null=True, blank=True)
    pmdecrad = models.FloatField(null=True, blank=True)

    # Localisation
    con = models.CharField(max_length=5, null=True, blank=True)
    
    # Hiérarchie (Systèmes multiples)
    # Dans tes données, comp_primary pointe souvent vers l'id d'une autre étoile
    comp = models.IntegerField(null=True, blank=True)
    comp_primary = models.IntegerField(null=True, blank=True)
    base = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        db_table = 'stars'
        ordering = ['id']