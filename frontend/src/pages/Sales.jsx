import { useEffect, useState } from "react";

function Sales() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);

  const [form, setForm] = useState({
    productId: "",
    productName: "",
    date: new Date().toISOString().split("T")[0],
    quantitySold: "",
    sellingPrice: "",
  });

  // =====================================================
  // LOAD PRODUCTS AND SALES
  // =====================================================

  useEffect(() => {
    const savedProducts = localStorage.getItem(
      "smartstock_products"
    );

    const savedSales = localStorage.getItem(
      "smartstock_sales"
    );

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }

    if (savedSales) {
      setSales(JSON.parse(savedSales));
    }
  }, []);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // PRODUCT CHANGE
  // =====================================================

  const handleProductChange = (event) => {
    const productId = event.target.value;

    const product = products.find(
      (item) =>
        String(item.productId) === String(productId)
    );

    setForm((previous) => ({
      ...previous,
      productId: productId,
      productName: product
        ? product.productName
        : "",
      sellingPrice: product
        ? product.sellingPrice
        : "",
    }));
  };

  // =====================================================
  // ADD SALE
  // =====================================================

  const handleAddSale = (event) => {
    event.preventDefault();

    if (
      form.productId === "" ||
      form.date === "" ||
      form.quantitySold === "" ||
      form.sellingPrice === ""
    ) {
      alert("Please fill all sales details.");
      return;
    }

    const product = products.find(
      (item) =>
        String(item.productId) ===
        String(form.productId)
    );

    if (!product) {
      alert("Please select a valid product.");
      return;
    }

    const quantity = Number(
      form.quantitySold
    );

    const price = Number(
      form.sellingPrice
    );

    if (quantity <= 0) {
      alert("Quantity sold must be greater than 0.");
      return;
    }

    if (price < 0) {
      alert("Selling price cannot be negative.");
      return;
    }

    // =================================================
    // CREATE SALE
    // =================================================

    const newSale = {
      id: Date.now(),

      // Important for AI
      productId: product.productId,

      productName: product.productName,

      date: form.date,

      quantitySold: quantity,

      sellingPrice: price,

      totalAmount: quantity * price,
    };

    console.log(
      "New Sale:",
      newSale
    );

    // =================================================
    // SAVE SALES
    // =================================================

    const updatedSales = [
      newSale,
      ...sales,
    ];

    setSales(updatedSales);

    localStorage.setItem(
      "smartstock_sales",
      JSON.stringify(updatedSales)
    );

    // =================================================
    // UPDATE PRODUCT STOCK
    // =================================================

    const updatedProducts =
      products.map((item) => {

        if (
          String(item.productId) ===
          String(product.productId)
        ) {
          const currentStock =
            Number(
              item.currentStock
            );

          const newStock =
            Math.max(
              0,
              currentStock - quantity
            );

          return {
            ...item,
            currentStock: newStock,
          };
        }

        return item;
      });

    setProducts(updatedProducts);

    localStorage.setItem(
      "smartstock_products",
      JSON.stringify(updatedProducts)
    );

    // =================================================
    // CLEAR FORM
    // =================================================

    setForm({
      productId: "",
      productName: "",
      date: new Date()
        .toISOString()
        .split("T")[0],
      quantitySold: "",
      sellingPrice: "",
    });

    alert(
      "Sale recorded successfully!"
    );
  };

  // =====================================================
  // DELETE SALE
  // =====================================================

  const handleDeleteSale = (saleId) => {
    const confirmDelete =
      window.confirm(
        "Delete this sale?"
      );

    if (!confirmDelete) {
      return;
    }

    const saleToDelete =
      sales.find(
        (sale) =>
          sale.id === saleId
      );

    if (!saleToDelete) {
      return;
    }

    // Restore stock
    const updatedProducts =
      products.map((product) => {

        if (
          String(product.productId) ===
          String(
            saleToDelete.productId
          )
        ) {
          return {
            ...product,

            currentStock:
              Number(
                product.currentStock
              ) +
              Number(
                saleToDelete.quantitySold
              ),
          };
        }

        return product;
      });

    setProducts(updatedProducts);

    localStorage.setItem(
      "smartstock_products",
      JSON.stringify(
        updatedProducts
      )
    );

    // Remove sale
    const updatedSales =
      sales.filter(
        (sale) =>
          sale.id !== saleId
      );

    setSales(updatedSales);

    localStorage.setItem(
      "smartstock_sales",
      JSON.stringify(
        updatedSales
      )
    );
  };

  // =====================================================
  // TOTAL SALES
  // =====================================================

  const totalRevenue =
    sales.reduce(
      (total, sale) =>
        total +
        Number(
          sale.totalAmount || 0
        ),
      0
    );

  const totalUnits =
    sales.reduce(
      (total, sale) =>
        total +
        Number(
          sale.quantitySold || 0
        ),
      0
    );

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="content">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="page-heading">

        <div>
          <h1>Sales</h1>

          <p>
            Record and manage your
            daily product sales.
          </p>
        </div>

        <span className="ai-badge">
          AI DATA
        </span>

      </div>

      {/* =================================================
          SALES SUMMARY
      ================================================= */}

      <div className="stats-grid">

        <div className="stat-card">

          <div className="stat-icon blue">
            📊
          </div>

          <div>
            <p>Total Sales</p>

            <h2>
              {sales.length}
            </h2>

            <small>
              Transactions
            </small>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon green">
            ₹
          </div>

          <div>
            <p>Total Revenue</p>

            <h2>
              ₹
              {totalRevenue.toLocaleString(
                "en-IN"
              )}
            </h2>

            <small>
              All recorded sales
            </small>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon purple">
            📦
          </div>

          <div>
            <p>Units Sold</p>

            <h2>
              {totalUnits}
            </h2>

            <small>
              Total quantity
            </small>
          </div>

        </div>

      </div>

      {/* =================================================
          MAIN GRID
      ================================================= */}

      <div className="product-management-grid">

        {/* =================================================
            RECORD SALE
        ================================================= */}

        <div className="card">

          <div className="card-header">

            <div>

              <h2>
                Record Sale
              </h2>

              <p>
                Enter today's sales
                information.
              </p>

            </div>

          </div>

          <form
            className="product-form"
            onSubmit={
              handleAddSale
            }
          >

            {/* PRODUCT */}

            <label>
              Product
            </label>

            <select
              name="productId"
              value={
                form.productId
              }
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
                    key={
                      product.id
                    }
                    value={
                      product.productId
                    }
                  >
                    {product.productName}
                  </option>

                )
              )}

            </select>

            {/* DATE */}

            <label>
              Sale Date
            </label>

            <input
              name="date"
              type="date"
              value={form.date}
              onChange={
                handleChange
              }
            />

            {/* QUANTITY */}

            <label>
              Quantity Sold
            </label>

            <input
              name="quantitySold"
              type="number"
              min="1"
              placeholder="Example: 25"
              value={
                form.quantitySold
              }
              onChange={
                handleChange
              }
            />

            {/* PRICE */}

            <label>
              Selling Price (₹)
            </label>

            <input
              name="sellingPrice"
              type="number"
              min="0"
              placeholder="Example: 60"
              value={
                form.sellingPrice
              }
              onChange={
                handleChange
              }
            />

            {/* BUTTON */}

            <button
              type="submit"
              className="primary-button add-product-button"
            >
              + Record Sale
            </button>

          </form>

        </div>

        {/* =================================================
            SALES HISTORY
        ================================================= */}

        <div className="card">

          <div className="card-header">

            <div>

              <h2>
                Sales History
              </h2>

              <p>
                {sales.length} sale
                {sales.length !== 1
                  ? "s"
                  : ""}{" "}
                recorded
              </p>

            </div>

          </div>

          {sales.length === 0 ? (

            <div className="empty-product">

              <div className="empty-product-icon">
                📊
              </div>

              <h3>
                No Sales Yet
              </h3>

              <p>
                Record your first
                sale to start
                building sales
                history.
              </p>

            </div>

          ) : (

            <div className="product-list">

              {sales.map(
                (sale) => (

                  <div
                    className="product-row"
                    key={sale.id}
                  >

                    <div className="product-icon">
                      📈
                    </div>

                    <div className="product-details">

                      <strong>
                        {sale.productName}
                      </strong>

                      <p>
                        Product ID:{" "}
                        {sale.productId}
                      </p>

                      <p>
                        {sale.date}
                      </p>

                      <p>
                        Quantity:{" "}
                        {sale.quantitySold}
                        {" • "}
                        ₹
                        {sale.sellingPrice}
                      </p>

                    </div>

                    <div className="stock-info">

                      <small>
                        Total
                      </small>

                      <strong>
                        ₹
                        {Number(
                          sale.totalAmount
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                      <button
                        type="button"
                        className="text-button"
                        onClick={() =>
                          handleDeleteSale(
                            sale.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>

      {/* =================================================
          AI INFORMATION
      ================================================= */}

      {sales.length > 0 && (

        <div className="ai-product-info">

          <div className="status-dot"></div>

          <div>

            <strong>
              Sales data ready for
              AI analysis
            </strong>

            <p>
              SmartStock uses your
              sales history to calculate
              previous sales and rolling
              averages for demand
              prediction.
            </p>

          </div>

        </div>

      )}

    </div>
  );
}

export default Sales;