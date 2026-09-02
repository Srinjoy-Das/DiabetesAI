export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f6f8f7] text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <a
            href="/"
            className="flex items-center gap-3"
          >
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
          </a>

          <nav className="flex items-center gap-6 text-sm">
            <a
              href="/"
              className="text-slate-500 transition hover:text-slate-900"
            >
              Predictor
            </a>

            <a
              href="/about"
              className="font-semibold text-emerald-600"
            >
              About
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-12 pt-16 lg:px-8 lg:pt-20">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
            About the project
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            A machine-learning system for
            <span className="block text-emerald-600">
              diabetes risk estimation.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            DiabetesAI is an end-to-end machine-learning project
            that combines a trained classification model, a
            FastAPI backend, and a Next.js frontend.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto grid max-w-7xl gap-4 px-6 pb-8 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <InfoCard
          label="Dataset"
          value="768"
          detail="patient records"
        />

        <InfoCard
          label="Features"
          value="8"
          detail="input variables"
        />

        <InfoCard
          label="ROC-AUC"
          value="81.86%"
          detail="held-out test set"
        />

        <InfoCard
          label="Recall"
          value="74.07%"
          detail="positive class"
        />
      </section>

      {/* Main cards */}
      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-16 lg:grid-cols-2 lg:px-8">
        {/* Dataset */}
        <InfoSection
          title="Dataset"
          eyebrow="01 · DATA"
        >
          <p className="text-sm leading-6 text-slate-600">
            The model uses eight patient-level input variables and
            predicts the binary target column provided by the
            dataset.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              "Pregnancies",
              "Glucose",
              "Blood Pressure",
              "Skin Thickness",
              "Insulin",
              "BMI",
              "Diabetes Pedigree",
              "Age",
            ].map((feature) => (
              <div
                key={feature}
                className="rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-700"
              >
                {feature}
              </div>
            ))}
          </div>
        </InfoSection>

        {/* Preprocessing */}
        <InfoSection
          title="Preprocessing"
          eyebrow="02 · PIPELINE"
        >
          <p className="text-sm leading-6 text-slate-600">
            Some physiological fields contain zero values that are
            treated as missing measurements. The saved preprocessing
            pipeline handles missing values with median imputation
            and then standardizes the numeric features.
          </p>

          <div className="mt-6 space-y-3">
            <ProcessStep
              number="01"
              title="Missing-value handling"
              detail="Median imputation"
            />

            <ProcessStep
              number="02"
              title="Feature scaling"
              detail="StandardScaler"
            />

            <ProcessStep
              number="03"
              title="Classification"
              detail="Gradient Boosting"
            />
          </div>
        </InfoSection>

        {/* Model */}
        <InfoSection
          title="Model"
          eyebrow="03 · MACHINE LEARNING"
        >
          <p className="text-sm leading-6 text-slate-600">
            The final candidate uses Gradient Boosting with
            hyperparameters selected through cross-validation and
            grid search on the training data.
          </p>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
            <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <span>Parameter</span>
              <span>Value</span>
            </div>

            <ModelRow
              name="Estimators"
              value="100"
            />

            <ModelRow
              name="Learning rate"
              value="0.10"
            />

            <ModelRow
              name="Max depth"
              value="1"
            />

            <ModelRow
              name="Min samples leaf"
              value="2"
            />

            <ModelRow
              name="Min samples split"
              value="2"
            />
          </div>
        </InfoSection>

        {/* Evaluation */}
        <InfoSection
          title="Evaluation"
          eyebrow="04 · PERFORMANCE"
        >
          <p className="text-sm leading-6 text-slate-600">
            The model was evaluated on a held-out test set after
            model selection. The classification threshold was
            selected using out-of-fold predictions from the training
            data.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <MetricCard
              label="Accuracy"
              value="75.32%"
            />

            <MetricCard
              label="Precision"
              value="62.50%"
            />

            <MetricCard
              label="Recall"
              value="74.07%"
            />

            <MetricCard
              label="F1"
              value="67.80%"
            />

            <MetricCard
              label="ROC-AUC"
              value="81.86%"
            />

            <MetricCard
              label="Threshold"
              value="34.3%"
            />
          </div>
        </InfoSection>
      </section>

      {/* Architecture */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="max-w-2xl">
            <div className="text-sm font-medium uppercase tracking-wide text-emerald-600">
              System architecture
            </div>

            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              From patient input to prediction.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-5">
            <ArchitectureCard
              number="01"
              title="Next.js"
              detail="User input"
            />

            <Arrow />

            <ArchitectureCard
              number="02"
              title="FastAPI"
              detail="API validation"
            />

            <Arrow />

            <ArchitectureCard
              number="03"
              title="ML Pipeline"
              detail="Prediction"
            />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-5">
            <div className="hidden md:block" />

            <Arrow />

            <ArchitectureCard
              number="04"
              title="Probability"
              detail="Risk estimate"
            />

            <Arrow />

            <ArchitectureCard
              number="05"
              title="Frontend"
              detail="Result display"
            />
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <div className="text-sm font-semibold text-amber-900">
            Important
          </div>

          <p className="mt-2 max-w-4xl text-sm leading-6 text-amber-900/75">
            This project is an educational machine-learning
            application. Its predictions are statistical model
            outputs and should not be interpreted as a medical
            diagnosis or as a substitute for professional medical
            advice.
          </p>
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

function InfoCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </div>

      <div className="mt-3 text-3xl font-bold tracking-tight">
        {value}
      </div>

      <div className="mt-1 text-sm text-slate-500">
        {detail}
      </div>
    </div>
  );
}

function InfoSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
      <div className="text-xs font-medium uppercase tracking-wide text-emerald-600">
        {eyebrow}
      </div>

      <h2 className="mt-2 text-2xl font-bold tracking-tight">
        {title}
      </h2>

      <div className="mt-4">{children}</div>
    </div>
  );
}

function ProcessStep({
  number,
  title,
  detail,
}: {
  number: string;
  title: string;
  detail: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xs font-bold text-emerald-700">
        {number}
      </div>

      <div>
        <div className="text-sm font-semibold">
          {title}
        </div>

        <div className="mt-0.5 text-xs text-slate-500">
          {detail}
        </div>
      </div>
    </div>
  );
}

function ModelRow({
  name,
  value,
}: {
  name: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-2 border-b border-slate-100 px-4 py-3 text-sm last:border-b-0">
      <span className="text-slate-500">{name}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="text-xs text-slate-400">
        {label}
      </div>

      <div className="mt-1 text-lg font-bold">
        {value}
      </div>
    </div>
  );
}

function ArchitectureCard({
  number,
  title,
  detail,
}: {
  number: string;
  title: string;
  detail: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
      <div className="text-xs font-semibold text-emerald-600">
        {number}
      </div>

      <div className="mt-3 font-semibold">
        {title}
      </div>

      <div className="mt-1 text-sm text-slate-500">
        {detail}
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <div className="hidden items-center justify-center md:flex">
      <span className="text-xl text-slate-300">→</span>
    </div>
  );
}