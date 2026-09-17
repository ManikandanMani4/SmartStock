import { useEffect, useState } from "react";

function Forecast() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);

  const [selectedProduct, setSelectedProduct] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // =====================================================
  // LOAD PRODUCTS AND SALES
  // =====================================================

  useEffect(() => {
    const savedProducts =
      localStorage.getItem("smartstock_products");

    const savedSales =
      localStorage.getItem("smartstock_sales");

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }

    if (savedSales) {
      setSales(JSON.parse(savedSales));
    }
  }, []);

  // =====================================================
  // SELECT PRODUCT
  // =====================================================

  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
    setResult(null);
  };

  // =====================================================
  // SALES FEATURES
  // =====================================================

  const calculateSalesFeatures = (productName) => {
    const productSales = sales
      .filter(
        (sale) =>
          sale.productName === productName
      )
      .sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      );

    if (productSales.length === 0) {
      return {
        salesLag1: 0,
        salesLag7: 0,
        salesRolling7: 0,
      };
    }

    const salesLag1 =
      Number(
        productSales[0]?.quantitySold
      ) || 0;

    const salesLag7 =
      Number(
        productSales[6]?.quantitySold
      ) || 0;

    const last7Sales =
      productSales
        .slice(0, 7)
        .map(
          (sale) =>
            Number(
              sale.quantitySold
            ) || 0
        );

    const salesRolling7 =
      last7Sales.length > 0
        ? last7Sales.reduce(
            (sum, value) =>
              sum + value,
            0
          ) / last7Sales.length
        : 0;

    return {
      salesLag1,
      salesLag7,
      salesRolling7,
    };
  };

  // =====================================================
  // AI PREDICTION
  // =====================================================

  const handlePredict = async () => {
    if (!selectedProduct) {
      alert("Please select a product.");
      return;
    }

    const product = products.find(
      (item) =>
        item.productName ===
        selectedProduct
    );

    if (!product) {
      alert("Product not found.");
      return;
    }

    // =================================================
    // IMPORTANT PRODUCT ID CHECK
    // =================================================

    const productId =
      product.productId ||
      product.product_id;

    if (!productId) {
      alert(
        "This product does not have a Product ID.\n\n" +
        "Please delete this old product and add it again from the Products page."
      );

      console.error(
        "Product without Product ID:",
        product
      );

      return;
    }

    console.log(
      "Selected Product:",
      product
    );

    console.log(
      "Product ID:",
      productId
    );

    setLoading(true);
    setResult(null);

    try {
      // =================================================
      // SALES FEATURES
      // =================================================

      const salesFeatures =
        calculateSalesFeatures(
          selectedProduct
        );

      const today = new Date();

      const day =
        today.getDate();

      // Python:
      // Monday = 0
      // JavaScript:
      // Sunday = 0
      //
      // Convert JavaScript day to Python day
      const dayOfWeekNum =
        (today.getDay() + 6) % 7;

      const month =
        today.getMonth() + 1;

      const week =
        getWeekNumber(today);

      // =================================================
      // REQUEST DATA
      // =================================================

      const requestBody = {
        product_id:
          String(productId),

        selling_price:
          Number(
            product.sellingPrice
          ),

        stock_available:
          Number(
            product.currentStock
          ),

        day:
          day,

        day_of_week_num:
          dayOfWeekNum,

        week:
          week,

        month:
          month,

        holiday:
          0,

        supplier_lead_days:
          Number(
            product.leadDays
          ),

        sales_lag_1:
          Number(
            salesFeatures.salesLag1
          ),

        sales_lag_7:
          Number(
            salesFeatures.salesLag7
          ),

        sales_rolling_7:
          Number(
            salesFeatures.salesRolling7
          ),
      };

      // =================================================
      // DEBUG
      // =================================================

      console.log(
        "================================"
      );

      console.log(
        "SMARTSTOCK AI REQUEST"
      );

      console.log(
        requestBody
      );

      console.log(
        "================================"
      );

      // =================================================
      // CALL FLASK
      // =================================================

      const response =
        await fetch(
          "http://127.0.0.1:5000/api/predict",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                requestBody
              ),
          }
        );

      const data =
        await response.json();

      console.log(
        "AI RESPONSE:",
        data
      );

      // =================================================
      // ERROR
      // =================================================

      if (!response.ok) {
        throw new Error(
          data.error ||
            "AI prediction failed."
        );
      }

      // =================================================
      // ADD PRODUCT INFORMATION
      // =================================================

      const prediction = {
        ...data,

        product_id:
          String(productId),

        product_name:
          product.productName,
      };

      // =================================================
      // SAVE PREDICTION
      // =================================================

      const existingPredictions =
        JSON.parse(
          localStorage.getItem(
            "smartstock_predictions"
          ) || "[]"
        );

      const updatedPredictions =
        existingPredictions.filter(
          (item) =>
            String(
              item.product_id
            ) !==
            String(productId)
        );

      updatedPredictions.push(
        prediction
      );

      localStorage.setItem(
        "smartstock_predictions",
        JSON.stringify(
          updatedPredictions
        )
      );

      // =================================================
      // SHOW RESULT
      // =================================================

      setResult(prediction);

    } catch (error) {
      console.error(
        "Prediction error:",
        error
      );

      alert(
        "AI prediction failed: " +
          error.message
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="content">

      {/* HEADER */}

      <div className="page-heading">

        <div>

          <h1>
            Demand Forecast
          </h1>

          <p>
            AI-powered future demand
            prediction.
          </p>

        </div>

        <span className="ai-badge">
          {loading
            ? "AI ANALYZING..."
            : "AI MODEL"}
        </span>

      </div>

      {/* FORECAST CARD */}

      <div className="forecast-box">

        <h2>
          AI Demand Prediction
        </h2>

        <p>
          Select a product. SmartStock
          automatically analyzes your
          sales history.
        </p>

        {/* PRODUCT SELECT */}

        <label>
          Select Product
        </label>

        <select
          value={selectedProduct}
          onChange={
            handleProductChange
          }
        >

          <option value="">
            Select Product
          </option>

          {products.map(
            (product) => (

              <option
                key={product.id}
                value={
                  product.productName
                }
              >
                {product.productName}
                {" "}
                (
                {product.productId ||
                  "No ID"}
                )
              </option>

            )
          )}

        </select>

        {/* PRODUCT INFORMATION */}

        {selectedProduct && (

          <div className="prediction-demo">

            <span>
              Product
            </span>

            <strong>
              {selectedProduct}
            </strong>

            <small>

              Product ID:{" "}
              {
                products.find(
                  (item) =>
                    item.productName ===
                    selectedProduct
                )?.productId ||
                "Missing"
              }

              {" • "}

              Sales history will be
              analyzed automatically.

            </small>

          </div>

        )}

        {/* BUTTON */}

        <button
          className="primary-button"
          onClick={handlePredict}
          disabled={loading}
        >

          {loading
            ? "🤖 Analyzing..."
            : "🤖 Analyze Demand"}

        </button>

        {/* RESULT */}

        {result && (

          <div className="ai-result">

            <h2>
              AI Analysis Result
            </h2>

            <div className="result-grid">

              {/* PREDICTED DEMAND */}

              <div className="result-card">

                <span>
                  Predicted Demand
                </span>

                <strong>
                  {
                    result.predicted_demand
                  }
                </strong>

                <small>
                  units
                </small>

              </div>

              {/* CURRENT STOCK */}

              <div className="result-card">

                <span>
                  Current Stock
                </span>

                <strong>
                  {
                    result.current_stock
                  }
                </strong>

                <small>
                  units
                </small>

              </div>

              {/* RISK */}

              <div className="result-card">

                <span>
                  Stock Risk
                </span>

                <strong>
                  {result.risk}
                </strong>

                <small>
                  AI assessment
                </small>

              </div>

              {/* ORDER */}

              <div className="result-card">

                <span>
                  Recommended Order
                </span>

                <strong>
                  {
                    result.recommended_order
                  }
                </strong>

                <small>
                  units
                </small>

              </div>

            </div>

            {/* AI MESSAGE */}

            <div className="ai-product-info">

              <div className="status-dot"></div>

              <div>

                <strong>
                  SmartStock AI
                  Recommendation
                </strong>

                <p>

                  Based on current
                  stock and historical
                  sales, SmartStock
                  recommends ordering{" "}

                  <strong>
                    {
                      result.recommended_order
                    }{" "}
                    units
                  </strong>.

                </p>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

// =====================================================
// WEEK NUMBER
// =====================================================

function getWeekNumber(date) {
  const tempDate =
    new Date(date);

  tempDate.setHours(
    0,
    0,
    0,
    0
  );

  tempDate.setDate(
    tempDate.getDate() +
      4 -
      (tempDate.getDay() || 7)
  );

  const yearStart =
    new Date(
      tempDate.getFullYear(),
      0,
      1
    );

  return Math.ceil(
    (
      (
        tempDate -
        yearStart
      ) /
        86400000 +
        1
    ) / 7
  );
}

export default Forecast;