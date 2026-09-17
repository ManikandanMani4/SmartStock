import csv
import random
from datetime import date, timedelta

# -----------------------------
# Configuration
# -----------------------------
START_DATE = date(2024, 1, 1)
END_DATE = date(2025, 12, 31)

products = [
    ("P001", "Rice", "Grocery", 60, 5),
    ("P002", "Wheat", "Grocery", 45, 5),
    ("P003", "Sugar", "Grocery", 50, 4),
    ("P004", "Cooking Oil", "Grocery", 120, 6),
    ("P005", "Milk", "Dairy", 40, 2),
    ("P006", "Bread", "Bakery", 35, 2),
    ("P007", "Eggs", "Dairy", 7, 2),
    ("P008", "Biscuits", "Snacks", 30, 4),
    ("P009", "Soap", "Personal Care", 35, 7),
    ("P010", "Shampoo", "Personal Care", 120, 7),
]

seasons = {
    1: "Winter",
    2: "Winter",
    3: "Summer",
    4: "Summer",
    5: "Summer",
    6: "Monsoon",
    7: "Monsoon",
    8: "Monsoon",
    9: "Monsoon",
    10: "Autumn",
    11: "Winter",
    12: "Winter",
}

# Base daily demand for each product
base_demand = {
    "Rice": 25,
    "Wheat": 18,
    "Sugar": 20,
    "Cooking Oil": 12,
    "Milk": 35,
    "Bread": 30,
    "Eggs": 45,
    "Biscuits": 22,
    "Soap": 10,
    "Shampoo": 7,
}

# -----------------------------
# Generate dataset
# -----------------------------
rows = []

current_date = START_DATE

while current_date <= END_DATE:

    day_of_week = current_date.strftime("%A")
    month = current_date.month
    season = seasons[month]

    # Simple holiday simulation
    holiday = 1 if (
        (month == 1 and current_date.day in [1, 14, 26])
        or
        (month == 8 and current_date.day == 15)
        or
        (month == 10 and current_date.day in [2, 20, 21])
        or
        (month == 12 and current_date.day == 25)
    ) else 0

    for product_id, product_name, category, price, supplier_lead_days in products:

        demand = base_demand[product_name]

        # Weekend demand increase
        if day_of_week in ["Saturday", "Sunday"]:
            demand *= 1.15

        # Holiday demand increase
        if holiday == 1:
            demand *= 1.35

        # Seasonal effects
        if season == "Summer":
            if product_name in ["Milk", "Cooking Oil", "Biscuits"]:
                demand *= 1.10

        if season == "Monsoon":
            if product_name in ["Biscuits", "Soap", "Shampoo"]:
                demand *= 1.12

        # Random demand variation
        quantity_sold = max(
            0,
            int(random.gauss(demand, demand * 0.15))
        )

        # Simulated available stock
        stock_available = random.randint(
            max(20, quantity_sold),
            max(100, quantity_sold * 6)
        )

        # Small price variation
        selling_price = round(
            price * random.uniform(0.95, 1.05),
            2
        )

        rows.append([
            current_date,
            product_id,
            product_name,
            category,
            quantity_sold,
            selling_price,
            stock_available,
            day_of_week,
            month,
            season,
            holiday,
            supplier_lead_days
        ])

    current_date += timedelta(days=1)


# -----------------------------
# Save CSV
# -----------------------------
file_name = "sales_data.csv"

headers = [
    "date",
    "product_id",
    "product_name",
    "category",
    "quantity_sold",
    "selling_price",
    "stock_available",
    "day_of_week",
    "month",
    "season",
    "holiday",
    "supplier_lead_days"
]

with open(file_name, "w", newline="", encoding="utf-8") as file:

    writer = csv.writer(file)

    writer.writerow(headers)
    writer.writerows(rows)

print("Dataset created successfully!")
print(f"Total rows: {len(rows)}")
print(f"File: {file_name}")