"use client";

import { FormEvent, useState } from "react";

type PredictionResult = {
  prediction: number;
  risk: "higher" | "lower";
  probability: number;
  probability_percent: number;
  threshold: number;
};

type FormState = {
  pregnancies: string;
  glucose: string;
  blood_pressure: string;
  skin_thickness: string;
  insulin: string;
  bmi: string;
  diabetes_pedigree_function: string;
  age: string;
};

const initialForm: FormState = {
  pregnancies: "2",
  glucose: "130",
  blood_pressure: "70",
  skin_thickness: "25",
  insulin: "100",
  bmi: "30.5",
  diabetes_pedigree_function: "0.4",
  age: "35",
};

export default function Home() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function validateForm(): string {
    const values = {
      pregnancies: Number(form.pregnancies),
      glucose: Number(form.glucose),
      blood_pressure: Number(form.blood_pressure),
      skin_thickness: Number(form.skin_thickness),
      insulin: Number(form.insulin),
      bmi: Number(form.bmi),
      diabetes_pedigree_function: Number(
        form.diabetes_pedigree_function
      ),
      age: Number(form.age),
    };

    if (
      Object.values(values).some(
        (value) => Number.isNaN(value)
      )
    ) {
      return "Please enter a valid number in every field.";
    }

    if (values.pregnancies < 0 || values.pregnancies > 20) {
      return "Pregnancies must be between 0 and 20.";
    }

    if (values.glucose < 0 || values.glucose > 300) {
      return "Glucose must be between 0 and 300.";
    }

    if (
      values.blood_pressure < 0 ||
      values.blood_pressure > 200
    ) {
      return "Blood pressure must be between 0 and 200.";
    }

    if (
      values.skin_thickness < 0 ||
      values.skin_thickness > 100
    ) {
      return "Skin thickness must be between 0 and 100.";
    }

    if (values.insulin < 0 || values.insulin > 1000) {
      return "Insulin must be between 0 and 1000.";
    }

    if (values.bmi < 0 || values.bmi > 80) {
      return "BMI must be between 0 and 80.";
    }

    if (
      values.diabetes_pedigree_function < 0 ||
      values.diabetes_pedigree_function > 3
    ) {
      return "Diabetes pedigree function must be between 0 and 3.";
    }

    if (values.age < 18 || values.age > 120) {
      return "Age must be between 18 and 120.";
    }

    return "";
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      setResult(null);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/predict`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pregnancies: Number(form.pregnancies),
            glucose: Number(form.glucose),
            blood_pressure: Number(form.blood_pressure),
            skin_thickness: Number(form.skin_thickness),
            insulin: Number(form.insulin),
            bmi: Number(form.bmi),
            diabetes_pedigree_function: Number(
              form.diabetes_pedigree_function
            ),
            age: Number(form.age),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail || "Prediction request failed."
        );
      }

      setResult(data);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to connect to the prediction server."
      );
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm(initialForm);
    setResult(null);
    setError("");
  }

  return (
    <main className="min-h-screen bg-[#f6f8f7] text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-lg font-bold text-white shadow-sm">
              D
            </div>

            <div>
              <div className="text-lg font-bold tracking-tight">
                DiabetesAI
              </div>

              <div className="text-xs text-slate-500">
                Risk screening
              </div>
            </div>
          </div>

<nav className="hidden items-center gap-6 text-sm sm:flex">
  <a
    href="/"
    className="font-semibold text-emerald-600"
  >
    Predictor
  </a>

  <a
    href="/about"
    className="text-slate-500 transition hover:text-slate-900"
  >
    About
  </a>
</nav>  
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-8 pt-14 lg:px-8 lg:pt-20">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            ML model online
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Diabetes risk,
            <span className="block text-emerald-600">
              estimated with ML.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Enter the patient measurements below to receive a
            model-predicted diabetes risk estimate.
          </p>
        </div>
      </section>

      {/* Main */}
      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-16 lg:grid-cols-[1.7fr_1fr] lg:px-8">
        {/* Form */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold tracking-tight">
              Patient information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter the values used by the trained model.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <InputField
                label="Pregnancies"
                unit="count"
                description="Number of pregnancies"
                value={form.pregnancies}
                onChange={(value) =>
                  updateField("pregnancies", value)
                }
              />

              <InputField
                label="Glucose"
                unit="mg/dL"
                description="Plasma glucose concentration"
                value={form.glucose}
                onChange={(value) =>
                  updateField("glucose", value)
                }
              />

              <InputField
                label="Blood Pressure"
                unit="mmHg"
                description="Diastolic blood pressure"
                value={form.blood_pressure}
                onChange={(value) =>
                  updateField("blood_pressure", value)
                }
              />

              <InputField
                label="Skin Thickness"
                unit="mm"
                description="Triceps skin fold thickness"
                value={form.skin_thickness}
                onChange={(value) =>
                  updateField("skin_thickness", value)
                }
              />

              <InputField
                label="Insulin"
                unit="µU/mL"
                description="Serum insulin level"
                value={form.insulin}
                onChange={(value) =>
                  updateField("insulin", value)
                }
              />

              <InputField
                label="BMI"
                unit="kg/m²"
                description="Body Mass Index"
                step="0.1"
                value={form.bmi}
                onChange={(value) =>
                  updateField("bmi", value)
                }
              />

              <InputField
                label="Diabetes Pedigree"
                unit="index"
                description="Diabetes pedigree function"
                step="0.01"
                value={form.diabetes_pedigree_function}
                onChange={(value) =>
                  updateField(
                    "diabetes_pedigree_function",
                    value
                  )
                }
              />

              <InputField
                label="Age"
                unit="years"
                description="Age in years"
                value={form.age}
                onChange={(value) =>
                  updateField("age", value)
                }
              />
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-slate-500">
              For glucose, blood pressure, skin thickness, insulin,
              and BMI, a value of 0 is treated by the model as a
              missing measurement and imputed during preprocessing.
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-2xl bg-emerald-600 px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Analyzing..." : "Analyze Risk"}
            </button>
          </form>

          <p className="mt-5 text-center text-xs leading-5 text-slate-400">
            This tool provides a machine-learning risk estimate and
            is not a medical diagnosis.
          </p>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {result ? (
            <ResultCard
              result={result}
              onReset={resetForm}
            />
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  Prediction result
                </h3>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                  Waiting
                </span>
              </div>

              <div className="mt-10 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-3xl font-light text-emerald-600">
                  +
                </div>

                <h4 className="mt-5 text-lg font-semibold">
                  Ready for analysis
                </h4>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Fill in the patient information and run the
                  model to see the predicted probability.
                </p>
              </div>
            </div>
          )}

          {/* Model overview */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="text-sm font-medium text-slate-400">
              MODEL OVERVIEW
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <StatCard
                label="Algorithm"
                value="Gradient Boosting"
              />

              <StatCard
                label="ROC-AUC"
                value="81.86%"
              />

              <StatCard
                label="Recall"
                value="74.07%"
              />

              <StatCard
                label="Threshold"
                value="34.3%"
              />
            </div>
          </div>

          {/* How it works */}
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6">
            <div className="text-sm font-semibold text-emerald-800">
              How it works
            </div>

            <div className="mt-4 space-y-3 text-sm text-emerald-900/75">
              <Step
                number="01"
                text="Enter patient measurements."
              />

              <Step
                number="02"
                text="FastAPI sends the values through the saved ML pipeline."
              />

              <Step
                number="03"
                text="The model returns a probability and risk classification."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 text-center text-xs text-slate-400 lg:px-8">
          DiabetesAI · Machine Learning Portfolio Project
        </div>
      </footer>
    </main>
  );
}

function InputField({
  label,
  unit,
  description,
  value,
  onChange,
  step = "1",
}: {
  label: string;
  unit: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  step?: string;
}) {
  return (
    <label className="block">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-slate-800">
            {label}
          </div>

          <div className="mt-0.5 text-xs text-slate-400">
            {description}
          </div>
        </div>

        <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">
          {unit}
        </span>
      </div>

      <input
        type="number"
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

function ResultCard({
  result,
  onReset,
}: {
  result: PredictionResult;
  onReset: () => void;
}) {
  const percentage = Math.min(
    result.probability_percent,
    100
  );

  const isHigherRisk = result.risk === "higher";

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-7 text-white shadow-sm">
      <div className="text-sm font-medium tracking-wide text-slate-400">
        MODEL-PREDICTED RISK
      </div>

      <div className="mt-4 text-5xl font-bold tracking-tight">
        {result.probability_percent.toFixed(2)}%
      </div>

      <div className="mt-2 text-lg font-semibold">
        {isHigherRisk
          ? "Higher predicted risk"
          : "Lower predicted risk"}
      </div>

      <div className="mt-7">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
          <span>Estimated probability</span>

          <span>
            Threshold {(result.threshold * 100).toFixed(1)}%
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-700"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="mt-7 grid grid-cols-2 gap-3">
        <StatCard
          label="Classification"
          value={isHigherRisk ? "Positive" : "Negative"}
          dark
        />

        <StatCard
          label="Threshold"
          value={`${(
            result.threshold * 100
          ).toFixed(1)}%`}
          dark
        />
      </div>

      <button
        onClick={onReset}
        className="mt-5 w-full rounded-2xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-900"
      >
        Check another patient
      </button>
    </div>
  );
}

function StatCard({
  label,
  value,
  dark = false,
}: {
  label: string;
  value: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-4 ${
        dark ? "bg-white" : "bg-slate-50"
      }`}
    >
      <div
        className={`text-xs ${
          dark ? "text-slate-400" : "text-slate-400"
        }`}
      >
        {label}
      </div>

      <div
        className={`mt-1 text-sm font-semibold ${
          dark ? "text-slate-800" : "text-slate-800"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function Step({
  number,
  text,
}: {
  number: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="font-semibold">{number}</span>
      <span>{text}</span>
    </div>
  );
}