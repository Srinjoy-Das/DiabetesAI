from pathlib import Path
import json

import joblib
import pandas as pd

from sklearn.ensemble import GradientBoostingClassifier
from sklearn.impute import SimpleImputer
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    classification_report,
    confusion_matrix,
)
from sklearn.model_selection import (
    train_test_split,
    StratifiedKFold,
    cross_validate,
)
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler


# =========================================================
# PATHS
# =========================================================

BASE_DIR = Path(__file__).parent
DATA_PATH = BASE_DIR / "data" / "diabetes.csv"
MODEL_DIR = BASE_DIR / "models"

MODEL_PATH = MODEL_DIR / "diabetes_pipeline.pkl"
THRESHOLD_PATH = MODEL_DIR / "threshold.json"


# =========================================================
# CONFIGURATION
# =========================================================

TEST_SIZE = 0.20
RANDOM_STATE = 42

# Columns where 0 represents an invalid/missing measurement
ZERO_AS_MISSING = [
    "Glucose",
    "BloodPressure",
    "SkinThickness",
    "Insulin",
    "BMI",
]


# =========================================================
# PREPROCESSING
# =========================================================

def prepare_data(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.Series]:
    """Separate features and target and convert invalid zeros to NaN."""

    if "Outcome" not in df.columns:
        raise ValueError("Target column 'Outcome' was not found.")

    X = df.drop(columns="Outcome").copy()
    y = df["Outcome"].copy()

    for column in ZERO_AS_MISSING:
        X[column] = X[column].replace(0, float("nan"))

    return X, y


# =========================================================
# PIPELINE
# =========================================================

def build_pipeline() -> Pipeline:
    """Create preprocessing + Gradient Boosting pipeline."""

    preprocessing = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
    ])

    model = GradientBoostingClassifier(
        n_estimators=100,
        learning_rate=0.1,
        max_depth=1,
        min_samples_split=2,
        min_samples_leaf=2,
        random_state=RANDOM_STATE,
    )

    return Pipeline([
        ("preprocessing", preprocessing),
        ("model", model),
    ])


# =========================================================
# CROSS-VALIDATION
# =========================================================

def evaluate_cross_validation(
    pipeline: Pipeline,
    X_train: pd.DataFrame,
    y_train: pd.Series,
) -> None:
    """Evaluate the model using 5-fold stratified CV."""

    cv = StratifiedKFold(
        n_splits=5,
        shuffle=True,
        random_state=RANDOM_STATE,
    )

    results = cross_validate(
        pipeline,
        X_train,
        y_train,
        cv=cv,
        scoring=[
            "accuracy",
            "precision",
            "recall",
            "f1",
            "roc_auc",
        ],
        n_jobs=-1,
    )

    print("\n=== 5-Fold Cross-Validation ===")

    metrics = {
        "Accuracy": "test_accuracy",
        "Precision": "test_precision",
        "Recall": "test_recall",
        "F1": "test_f1",
        "ROC-AUC": "test_roc_auc",
    }

    for name, key in metrics.items():
        print(f"{name}: {results[key].mean():.4f}")


# =========================================================
# THRESHOLD SELECTION
# =========================================================

