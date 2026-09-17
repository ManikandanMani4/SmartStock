import { useState } from "react";

import ShopSetup from "./ShopSetup";

import Products from "./pages/Products";
import Sales from "./pages/Sales";
import Forecast from "./pages/Forecast";
import Inventory from "./pages/Inventory";
import Purchases from "./pages/Purchases";
import Reports from "./pages/Reports";


function App() {

  const [page, setPage] = useState("Dashboard");

  // Sidebar open / closed
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [setupCompleted, setSetupCompleted] = useState(
    localStorage.getItem("smartstock_shop") !== null
  );


  if (!setupCompleted) {
    return (
      <ShopSetup
        onComplete={() => setSetupCompleted(true)}
      />
    );
  }


  const menu = [
    "Dashboard",
    "Products",
    "Inventory",
    "Sales",
    "Purchases",
    "Forecast",
    "Reports",
  ];


  // =====================================================
  // PAGE CONTENT
  // =====================================================

  const renderPage = () => {

    switch (page) {

      case "Dashboard":
        return <Dashboard />;

      case "Products":
        return <Products />;

      case "Inventory":
        return <Inventory />;

      case "Sales":
        return <Sales />;

      case "Purchases":
        return <Purchases />;

      case "Forecast":
        return <Forecast />;

      case "Reports":
        return <Reports />;

      default:
        return <Dashboard />;
    }
  };


  return (

    <div
      className={
        sidebarOpen
          ? "app sidebar-open"
          : "app sidebar-closed"
      }
    >

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="sidebar">

        {/* BRAND */}

        <div className="brand">

          <div className="brand-logo">
            S
          </div>

          {sidebarOpen && (

            <div className="brand-info">

              <h2>
                SmartStock
              </h2>

              <p>
                AI Inventory
              </p>

            </div>

          )}

        </div>


        {/* MENU */}

        <nav className="sidebar-menu">

          {menu.map((item) => (

            <button
              key={item}

              className={
                page === item
                  ? "menu-button active"
                  : "menu-button"
              }

              onClick={() => setPage(item)}

              title={
                sidebarOpen
                  ? ""
                  : item
              }
            >

              <span className="menu-icon">

                {item === "Dashboard" && "🏠"}

                {item === "Products" && "📦"}

                {item === "Inventory" && "📊"}

                {item === "Sales" && "🛒"}

                {item === "Purchases" && "🚚"}

                {item === "Forecast" && "📈"}

                {item === "Reports" && "📋"}

              </span>


              {sidebarOpen && (

                <span className="menu-text">
                  {item}
                </span>

              )}

            </button>

          ))}

        </nav>


        {/* AI STATUS */}

        <div className="ai-status">

          <span className="status-dot"></span>

          {sidebarOpen && (

            <div>

              <strong>
                AI Model
              </strong>

              <p>
                Ready for prediction
              </p>

            </div>

          )}

        </div>

      </aside>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="main">


        {/* TOPBAR */}

        <header className="topbar">

          {/* DRAWER BUTTON */}

          <button
            className="drawer-button"

            onClick={() =>
              setSidebarOpen(!sidebarOpen)
            }

            title={
              sidebarOpen
                ? "Close sidebar"
                : "Open sidebar"
            }
          >
            ☰
          </button>


          {/* SEARCH */}

          <input
            className="search"
            type="text"
            placeholder="Search products..."
          />


          {/* PROFILE */}

          <div className="profile">

            <div className="avatar">
              A
            </div>

            <div className="profile-info">

              <strong>
                Admin
              </strong>

              <p>
                Shop Owner
              </p>

            </div>

          </div>

        </header>


        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="content">

          {/* DASHBOARD HEADER */}

          {page === "Dashboard" && (

            <div className="page-heading">

              <div>

                <h1>
                  Good morning, Admin 👋
                </h1>

                <p>
                  Here's what's happening with your
                  inventory today.
                </p>

              </div>


              <button className="primary-button">
                + Add Product
              </button>

            </div>

          )}


          {/* PAGE */}

          {renderPage()}

        </section>

      </main>

    </div>
  );
}


/* =====================================================
   DASHBOARD
===================================================== */

function Dashboard() {

  return (

    <>

      {/* STATISTICS */}

      <div className="stats-grid">

        <StatCard
          title="Total Products"
          value="245"
          description="+12 this month"
          type="blue"
        />

        <StatCard
          title="Low Stock"
          value="18"
          description="Needs attention"
          type="orange"
        />

        <StatCard
          title="Inventory Value"
          value="₹4.25L"
          description="+8.4% this month"
          type="green"
        />

        <StatCard
          title="Predicted Demand"
          value="1,248"
          description="Next 7 days"
          type="purple"
        />

      </div>


      {/* DASHBOARD GRID */}

      <div className="dashboard-grid">

        {/* DEMAND FORECAST */}

        <div className="card">

          <div className="card-header">

            <div>

              <h2>
                Demand Forecast
              </h2>

              <p>
                AI predicted demand for next 7 days
              </p>

            </div>

            <select>

              <option>
                Next 7 Days
              </option>

              <option>
                Next 30 Days
              </option>

            </select>

          </div>


          <div className="chart">

            {[45, 60, 52, 72, 65, 80, 75].map(
              (height, index) => (

                <div
                  className="chart-column"
                  key={index}
                >

                  <div
                    className="chart-bar"
                    style={{
                      height: `${height}%`,
                    }}
                  />

                  <span>
                    Day {index + 1}
                  </span>

                </div>

              )
            )}

          </div>

        </div>


        {/* AI RECOMMENDATIONS */}

        <div className="card">

          <div className="card-header">

            <div>

              <h2>
                AI Recommendations
              </h2>

              <p>
                Smart reorder suggestions
              </p>

            </div>

            <span className="ai-badge">
              AI
            </span>

          </div>


          <Recommendation
            product="Rice"
            stock="100"
            demand="140"
            order="60"
            risk="High"
          />

          <Recommendation
            product="Sugar"
            stock="45"
            demand="70"
            order="35"
            risk="Medium"
          />

          <Recommendation
            product="Cooking Oil"
            stock="85"
            demand="60"
            order="0"
            risk="Low"
          />

        </div>

      </div>


      {/* INVENTORY ALERTS */}

      <div className="card alerts-card">

        <div className="card-header">

          <div>

            <h2>
              Inventory Alerts
            </h2>

            <p>
              Important notifications from SmartStock AI
            </p>

          </div>

          <button className="text-button">
            View all
          </button>

        </div>


        <div className="alert danger">

          <span>
            ⚠️
          </span>

          <div>

            <strong>
              Rice stock is running low
            </strong>

            <p>
              Current stock may not meet predicted demand.
            </p>

          </div>

        </div>


        <div className="alert warning">

          <span>
            ⚠️
          </span>

          <div>

            <strong>
              Sugar demand is increasing
            </strong>

            <p>
              AI predicts higher demand next week.
            </p>

          </div>

        </div>

      </div>

    </>
  );
}


/* =====================================================
   STAT CARD
===================================================== */

function StatCard({
  title,
  value,
  description,
  type,
}) {

  return (

    <div className="stat-card">

      <div className={`stat-icon ${type}`}>

        {type === "blue" && "📦"}

        {type === "orange" && "⚠️"}

        {type === "green" && "₹"}

        {type === "purple" && "📈"}

      </div>


      <div>

        <p>
          {title}
        </p>

        <h2>
          {value}
        </h2>

        <small>
          {description}
        </small>

      </div>

    </div>

  );
}


/* =====================================================
   RECOMMENDATION
===================================================== */

function Recommendation({
  product,
  stock,
  demand,
  order,
  risk,
}) {

  return (

    <div className="recommendation">

      <div className="recommendation-left">

        <div className="product-icon">
          📦
        </div>


        <div>

          <div className="product-name">

            <strong>
              {product}
            </strong>

            <span
              className={`risk ${risk.toLowerCase()}`}
            >
              {risk}
            </span>

          </div>


          <p>

            Stock:
            <strong>
              {stock}
            </strong>

            {"  "}

            Predicted:
            <strong>
              {demand}
            </strong>

          </p>

        </div>

      </div>


      <div className="order">

        <small>
          Order
        </small>

        <strong>
          {order}
        </strong>

      </div>

    </div>

  );
}


export default App;