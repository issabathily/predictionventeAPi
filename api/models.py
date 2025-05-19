from django.db import models
from django.contrib.auth.models import User

class Commune(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Prediction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    commune = models.ForeignKey(Commune, on_delete=models.CASCADE)
    annee = models.IntegerField()
    recettes = models.FloatField()
    depenses = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.commune.name} - {self.annee}"