def choose_threshold(
    pipeline: Pipeline,
    X_train: pd.DataFrame,
    y_train: pd.Series,
) -> float:
    """
    Select a threshold using cross-validated probabilities.

    We target at least 75% recall and, among eligible thresholds,
    choose the one with the highest precision.
    """

    from sklearn.model_selection import cross_val_predict
    from sklearn.metrics import precision_recall_curve

    cv = StratifiedKFold(
        n_splits=5,
        shuffle=True,
        random_state=RANDOM_STATE,
    )

    oof_probabilities = cross_val_predict(
        pipeline,
        X_train,
        y_train,
        cv=cv,
        method="predict_proba",
        n_jobs=-1,
    )[:, 1]

    precision, recall, thresholds = precision_recall_curve(
        y_train,
        oof_probabilities,
    )

    threshold_df = pd.DataFrame({
        "threshold": thresholds,
        "precision": precision[:-1],
        "recall": recall[:-1],
    })

    threshold_df["f1"] = (
        2
        * threshold_df["precision"]
        * threshold_df["recall"]
        / (
            threshold_df["precision"]
            + threshold_df["recall"]
            + 1e-12
        )
    )

    eligible = threshold_df[
        threshold_df["recall"] >= 0.75
    ]

    if eligible.empty:
        # Fallback: choose the threshold with best F1
        best_row = threshold_df.loc[
            threshold_df["f1"].idxmax()
        ]
    else:
        best_row = eligible.loc[
            eligible["precision"].idxmax()
        ]

    threshold = float(best_row["threshold"])

    print("\n=== Selected Threshold ===")
    print(f"Threshold : {threshold:.4f}")
    print(f"Precision : {best_row['precision']:.4f}")
    print(f"Recall    : {best_row['recall']:.4f}")
    print(f"F1        : {best_row['f1']:.4f}")

    return threshold


# =========================================================
# MAIN
# =========================================================

def main() -> None:

    print("Loading dataset...")

    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"Dataset not found: {DATA_PATH}"
        )

    df = pd.read_csv(DATA_PATH)

    print(f"Dataset shape: {df.shape}")

    X, y = prepare_data(df)

    print(f"Feature count: {X.shape[1]}")
    print(f"Target distribution:\n{y.value_counts()}")

    # -----------------------------------------------------
    # Train / test split
    # -----------------------------------------------------

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=TEST_SIZE,
        random_state=RANDOM_STATE,
        stratify=y,
    )

    print(f"\nTraining samples: {len(X_train)}")
    print(f"Testing samples:  {len(X_test)}")

    # -----------------------------------------------------
    # Build pipeline
    # -----------------------------------------------------

    pipeline = build_pipeline()

    # -----------------------------------------------------
    # Cross-validation
    # -----------------------------------------------------

    evaluate_cross_validation(
        pipeline,
        X_train,
        y_train,
    )

    # -----------------------------------------------------
    # Select threshold using training data only
    # -----------------------------------------------------

    threshold = choose_threshold(
        pipeline,
        X_train,
        y_train,
    )

    # -----------------------------------------------------
    # Train final pipeline on training data
    # -----------------------------------------------------

    print("\nTraining final model...")
    pipeline.fit(X_train, y_train)

    # -----------------------------------------------------
    # Final test probabilities
    # -----------------------------------------------------

    test_probabilities = pipeline.predict_proba(
        X_test
    )[:, 1]

    test_predictions = (
        test_probabilities >= threshold
    ).astype(int)

    # -----------------------------------------------------
    # Final evaluation
    # -----------------------------------------------------

    print("\n=== Final Test Results ===")

    print(
        f"Accuracy : "
        f"{accuracy_score(y_test, test_predictions):.4f}"
    )

    print(
        f"Precision: "
        f"{precision_score(y_test, test_predictions):.4f}"
    )

    print(
        f"Recall   : "
        f"{recall_score(y_test, test_predictions):.4f}"
    )

    print(
        f"F1       : "
        f"{f1_score(y_test, test_predictions):.4f}"
    )

    print(
        f"ROC-AUC  : "
        f"{roc_auc_score(y_test, test_probabilities):.4f}"
    )

    print("\n=== Classification Report ===")
    print(
        classification_report(
            y_test,
            test_predictions,
        )
    )

    print("\n=== Confusion Matrix ===")
    print(confusion_matrix(y_test, test_predictions))

    # -----------------------------------------------------
    # Save model + threshold
    # -----------------------------------------------------

    MODEL_DIR.mkdir(exist_ok=True)

    joblib.dump(
        pipeline,
        MODEL_PATH,
    )

    with open(
        THRESHOLD_PATH,
        "w",
        encoding="utf-8",
    ) as file:
        json.dump(
            {
                "threshold": threshold
            },
            file,
            indent=4,
        )

    print("\n=== Saved Artifacts ===")
    print(f"Model    : {MODEL_PATH}")
    print(f"Threshold: {THRESHOLD_PATH}")


if __name__ == "__main__":
    main()