from pathlib import Path
import json
import logging

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


# =========================================================
# CONFIGURATION
# =========================================================

BASE_DIR = Path(__file__).parent

MODEL_PATH = BASE_DIR / "models" / "diabetes_pipeline.pkl"
THRESHOLD_PATH = BASE_DIR / "models" / "threshold.json"

logger = logging.getLogger(__name__)


# =========================================================
# LOAD MODEL
# =========================================================

if not MODEL_PATH.exists():
    raise FileNotFoundError(
        f"Model file not found: {MODEL_PATH}"
    )

model = joblib.load(MODEL_PATH)


# =========================================================
# LOAD THRESHOLD
# =========================================================

if not THRESHOLD_PATH.exists():
    raise FileNotFoundError(
        f"Threshold file not found: {THRESHOLD_PATH}"
    )

with open(THRESHOLD_PATH, "r", encoding="utf-8") as file:
    threshold_data = json.load(file)

THRESHOLD = float(threshold_data["threshold"])


# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(
    title="Diabetes Risk Prediction API",
    description=(
        "Machine learning API for estimating "
        "model-predicted diabetes risk."
    ),
    version="1.0.0",
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://diabetesai-predictor.netlify.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# INPUT SCHEMA
# =========================================================

class DiabetesInput(BaseModel):

    pregnancies: int = Field(
        ...,
        ge=0,
        le=20,
        description="Number of pregnancies",
    )

    glucose: float = Field(
        ...,
        ge=0,
        le=300,
        description="Plasma glucose concentration",
    )

    blood_pressure: float = Field(
        ...,
        ge=0,
        le=200,
        description="Diastolic blood pressure",
    )

    skin_thickness: float = Field(
        ...,
        ge=0,
        le=100,
        description="Triceps skin fold thickness",
    )

    insulin: float = Field(
        ...,
        ge=0,
        le=1000,
        description="Serum insulin level",
    )

    bmi: float = Field(
        ...,
        ge=0,
        le=80,
        description="Body Mass Index",
    )

    diabetes_pedigree_function: float = Field(
        ...,
        ge=0,
        le=3,
        description="Diabetes pedigree function",
    )

    age: int = Field(
        ...,
        ge=18,
        le=120,
        description="Age in years",
    )


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():
    return {
        "message": "Diabetes Risk Prediction API is running!"
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "diabetes-risk-prediction-api",
        "model_loaded": model is not None,
        "threshold": THRESHOLD,
    }


# =========================================================
# PREDICTION
# =========================================================

@app.post("/predict")
def predict(data: DiabetesInput):

    try:

        input_data = pd.DataFrame([
            {
                "Pregnancies": data.pregnancies,
                "Glucose": data.glucose,
                "BloodPressure": data.blood_pressure,
                "SkinThickness": data.skin_thickness,
                "Insulin": data.insulin,
                "BMI": data.bmi,
                "DiabetesPedigreeFunction":
                    data.diabetes_pedigree_function,
                "Age": data.age,
            }
        ])

        # The saved pipeline performs preprocessing.
        probability = float(
            model.predict_proba(input_data)[0][1]
        )

        prediction = int(
            probability >= THRESHOLD
        )

        if prediction == 1:
            risk = "higher"
        else:
            risk = "lower"

        return {
            "prediction": prediction,
            "risk": risk,
            "probability": round(probability, 4),
            "probability_percent": round(
                probability * 100,
                2,
            ),
            "threshold": round(
                THRESHOLD,
                4,
            ),
        }

    except Exception:
        logger.exception(
            "Prediction failed"
        )

        raise HTTPException(
            status_code=500,
            detail="Internal server error",
        )


# =========================================================
# RUN
# =========================================================

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000,
        reload=True,
    )