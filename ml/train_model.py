import pandas as pd
import numpy as np
import joblib

from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)

# =========================================================
# 1. LOAD DATASET
# =========================================================

DATA_PATH = "../dataset/sales_data.csv"

df = pd.read_csv(DATA_PATH)

print("Dataset loaded successfully!")
print("Rows:", len(df))

print("\nColumns:")
print(df.columns.tolist())


# =========================================================
# 2. PREPARE DATA
# =========================================================

df["date"] = pd.to_datetime(df["date"])

# Sort ONLY by date for proper time-series split
df = df.sort_values(["date", "product_id"]).reset_index(drop=True)

# Time features
df["day"] = df["date"].dt.day

df["day_of_week_num"] = df["date"].dt.dayofweek

df["week"] = df["date"].dt.isocalendar().week.astype(int)

df["month"] = df["date"].dt.month

# Holiday
df["holiday"] = df["holiday"].astype(int)


# =========================================================
# 3. CREATE SALES HISTORY FEATURES
# =========================================================

# Previous sale
df["sales_lag_1"] = (
    df.groupby("product_id")["quantity_sold"]
    .shift(1)
)

# Previous 7th sale
df["sales_lag_7"] = (
    df.groupby("product_id")["quantity_sold"]
    .shift(7)
)

# Previous 7 sales average
df["sales_rolling_7"] = (
    df.groupby("product_id")["quantity_sold"]
    .transform(
        lambda x:
        x.shift(1).rolling(7).mean()
    )
)


# =========================================================
# 4. REMOVE MISSING VALUES
# =========================================================

df = df.dropna().reset_index(drop=True)

print("\nData after preprocessing:", df.shape)


# =========================================================
# 5. ENCODE PRODUCT ID
# =========================================================

product_categories = (
    df["product_id"]
    .astype("category")
)

df["product_id_encoded"] = (
    product_categories.cat.codes
)

product_mapping = dict(
    zip(
        product_categories.cat.categories,
        range(len(product_categories.cat.categories))
    )
)


# =========================================================
# 6. FEATURES
# =========================================================

features = [
    "product_id_encoded",
    "selling_price",
    "stock_available",
    "day",
    "day_of_week_num",
    "week",
    "month",
    "holiday",
    "supplier_lead_days",
    "sales_lag_1",
    "sales_lag_7",
    "sales_rolling_7"
]

target = "quantity_sold"


# =========================================================
# 7. TIME-BASED TRAIN / TEST SPLIT
# =========================================================

# Find chronological 80% date
unique_dates = sorted(
    df["date"].unique()
)

split_position = int(
    len(unique_dates) * 0.8
)

split_date = unique_dates[split_position]

train = df[
    df["date"] < split_date
]

test = df[
    df["date"] >= split_date
]

X_train = train[features]
y_train = train[target]

X_test = test[features]
y_test = test[target]

print("\n===================================")
print("TIME BASED SPLIT")
print("===================================")

print("Training records:", len(train))
print("Testing records :", len(test))

print("Training until  :", train["date"].max())
print("Testing from    :", test["date"].min())


# =========================================================
# 8. TRAIN RANDOM FOREST
# =========================================================

print("\nTraining Random Forest model...")

model = RandomForestRegressor(
    n_estimators=300,
    max_depth=20,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1
)

model.fit(
    X_train,
    y_train
)

print("Model training completed!")


# =========================================================
# 9. PREDICTIONS
# =========================================================

predictions = model.predict(X_test)


# =========================================================
# 10. EVALUATION
# =========================================================

mae = mean_absolute_error(
    y_test,
    predictions
)

rmse = np.sqrt(
    mean_squared_error(
        y_test,
        predictions
    )
)

r2 = r2_score(
    y_test,
    predictions
)


print("\n===================================")
print("MODEL PERFORMANCE")
print("===================================")

print(f"MAE  : {mae:.2f}")
print(f"RMSE : {rmse:.2f}")
print(f"R²   : {r2:.4f}")


# =========================================================
# 11. SAMPLE PREDICTIONS
# =========================================================

results = pd.DataFrame({

    "Date":
        test["date"].values,

    "Product":
        test["product_name"].values,

    "Actual Sales":
        y_test.values,

    "Predicted Sales":
        np.round(
            predictions,
            2
        )

})

print("\nSample Predictions:")

print(
    results
    .head(15)
    .to_string(index=False)
)


# =========================================================
# 12. FEATURE IMPORTANCE
# =========================================================

importance = pd.DataFrame({

    "Feature":
        features,

    "Importance":
        model.feature_importances_

})

importance = importance.sort_values(
    "Importance",
    ascending=False
)

print("\n===================================")
print("FEATURE IMPORTANCE")
print("===================================")

print(
    importance.to_string(
        index=False
    )
)


# =========================================================
# 13. SAVE MODEL
# =========================================================

model_data = {

    "model":
        model,

    "features":
        features,

    "product_mapping":
        product_mapping

}

joblib.dump(
    model_data,
    "smartstock_model.pkl"
)


print("\n===================================")
print("MODEL SAVED")
print("===================================")

print(
    "File: smartstock_model.pkl"
)