import { useEffect, useState } from "react";

function Reports() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    setProducts(
      JSON.parse(
        localStorage.getItem("smartstock_products") || "[]"
      )
    );

    setSales(
      JSON.parse(
        localStorage.getItem("smartstock_sales") || "[]"
      )
    );

    setPurchases(
      JSON.parse(
        localStorage.getItem("smartstock_purchases") || "[]"
      )
    );

    setPredictions(
      JSON.parse(
        localStorage.getItem("smartstock_predictions") || "[]"
      )
    );
  };

  // =====================================================
  // CALCULATIONS
  // =====================================================

  const totalSales = sales.reduce(
    (sum, sale) =>
      sum + Number(sale.totalAmount || 0),
    0
  );

  const totalPurchases = purchases.reduce(
    (sum, purchase) =>
      sum + Number(purchase.totalAmount || 0),
    0
  );

  const inventoryValue = products.reduce(
    (sum, product) =>
      sum +
      Number(product.currentStock || 0) *
        Number(product.sellingPrice || 0),
    0
  );

  const unitsSold = sales.reduce(
    (sum, sale) =>
      sum + Number(sale.quantitySold || 0),
    0
  );

  const lowStock = products.filter(
    (product) =>
      Number(product.currentStock || 0) <= 20
  ).length;

  const highRisk = predictions.filter(
    (prediction) =>
      prediction.risk === "High"
  ).length;

  const mediumRisk = predictions.filter(
    (prediction) =>
      prediction.risk === "Medium"
  ).length;

  const recommendedOrders =
    predictions.filter(
      (prediction) =>
        Number(
          prediction.recommended_order || 0
        ) > 0
    ).length;

  // =====================================================
  // TOP PRODUCTS
  // =====================================================

  const productSales = {};

  sales.forEach((sale) => {
    const name = sale.productName;

    if (!productSales[name]) {
      productSales[name] = 0;
    }

    productSales[name] += Number(
      sale.quantitySold || 0
    );
  });

  const topProducts = Object.entries(
    productSales
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // =====================================================
  // MONEY FORMAT
  // =====================================================

  const formatMoney = (value) => {
    return `₹${Number(value).toLocaleString("en-IN")}`;
  };

  return (
    <div className="content">

      {/* HEADER */}

      <div className="page-heading">

        <div>
          <h1>
            Reports
          </h1>

          <p>
            Business and AI inventory performance.
          </p>
        </div>

        <span className="ai-badge">
          SMART REPORTS
        </span>

      </div>


      {/* =================================================
          FINANCIAL SUMMARY
      ================================================= */}

      <div className="stats-grid">

        <div className="stat-card">

          <div className="stat-icon green">
            ₹
          </div>

          <div>
            <p>Total Sales</p>

            <h2>
              {formatMoney(totalSales)}
            </h2>

            <small>
              Revenue generated
            </small>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon orange">
            🛒
          </div>

          <div>
            <p>Total Purchases</p>

            <h2>
              {formatMoney(totalPurchases)}
            </h2>

            <small>
              Purchase spending
            </small>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon blue">
            📦
          </div>

          <div>
            <p>Inventory Value</p>

            <h2>
              {formatMoney(inventoryValue)}
            </h2>

            <small>
              Current stock value
            </small>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon purple">
            📊
          </div>

          <div>
            <p>Units Sold</p>

            <h2>
              {unitsSold}
            </h2>

            <small>
              Total quantity sold
            </small>
          </div>

        </div>

      </div>


      {/* =================================================
          TOP SELLING PRODUCTS
      ================================================= */}

      <div className="card">

        <div className="card-header">

          <div>

            <h2>
              Top Selling Products
            </h2>

            <p>
              Products ranked by quantity sold.
            </p>

          </div>

        </div>


        {topProducts.length === 0 ? (

          <div className="empty-product">

            <div className="empty-product-icon">
              📊
            </div>

            <h3>
              No Sales Data
            </h3>

            <p>
              Record sales to generate this report.
            </p>

          </div>

        ) : (

          <div className="product-list">

            {topProducts.map(
              ([productName, quantity], index) => (

                <div
                  className="product-row"
                  key={productName}
                >

                  <div className="product-icon">
                    #{index + 1}
                  </div>

                  <div className="product-details">

                    <strong>
                      {productName}
                    </strong>

                    <p>
                      Top selling product
                    </p>

                  </div>

                  <div className="stock-info">

                    <small>
                      Units Sold
                    </small>

                    <strong>
                      {quantity}
                    </strong>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>


      {/* =================================================
          AI REPORT
      ================================================= */}

      <div className="card">

        <div className="card-header">

          <div>

            <h2>
              🤖 AI Inventory Report
            </h2>

            <p>
              Current SmartStock AI analysis.
            </p>

          </div>

          <span className="ai-badge">
            AI
          </span>

        </div>


        <div className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon blue">
              🤖
            </div>

            <div>

              <p>
                Products Analyzed
              </p>

              <h2>
                {predictions.length}
              </h2>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon orange">
              🔴
            </div>

            <div>

              <p>
                High Risk
              </p>

              <h2>
                {highRisk}
              </h2>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon orange">
              🟠
            </div>

            <div>

              <p>
                Medium Risk
              </p>

              <h2>
                {mediumRisk}
              </h2>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon purple">
              📦
            </div>

            <div>

              <p>
                Reorder Required
              </p>

              <h2>
                {recommendedOrders}
              </h2>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          INVENTORY ALERT
      ================================================= */}

      <div className="ai-product-info">

        <div className="status-dot"></div>

        <div>

          <strong>
            SmartStock Report Status
          </strong>

          <p>

            {lowStock === 0
              ? "Your current inventory has no low-stock products."
              : `${lowStock} product${
                  lowStock !== 1
                    ? "s are"
                    : " is"
                } currently low in stock.`}

            {" "}

            {recommendedOrders > 0 &&
              `${recommendedOrders} AI reorder recommendation${
                recommendedOrders !== 1
                  ? "s are"
                  : " is"
              } available.`}

          </p>

        </div>

      </div>

    </div>
  );
}

export default Reports;