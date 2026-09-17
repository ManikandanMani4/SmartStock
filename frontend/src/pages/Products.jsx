import { useEffect, useState } from "react";

function Products() {
  // =====================================================
  // PRODUCTS
  // =====================================================

  const [products, setProducts] = useState([]);

  // =====================================================
  // FORM
  // =====================================================

  const [form, setForm] = useState({
    productName: "",
    category: "Grocery",
    sellingPrice: "",
    currentStock: "",
    supplier: "",
    leadDays: "",
  });

  // =====================================================
  // LOAD PRODUCTS FROM LOCAL STORAGE
  // =====================================================

  useEffect(() => {
    const savedProducts =
      localStorage.getItem("smartstock_products");

    if (savedProducts) {
      try {
        const oldProducts = JSON.parse(savedProducts);

        // Fix old products that don't have Product ID
        const fixedProducts = oldProducts.map(
          (product, index) => ({
            ...product,

            productId:
              product.productId ||
              product.product_id ||
              "P" +
                String(index + 1).padStart(3, "0"),
          })
        );

        // Save fixed products
        localStorage.setItem(
          "smartstock_products",
          JSON.stringify(fixedProducts)
        );

        setProducts(fixedProducts);
      } catch (error) {
        console.error(
          "Error loading products:",
          error
        );

        setProducts([]);
      }
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
  // ADD PRODUCT
  // =====================================================

  const handleAddProduct = (event) => {
    event.preventDefault();

    console.log("ADD PRODUCT BUTTON CLICKED");

    // ---------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------

    if (
      form.productName.trim() === "" ||
      form.sellingPrice === "" ||
      form.currentStock === "" ||
      form.supplier.trim() === "" ||
      form.leadDays === ""
    ) {
      alert("Please fill all product details.");
      return;
    }

    // ---------------------------------------------------
    // CREATE PRODUCT ID
    // ---------------------------------------------------

    const productIdMap = {
  Rice: "P001",
  Wheat: "P002",
  Sugar: "P003",
  "Cooking Oil": "P004",
  Milk: "P005",
  Bread: "P006",
  Eggs: "P007",
  Biscuits: "P008",
  Soap: "P009",
  Shampoo: "P010",
};

const newProductId =
  productIdMap[form.productName.trim()];

  if (!newProductId) {
  alert(
    "This product is not available in the trained AI model."
  );
  return;
}

const alreadyExists = products.some(
  (product) =>
    product.productId === newProductId
);

if (alreadyExists) {
  alert(
    `${form.productName} already exists.`
  );
  return;
}
    // ---------------------------------------------------
    // CREATE PRODUCT
    // ---------------------------------------------------

    const newProduct = {
      id: Date.now(),

      productId: newProductId,

      productName:
        form.productName.trim(),

      category:
        form.category,

      sellingPrice:
        Number(form.sellingPrice),

      currentStock:
        Number(form.currentStock),

      supplier:
        form.supplier.trim(),

      leadDays:
        Number(form.leadDays),
    };

    console.log(
      "New Product:",
      newProduct
    );

    // ---------------------------------------------------
    // SAVE PRODUCT
    // ---------------------------------------------------

    setProducts((previousProducts) => {
      const updatedProducts = [
        ...previousProducts,
        newProduct,
      ];

      localStorage.setItem(
        "smartstock_products",
        JSON.stringify(updatedProducts)
      );

      return updatedProducts;
    });

    // ---------------------------------------------------
    // CLEAR FORM
    // ---------------------------------------------------

    setForm({
      productName: "",
      category: "Grocery",
      sellingPrice: "",
      currentStock: "",
      supplier: "",
      leadDays: "",
    });

    alert(
      `${newProduct.productName} added successfully!\n\nProduct ID: ${newProduct.productId}`
    );
  };

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const handleDeleteProduct = (productId) => {
    const product = products.find(
      (item) =>
        item.id === productId
    );

    if (!product) {
      return;
    }

    const confirmDelete =
      window.confirm(
        `Delete ${product.productName}?\n\nProduct ID: ${product.productId}`
      );

    if (!confirmDelete) {
      return;
    }

    const updatedProducts =
      products.filter(
        (item) =>
          item.id !== productId
      );

    setProducts(updatedProducts);

    localStorage.setItem(
      "smartstock_products",
      JSON.stringify(updatedProducts)
    );

    alert("Product deleted successfully!");
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="content">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="page-heading">

        <div>
          <h1>Products</h1>

          <p>
            Add and manage your shop products.
          </p>
        </div>

        <span className="ai-badge">
          AI READY
        </span>

      </div>


      {/* =================================================
          PRODUCT GRID
      ================================================= */}

      <div className="product-management-grid">

        {/* =================================================
            ADD PRODUCT
        ================================================= */}

        <div className="card">

          <div className="card-header">

            <div>
              <h2>
                Add Product
              </h2>

              <p>
                Enter your product details.
              </p>
            </div>

          </div>


          <form
            className="product-form"
            onSubmit={handleAddProduct}
          >

            {/* PRODUCT NAME */}

            <label htmlFor="productName">
              Product Name
            </label>

            <input
              id="productName"
              name="productName"
              type="text"
              placeholder="Example: Rice"
              value={form.productName}
              onChange={handleChange}
            />


            {/* CATEGORY */}

            <label htmlFor="category">
              Category
            </label>

            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
            >

              <option value="Grocery">
                Grocery
              </option>

              <option value="Dairy">
                Dairy
              </option>

              <option value="Bakery">
                Bakery
              </option>

              <option value="Beverages">
                Beverages
              </option>

              <option value="Personal Care">
                Personal Care
              </option>

              <option value="Other">
                Other
              </option>

            </select>


            {/* SELLING PRICE */}

            <label htmlFor="sellingPrice">
              Selling Price (₹)
            </label>

            <input
              id="sellingPrice"
              name="sellingPrice"
              type="number"
              min="0"
              placeholder="Example: 60"
              value={form.sellingPrice}
              onChange={handleChange}
            />


            {/* CURRENT STOCK */}

            <label htmlFor="currentStock">
              Current Stock
            </label>

            <input
              id="currentStock"
              name="currentStock"
              type="number"
              min="0"
              placeholder="Example: 100"
              value={form.currentStock}
              onChange={handleChange}
            />


            {/* SUPPLIER */}

            <label htmlFor="supplier">
              Supplier Name
            </label>

            <input
              id="supplier"
              name="supplier"
              type="text"
              placeholder="Example: ABC Traders"
              value={form.supplier}
              onChange={handleChange}
            />


            {/* LEAD TIME */}

            <label htmlFor="leadDays">
              Supplier Lead Time (Days)
            </label>

            <input
              id="leadDays"
              name="leadDays"
              type="number"
              min="0"
              placeholder="Example: 5"
              value={form.leadDays}
              onChange={handleChange}
            />


            {/* ADD BUTTON */}

            <button
              type="submit"
              className="primary-button add-product-button"
            >
              + Add Product
            </button>

          </form>

        </div>


        {/* =================================================
            PRODUCT LIST
        ================================================= */}

        <div className="card">

          <div className="card-header">

            <div>

              <h2>
                Your Products
              </h2>

              <p>
                {products.length} product
                {products.length !== 1
                  ? "s"
                  : ""}
              </p>

            </div>

          </div>


          {/* NO PRODUCTS */}

          {products.length === 0 && (

            <div className="empty-product">

              <div className="empty-product-icon">
                📦
              </div>

              <h3>
                No Products Yet
              </h3>

              <p>
                Add your first product using
                the form.
              </p>

            </div>

          )}


          {/* PRODUCTS */}

          {products.length > 0 && (

            <div className="product-list">

              {products.map(
                (product) => (

                  <div
                    className="product-row"
                    key={product.id}
                  >

                    {/* ICON */}

                    <div className="product-icon">
                      📦
                    </div>


                    {/* PRODUCT DETAILS */}

                    <div className="product-details">

                      <strong>
                        {product.productName}
                      </strong>

                      <p>
                        ID:{" "}
                        <strong>
                          {product.productId}
                        </strong>
                      </p>

                      <p>
                        {product.category}
                        {" • "}
                        ₹
                        {product.sellingPrice}
                      </p>

                      <p>
                        Supplier:{" "}
                        {product.supplier}
                        {" • "}
                        Lead time:{" "}
                        {product.leadDays}
                        {" days"}
                      </p>

                    </div>


                    {/* STOCK */}

                    <div className="stock-info">

                      <small>
                        Stock
                      </small>

                      <strong>
                        {product.currentStock}
                      </strong>

                    </div>


                    {/* DELETE */}

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() =>
                        handleDeleteProduct(
                          product.id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>


      {/* =================================================
          AI STATUS
      ================================================= */}

      {products.length > 0 && (

        <div className="ai-product-info">

          <div className="status-dot"></div>

          <div>

            <strong>
              Products ready for AI analysis
            </strong>

            <p>
              Your product information is saved
              and ready for demand prediction.
            </p>

          </div>

        </div>

      )}

    </div>
  );
}

export default Products;