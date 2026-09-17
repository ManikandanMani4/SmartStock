import { useEffect, useState } from "react";

function Purchases() {
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);

  const [form, setForm] = useState({
    productId: "",
    quantity: "",
    purchasePrice: "",
    supplier: "",
  });

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    const savedProducts = JSON.parse(
      localStorage.getItem("smartstock_products") || "[]"
    );

    const savedPurchases = JSON.parse(
      localStorage.getItem("smartstock_purchases") || "[]"
    );

    setProducts(savedProducts);
    setPurchases(savedPurchases);

    if (savedProducts.length > 0) {
      setForm({
        productId: savedProducts[0].id,
        quantity: "",
        purchasePrice: savedProducts[0].sellingPrice,
        supplier: savedProducts[0].supplier,
      });
    }
  }, []);

  // =====================================================
  // PRODUCT CHANGE
  // =====================================================

  const handleProductChange = (event) => {
    const productId = Number(event.target.value);

    const product = products.find(
      (item) => item.id === productId
    );

    setForm((previous) => ({
      ...previous,
      productId,
      purchasePrice: product
        ? product.sellingPrice
        : "",
      supplier: product
        ? product.supplier
        : "",
    }));
  };

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // RECEIVE PURCHASE
  // =====================================================

  const handlePurchase = (event) => {
    event.preventDefault();

    if (
      !form.productId ||
      form.quantity === "" ||
      form.purchasePrice === "" ||
      form.supplier.trim() === ""
    ) {
      alert("Please fill all purchase details.");
      return;
    }

    const quantity = Number(form.quantity);
    const purchasePrice = Number(
      form.purchasePrice
    );

    if (quantity <= 0) {
      alert("Quantity must be greater than 0.");
      return;
    }

    const product = products.find(
      (item) =>
        item.id === Number(form.productId)
    );

    if (!product) {
      alert("Product not found.");
      return;
    }

    // ---------------------------------------------------
    // CREATE PURCHASE
    // ---------------------------------------------------

    const newPurchase = {
      id: Date.now(),

      productId: product.id,

      productName:
        product.productName,

      supplier:
        form.supplier.trim(),

      quantity,

      purchasePrice,

      totalAmount:
        quantity * purchasePrice,

      date:
        new Date()
          .toISOString()
          .split("T")[0],
    };

    const updatedPurchases = [
      ...purchases,
      newPurchase,
    ];

    setPurchases(updatedPurchases);

    localStorage.setItem(
      "smartstock_purchases",
      JSON.stringify(
        updatedPurchases
      )
    );

    // ---------------------------------------------------
    // UPDATE STOCK
    // ---------------------------------------------------

    const updatedProducts =
      products.map((item) => {

        if (
          item.id === product.id
        ) {
          return {
            ...item,

            currentStock:
              Number(
                item.currentStock
              ) + quantity,
          };
        }

        return item;
      });

    setProducts(updatedProducts);

    localStorage.setItem(
      "smartstock_products",
      JSON.stringify(
        updatedProducts
      )
    );

    // ---------------------------------------------------
    // CLEAR FORM
    // ---------------------------------------------------

    setForm((previous) => ({
      ...previous,

      quantity: "",
    }));

    alert(
      `${quantity} units of ${product.productName} added to inventory.`
    );
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
            Purchases
          </h1>

          <p>
            Purchase stock and update your inventory.
          </p>

        </div>

        <span className="ai-badge">
          AI REORDER
        </span>

      </div>


      {/* MAIN GRID */}

      <div className="product-management-grid">

        {/* PURCHASE FORM */}

        <div className="card">

          <div className="card-header">

            <div>

              <h2>
                Receive Stock
              </h2>

              <p>
                Add purchased stock to inventory.
              </p>

            </div>

          </div>


          <form
            className="product-form"
            onSubmit={handlePurchase}
          >

            {/* PRODUCT */}

            <label htmlFor="purchaseProduct">
              Product
            </label>

            {products.length === 0 ? (

              <p>
                Add a product first.
              </p>

            ) : (

              <select
                id="purchaseProduct"
                value={form.productId}
                onChange={handleProductChange}
              >

                {products.map(
                  (product) => (

                    <option
                      key={product.id}
                      value={product.id}
                    >
                      {product.productName}
                    </option>

                  )
                )}

              </select>

            )}


            {/* QUANTITY */}

            <label htmlFor="quantity">
              Quantity Received
            </label>

            <input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              placeholder="Example: 50"
              value={form.quantity}
              onChange={handleChange}
            />


            {/* PRICE */}

            <label htmlFor="purchasePrice">
              Purchase Price (₹)
            </label>

            <input
              id="purchasePrice"
              name="purchasePrice"
              type="number"
              min="0"
              placeholder="Example: 50"
              value={form.purchasePrice}
              onChange={handleChange}
            />


            {/* SUPPLIER */}

            <label htmlFor="supplier">
              Supplier
            </label>

            <input
              id="supplier"
              name="supplier"
              type="text"
              value={form.supplier}
              onChange={handleChange}
              placeholder="Supplier name"
            />


            {/* BUTTON */}

            <button
              type="submit"
              className="primary-button add-product-button"
              disabled={
                products.length === 0
              }
            >
              + Receive Stock
            </button>

          </form>

        </div>


        {/* PURCHASE HISTORY */}

        <div className="card">

          <div className="card-header">

            <div>

              <h2>
                Purchase History
              </h2>

              <p>
                {purchases.length} purchase
                {purchases.length !== 1
                  ? "s"
                  : ""}
              </p>

            </div>

          </div>


          {purchases.length === 0 ? (

            <div className="empty-product">

              <div className="empty-product-icon">
                🛒
              </div>

              <h3>
                No Purchases Yet
              </h3>

              <p>
                Received purchases will appear here.
              </p>

            </div>

          ) : (

            <div className="product-list">

              {purchases
                .slice()
                .reverse()
                .map((purchase) => (

                  <div
                    className="product-row"
                    key={purchase.id}
                  >

                    <div className="product-icon">
                      📦
                    </div>


                    <div className="product-details">

                      <strong>
                        {purchase.productName}
                      </strong>

                      <p>
                        {purchase.quantity}
                        {" units • "}
                        ₹{purchase.purchasePrice}
                      </p>

                      <p>
                        Supplier:{" "}
                        {purchase.supplier}
                      </p>

                      <p>
                        Date:{" "}
                        {purchase.date}
                      </p>

                    </div>


                    <div className="stock-info">

                      <small>
                        Total
                      </small>

                      <strong>
                        ₹{purchase.totalAmount}
                      </strong>

                    </div>

                  </div>

                ))}

            </div>

          )}

        </div>

      </div>


      {/* STATUS */}

      {purchases.length > 0 && (

        <div className="ai-product-info">

          <div className="status-dot"></div>

          <div>

            <strong>
              Inventory updated successfully
            </strong>

            <p>
              Received purchases are automatically
              added to your current stock.
            </p>

          </div>

        </div>

      )}

    </div>
  );
}

export default Purchases;