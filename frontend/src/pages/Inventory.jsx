import { useEffect, useState } from "react";

function Inventory() {
  const [products, setProducts] = useState([]);
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    loadInventory();

    const refresh = () => {
      loadInventory();
    };

    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const loadInventory = () => {
    const savedProducts = JSON.parse(
      localStorage.getItem("smartstock_products") || "[]"
    );

    const savedPredictions = JSON.parse(
      localStorage.getItem("smartstock_predictions") || "[]"
    );

    setProducts(savedProducts);
    setPredictions(savedPredictions);
  };

  const getPrediction = (product) => {
    return predictions.find(
      (prediction) =>
        prediction.product_id === product.productId
    );
  };

  const getStockStatus = (product) => {
    const prediction = getPrediction(product);

    if (prediction) {
      return prediction.risk;
    }

    const stock = Number(product.currentStock);

    if (stock <= 20) {
      return "High";
    }

    if (stock <= 50) {
      return "Medium";
    }

    return "Low";
  };

  const getStatusClass = (status) => {
    if (status === "High") {
      return "risk high";
    }

    if (status === "Medium") {
      return "risk medium";
    }

    return "risk low";
  };

  const totalUnits = products.reduce(
    (sum, product) =>
      sum + Number(product.currentStock || 0),
    0
  );

  const lowStock = products.filter(
    (product) =>
      Number(product.currentStock) <= 20
  ).length;

  const reorderItems = products.filter((product) => {
    const prediction = getPrediction(product);

    return (
      prediction &&
      Number(prediction.recommended_order) > 0
    );
  });

  return (
    <div className="content">

      {/* HEADER */}

      <div className="page-heading">

        <div>
          <h1>Inventory</h1>

          <p>
            Monitor stock levels and AI reorder recommendations.
          </p>
        </div>

        <span className="ai-badge">
          AI MONITORING
        </span>

      </div>


      {/* SUMMARY */}

      <div className="stats-grid">

        <div className="stat-card">

          <div className="stat-icon blue">
            📦
          </div>

          <div>
            <p>Total Products</p>

            <h2>
              {products.length}
            </h2>

            <small>
              Active products
            </small>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon green">
            📊
          </div>

          <div>
            <p>Total Units</p>

            <h2>
              {totalUnits}
            </h2>

            <small>
              Current stock
            </small>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon orange">
            ⚠️
          </div>

          <div>
            <p>Low Stock</p>

            <h2>
              {lowStock}
            </h2>

            <small>
              Needs attention
            </small>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon purple">
            🤖
          </div>

          <div>
            <p>AI Reorders</p>

            <h2>
              {reorderItems.length}
            </h2>

            <small>
              Recommended
            </small>
          </div>

        </div>

      </div>


      {/* INVENTORY TABLE */}

      <div className="card">

        <div className="card-header">

          <div>
            <h2>
              Current Inventory
            </h2>

            <p>
              Live stock information from your products.
            </p>
          </div>

        </div>


        {products.length === 0 ? (

          <div className="empty-product">

            <div className="empty-product-icon">
              📦
            </div>

            <h3>
              No Products
            </h3>

            <p>
              Add products from the Products page.
            </p>

          </div>

        ) : (

          <div className="product-list">

            {products.map((product) => {

              const prediction =
                getPrediction(product);

              const status =
                getStockStatus(product);

              return (

                <div
                  className="product-row"
                  key={product.id}
                >

                  <div className="product-icon">
                    📦
                  </div>


                  <div className="product-details">

                    <strong>
                      {product.productName}
                    </strong>

                    <p>
                      {product.category}
                      {" • "}
                      ₹{product.sellingPrice}
                    </p>

                    <p>
                      Supplier: {product.supplier}
                    </p>

                  </div>


                  <div className="stock-info">

                    <small>
                      Stock
                    </small>

                    <strong>
                      {product.currentStock}
                    </strong>

                  </div>


                  {prediction && (

                    <div className="stock-info">

                      <small>
                        AI Demand
                      </small>

                      <strong>
                        {prediction.predicted_demand}
                      </strong>

                    </div>

                  )}


                  <div>

                    <span
                      className={getStatusClass(status)}
                    >
                      {status}
                    </span>

                  </div>


                  {prediction &&
                    Number(
                      prediction.recommended_order
                    ) > 0 && (

                    <div className="stock-info">

                      <small>
                        Reorder
                      </small>

                      <strong>
                        {prediction.recommended_order}
                      </strong>

                    </div>

                  )}

                </div>

              );
            })}

          </div>

        )}

      </div>


      {/* AI REORDER SECTION */}

      {reorderItems.length > 0 && (

        <div className="card">

          <div className="card-header">

            <div>

              <h2>
                🤖 AI Reorder Recommendations
              </h2>

              <p>
                Products that may require additional stock.
              </p>

            </div>

          </div>


          {reorderItems.map((product) => {

            const prediction =
              getPrediction(product);

            return (

              <div
                className="alert-item warning"
                key={product.id}
              >

                <span>
                  ⚠️
                </span>

                <div>

                  <strong>
                    {product.productName}
                  </strong>

                  <p>
                    Current stock:{" "}
                    {product.currentStock}
                    {" • "}
                    Predicted demand:{" "}
                    {prediction.predicted_demand}
                    {" • "}
                    Recommended order:{" "}
                    <strong>
                      {prediction.recommended_order}
                    </strong>
                    {" units"}
                  </p>

                </div>

              </div>

            );

          })}

        </div>

      )}


      {/* AI STATUS */}

      <div className="ai-product-info">

        <div className="status-dot"></div>

        <div>

          <strong>
            SmartStock AI Inventory Monitoring
          </strong>

          <p>
            Inventory is connected to your product
            data and AI demand predictions.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Inventory;