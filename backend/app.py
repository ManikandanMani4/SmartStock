from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
import pandas as pd

app = Flask(__name__)
CORS(app)

# =========================================================
# LOAD MODEL
# =========================================================

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "ml",
    "smartstock_model.pkl"
)

model_data = joblib.load(MODEL_PATH)

model = model_data["model"]
features = model_data["features"]
product_mapping = model_data["product_mapping"]

print("===================================")
print("SmartStock AI Model Loaded")
print("===================================")
print("Features:", features)
print("Products:", len(product_mapping))


# =========================================================
# HOME
# =========================================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "message": "SmartStock AI Backend is running",
        "model_loaded": True
    })


# =========================================================
# HEALTH CHECK
# =========================================================

@app.route("/api/health", methods=["GET"])
def health():

    return jsonify({
        "status": "healthy",
        "model_loaded": True,
        "model_type": "Random Forest"
    })


# =========================================================
# GET PRODUCTS
# =========================================================

@app.route("/api/products", methods=["GET"])
def get_products():

    return jsonify({
        "success": True,
        "products": list(product_mapping.keys())
    })


# =========================================================
# PREDICTION
# =========================================================

@app.route("/api/predict", methods=["POST"])
def predict():

    try:

        data = request.get_json()

        print("\nPrediction request:")
        print(data)

        # -------------------------------------------------
        # REQUIRED DATA
        # -------------------------------------------------

        product_id = str(data["product_id"])

        selling_price = float(
            data["selling_price"]
        )

        stock_available = float(
            data["stock_available"]
        )

        day = int(data["day"])

        day_of_week_num = int(
            data["day_of_week_num"]
        )

        week = int(data["week"])

        month = int(data["month"])

        holiday = int(data["holiday"])

        supplier_lead_days = int(
            data["supplier_lead_days"]
        )

        sales_lag_1 = float(
            data["sales_lag_1"]
        )

        sales_lag_7 = float(
            data["sales_lag_7"]
        )

        sales_rolling_7 = float(
            data["sales_rolling_7"]
        )

        # -------------------------------------------------
        # PRODUCT ID ENCODING
        # -------------------------------------------------

        if product_id not in product_mapping:

            return jsonify({
                "success": False,
                "error": "Product ID not found in trained dataset"
            }), 400

        product_id_encoded = product_mapping[
            product_id
        ]

        # -------------------------------------------------
        # CREATE MODEL INPUT
        # -------------------------------------------------

        input_data = pd.DataFrame([{

            "product_id_encoded":
                product_id_encoded,

            "selling_price":
                selling_price,

            "stock_available":
                stock_available,

            "day":
                day,

            "day_of_week_num":
                day_of_week_num,

            "week":
                week,

            "month":
                month,

            "holiday":
                holiday,

            "supplier_lead_days":
                supplier_lead_days,

            "sales_lag_1":
                sales_lag_1,

            "sales_lag_7":
                sales_lag_7,

            "sales_rolling_7":
                sales_rolling_7

        }])

        # Make sure feature order matches training
        input_data = input_data[features]

        # -------------------------------------------------
        # AI PREDICTION
        # -------------------------------------------------

        prediction = model.predict(
            input_data
        )[0]

        predicted_demand = max(
            0,
            round(float(prediction))
        )

        # -------------------------------------------------
        # STOCK ANALYSIS
        # -------------------------------------------------

        stock_difference = (
            predicted_demand -
            stock_available
        )

        if stock_difference <= 0:

            risk = "Low"
            recommended_order = 0

        elif stock_difference <= predicted_demand * 0.30:

            risk = "Medium"
            recommended_order = round(
                stock_difference
            )

        else:

            risk = "High"
            recommended_order = round(
                stock_difference
            )

        # -------------------------------------------------
        # RESPONSE
        # -------------------------------------------------

        result = {

            "success": True,

            "predicted_demand":
                predicted_demand,

            "current_stock":
                stock_available,

            "stock_difference":
                stock_difference,

            "risk":
                risk,

            "recommended_order":
                recommended_order

        }

        print("\nPrediction result:")
        print(result)

        return jsonify(result)

    except KeyError as e:

        return jsonify({
            "success": False,
            "error": f"Missing field: {str(e)}"
        }), 400

    except Exception as e:

        print("Prediction error:", e)

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# =========================================================
# RUN SERVER
# =========================================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )