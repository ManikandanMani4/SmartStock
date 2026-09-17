import { useState } from "react";

function ShopSetup({ onComplete }) {
  const [form, setForm] = useState({
    shopName: "",
    ownerName: "",
    location: "",
    category: "Grocery",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.shopName ||
      !form.ownerName ||
      !form.location
    ) {
      alert("Please fill all the details.");
      return;
    }

    // Save temporarily.
    // Later this will be stored in MySQL through FastAPI.
    localStorage.setItem(
      "smartstock_shop",
      JSON.stringify(form)
    );

    onComplete(form);
  };

  return (
    <div className="setup-page">

      <div className="setup-card">

        <div className="setup-logo">
          S
        </div>

        <h1>Set Up Your Shop</h1>

        <p className="setup-description">
          Enter your shop details once. SmartStock AI
          will use this information for inventory analysis.
        </p>

        <form onSubmit={handleSubmit}>

          <label>Shop Name</label>

          <input
            type="text"
            name="shopName"
            placeholder="Example: ABC Supermarket"
            value={form.shopName}
            onChange={handleChange}
          />

          <label>Owner Name</label>

          <input
            type="text"
            name="ownerName"
            placeholder="Enter owner name"
            value={form.ownerName}
            onChange={handleChange}
          />

          <label>Location</label>

          <input
            type="text"
            name="location"
            placeholder="Example: Karur"
            value={form.location}
            onChange={handleChange}
          />

          <label>Shop Category</label>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option>Grocery</option>
            <option>Supermarket</option>
            <option>Pharmacy</option>
            <option>Electronics</option>
            <option>Clothing</option>
            <option>General Store</option>
            <option>Other</option>
          </select>

          <button
            type="submit"
            className="continue-button"
          >
            Continue →
          </button>

        </form>

      </div>

    </div>
  );
}

export default ShopSetup;