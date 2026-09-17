import pandas as pd

df = pd.read_csv("../dataset/sales_data.csv")

df["date"] = pd.to_datetime(df["date"])

print("\n========== DATASET INFO ==========")
print("Rows:", len(df))
print("Columns:", len(df.columns))

print("\n========== MISSING VALUES ==========")
print(df.isnull().sum())

print("\n========== PRODUCT SALES ==========")
print(
    df.groupby("product_name")["quantity_sold"]
    .agg(["count", "mean", "min", "max", "sum"])
    .sort_values("sum", ascending=False)
)

print("\n========== MONTHLY SALES ==========")
print(
    df.groupby("month")["quantity_sold"]
    .sum()
)

print("\n========== DAY OF WEEK SALES ==========")
print(
    df.groupby("day_of_week")["quantity_sold"]
    .mean()
)

print("\n========== PRICE vs SALES ==========")
print(
    df[["selling_price", "quantity_sold"]]
    .corr()
)

print("\n========== DATA TYPES ==========")
print(df.dtypes)