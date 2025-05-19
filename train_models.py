import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

# Charger les données
df = pd.read_excel("data/donnees_communes.xlsx")

# Nettoyage des données
# Vérifier les valeurs manquantes
if df.isnull().sum().sum() > 0:
    print("Valeurs manquantes détectées, suppression...")
    df = df.dropna()

# Vérifier les doublons
if df.duplicated().sum() > 0:
    print("Doublons détectés, suppression...")
    df = df.drop_duplicates()

# Vérifier les types de données
df["Année"] = df["Année"].astype(int)
df["Recettes (M€)"] = df["Recettes (M€)"].astype(float)
df["Dépenses (M€)"] = df["Dépenses (M€)"].astype(float)

# Sauvegarder les données nettoyées
df.to_csv("data/donnees_communes.xlsx", index=False)

# Créer le dossier pour les modèles
if not os.path.exists("predictor/trained_models"):
    os.makedirs("predictor/trained_models")

# Entraîner un modèle par commune pour Recettes et Dépenses
communes = df["Commune"].unique()

for commune in communes:
    print(f"Entraînement pour {commune}...")
    # Filtrer les données pour la commune
    commune_data = df[df["Commune"] == commune]
    X = commune_data[["Année"]].values
    y_recettes = commune_data["Recettes (M€)"].values
    y_depenses = commune_data["Dépenses (M€)"].values

    # Modèle pour les Recettes
    model_recettes = RandomForestRegressor(n_estimators=100, random_state=42)
    model_recettes.fit(X, y_recettes)
    joblib.dump(model_recettes, f"predictor/trained_models/{commune.lower()}_recettes_model.pkl")

    # Modèle pour les Dépenses
    model_depenses = RandomForestRegressor(n_estimators=100, random_state=42)
    model_depenses.fit(X, y_depenses)
    joblib.dump(model_depenses, f"predictor/trained_models/{commune.lower()}_depenses_model.pkl")

print("Entraînement terminé !")