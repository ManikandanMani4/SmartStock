import { useEffect, useState } from "react";

import {
  Package,
  AlertTriangle,
  IndianRupee,
  TrendingUp,
} from "lucide-react";

import StatCard from "../components/StatCard";
import DemandChart from "../components/DemandChart";
import RecommendationCard from "../components/RecommendationCard";


function Dashboard() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [predictions, setPredictions] = useState([]);


  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    loadDashboardData();

    // Refresh when localStorage changes
    const handleStorageChange = () => {
      loadDashboardData();
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);


  // =====================================================
  // LOAD PRODUCTS + SALES + AI RESULTS
  // =====================================================

  const loadDashboardData = () => {
    const savedProducts = JSON.parse(
      localStorage.getItem(
        "smartstock_products"
      ) || "[]"
    );

    const savedSales = JSON.parse(
      localStorage.getItem(
        "smartstock_sales"
      ) || "[]"
    );

    const savedPredictions = JSON.parse(
      localStorage.getItem(
        "smartstock_predictions"
      ) || "[]"
    );

    setProducts(savedProducts);
    setSales(savedSales);
    setPredictions(savedPredictions);
  };


  // =====================================================
  // STATISTICS
  // =====================================================

  const totalProducts =
    products.length;


  const lowStockProducts =
    products.filter(
      (product) =>
        Number(product.currentStock) <= 20
    );


  const inventoryValue =
    products.reduce(
      (total, product) =>
        total +
        Number(product.currentStock || 0) *
        Number(product.sellingPrice || 0),
      0
    );


  const predictedDemand =
    predictions.reduce(
      (total, prediction) =>
        total +
        Number(
          prediction.predicted_demand || 0
        ),
      0
    );


  // =====================================================
  // FORMAT MONEY
  // =====================================================

  const formatMoney = (value) => {
    if (value >= 100000) {
      return `₹${(
        value / 100000
      ).toFixed(2)}L`;
    }

    if (value >= 1000) {
      return `₹${(
        value / 1000
      ).toFixed(1)}K`;
    }

    return `₹${value.toFixed(0)}`;
  };


  // =====================================================
  // RECOMMENDATIONS
  // =====================================================

  const recommendations =
    predictions
      .map((prediction) => {

        const product =
          products.find(
            (item) =>
              item.productId ===
              prediction.product_id
          );

        return {
          product:
            product?.productName ||
            prediction.product_id,

          currentStock:
            prediction.current_stock,

          predictedDemand:
            prediction.predicted_demand,

          orderQuantity:
            prediction.recommended_order,

          risk:
            prediction.risk,
        };
      })
      .slice(0, 5);


  // =====================================================
  // RECENT SALES
  // =====================================================

  const recentSales =
    sales
      .slice()
      .sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      )
      .slice(0, 5);


  return (
    <div>

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="page-title">

        <div>

          <h1>
            Good morning, Admin 👋
          </h1>

          <p>
            Here's what's happening with
            your inventory today.
          </p>

        </div>

      </div>


      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="stats-grid">

        <StatCard
          title="Total Products"
          value={totalProducts}
          subtitle="Products in inventory"
          icon={
            <Package size={22} />
          }
          type="blue"
        />


        <StatCard
          title="Low Stock"
          value={
            lowStockProducts.length
          }
          subtitle="Needs attention"
          icon={
            <AlertTriangle size={22} />
          }
          type="orange"
        />


        <StatCard
          title="Inventory Value"
          value={
            formatMoney(
              inventoryValue
            )
          }
          subtitle="Current stock value"
          icon={
            <IndianRupee size={22} />
          }
          type="green"
        />


        <StatCard
          title="Predicted Demand"
          value={
            predictedDemand
          }
          subtitle="From AI analysis"
          icon={
            <TrendingUp size={22} />
          }
          type="purple"
        />

      </div>


      {/* =================================================
          MAIN GRID
      ================================================= */}

      <div className="dashboard-grid">

        {/* DEMAND CHART */}

        <DemandChart />


        {/* AI RECOMMENDATIONS */}

        <div className="recommendations">

          <div className="card-header">

            <div>

              <h3>
                AI Recommendations
              </h3>

              <p>
                Smart reorder suggestions
              </p>

            </div>

            <span className="ai-badge">
              AI
            </span>

          </div>


          {recommendations.length === 0 ? (

            <div className="empty-product">

              <div className="empty-product-icon">
                🤖
              </div>

              <h3>
                No AI Analysis Yet
              </h3>

              <p>
                Go to Forecast and analyze
                your products.
              </p>

            </div>

          ) : (

            recommendations.map(
              (item, index) => (

                <RecommendationCard
                  key={index}
                  product={
                    item.product
                  }
                  currentStock={
                    item.currentStock
                  }
                  predictedDemand={
                    item.predictedDemand
                  }
                  orderQuantity={
                    item.orderQuantity
                  }
                  risk={
                    item.risk
                  }
                />

              )
            )

          )}

        </div>

      </div>


      {/* =================================================
          INVENTORY ALERTS
      ================================================= */}

      <div className="section">

        <div className="section-header">

          <h3>
            Inventory Alerts
          </h3>

        </div>


        <div className="alert-list">

          {lowStockProducts.length === 0 ? (

            <div className="alert-item">

              <div>

                <strong>
                  Inventory looks healthy
                </strong>

                <p>
                  No products are currently
                  below the low-stock threshold.
                </p>

              </div>

            </div>

          ) : (

            lowStockProducts
              .slice(0, 5)
              .map((product) => (

                <div
                  className="alert-item danger"
                  key={product.id}
                >

                  <AlertTriangle
                    size={20}
                  />

                  <div>

                    <strong>
                      {product.productName}
                      {" "}stock is low
                    </strong>

                    <p>
                      Current stock:
                      {" "}
                      {product.currentStock}
                      {" "}units.
                    </p>

                  </div>

                </div>

              ))

          )}

        </div>

      </div>


      {/* =================================================
          RECENT SALES
      ================================================= */}

      <div className="section">

        <div className="section-header">

          <h3>
            Recent Sales
          </h3>

        </div>


        {recentSales.length === 0 ? (

          <div className="card">

            <p>
              No sales recorded yet.
            </p>

          </div>

        ) : (

          <div className="card">

            {recentSales.map(
              (sale) => (

                <div
                  className="product-row"
                  key={sale.id}
                >

                  <div className="product-icon">
                    🛒
                  </div>

                  <div className="product-details">

                    <strong>
                      {sale.productName}
                    </strong>

                    <p>
                      {sale.date}
                      {" • "}
                      {sale.quantitySold}
                      {" units"}
                    </p>

                  </div>

                  <div className="stock-info">

                    <small>
                      Amount
                    </small>

                    <strong>
                      ₹{sale.totalAmount}
                    </strong>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default Dashboard;