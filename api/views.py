from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
import pandas as pd
import joblib
import os

def welcome(request):
    return render(request, "api/welcome.html")

def home(request):
    df = pd.read_csv("data/donnees_communes.xlsx")
    communes = df["Commune"].unique().tolist()
    return render(request, "api/home.html", {"communes": communes})

@api_view(["POST"])
@permission_classes([AllowAny])
def predict(request):
    commune = request.data.get("commune")
    annee = request.data.get("annee")

    try:
        annee = int(annee)
        if annee < 2024 or annee > 2050:
            return Response({"error": "L'année doit être entre 2024 et 2050."}, status=400)

        df = pd.read_csv("data/donnees_communes.xlsx")
        if commune not in df["Commune"].unique():
            return Response({"error": "Commune non trouvée."}, status=400)

        model_recettes_path = os.path.join("predictor", "trained_models", f"{commune.lower()}_recettes_model.pkl")
        model_depenses_path = os.path.join("predictor", "trained_models", f"{commune.lower()}_depenses_model.pkl")

        if not (os.path.exists(model_recettes_path) and os.path.exists(model_depenses_path)):
            return Response({"error": "Modèles .pkl non trouvés. Exécutez d'abord train_models.py."}, status=400)

        model_recettes = joblib.load(model_recettes_path)
        model_depenses = joblib.load(model_depenses_path)

        recettes = model_recettes.predict([[annee]])[0]
        depenses = model_depenses.predict([[annee]])[0]

        total = recettes + depenses
        chart_data = {
            "labels": ["Recettes", "Dépenses"],
            "datasets": [{
                "data": [recettes / total * 100, depenses / total * 100],
                "backgroundColor": ["#4f46e5", "#ff80b5"],
                "borderColor": ["#4338ca", "#db2777"],
                "borderWidth": 2
            }]
        }

        return Response({
            "recettes": round(recettes, 2),
            "depenses": round(depenses, 2),
            "chart_data": chart_data
        })
    except Exception as e:
        return Response({"error": f"Erreur lors de la prédiction : {str(e)}"}, status=400)