from rest_framework import serializers
from .models import Commune, Prediction

class CommuneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Commune
        fields = ['id', 'name']

class PredictionSerializer(serializers.ModelSerializer):
    commune = CommuneSerializer(read_only=True)
    commune_id = serializers.PrimaryKeyRelatedField(
        queryset=Commune.objects.all(), source='commune', write_only=True
    )

    class Meta:
        model = Prediction
        fields = ['id', 'user', 'commune', 'commune_id', 'annee', 'recettes', 'depenses', 'created_at']