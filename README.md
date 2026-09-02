# DiabetesAI 🩺

An end-to-end machine learning web application that estimates diabetes risk from patient health measurements.

The project combines a trained **Gradient Boosting Classifier**, a **FastAPI backend**, and a **Next.js frontend** to provide an interactive diabetes risk screening tool.

> ⚠️ **Disclaimer:** This project is for educational and demonstration purposes only. The prediction is a machine-learning estimate and is **not a medical diagnosis**.

---

## 🚀 Live Project

### Frontend
https://diabetesai-predictor.netlify.app

### Backend API
https://diabetesai-api.onrender.com

### API Documentation
https://diabetesai-api.onrender.com/docs

---

## 📌 Project Overview

DiabetesAI takes several patient measurements as input and uses a machine-learning model to estimate the probability of diabetes.

The application provides:

- Diabetes risk probability
- Risk classification
- Model prediction
- Configurable prediction threshold
- Interactive web interface
- FastAPI REST API
- Machine-learning model served through a production API

---

## 🧠 Machine Learning

The project uses the **Pima Indians Diabetes Dataset**, containing 768 observations and 8 input features.

### Input Features

| Feature | Description |
|---|---|
| Pregnancies | Number of pregnancies |
| Glucose | Plasma glucose concentration |
| BloodPressure | Diastolic blood pressure |
| SkinThickness | Triceps skin fold thickness |
| Insulin | Serum insulin level |
| BMI | Body Mass Index |
| DiabetesPedigreeFunction | Diabetes pedigree function |
| Age | Age in years |

### Target

`Outcome`

```text
0 → No diabetes
1 → Diabetes
