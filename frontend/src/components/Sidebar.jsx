import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  Truck,
  TrendingUp,
  BarChart3,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    icon: Package,
  },
  {
    name: "Inventory",
    icon: Boxes,
  },
  {
    name: "Sales",
    icon: ShoppingCart,
  },
  {
    name: "Purchases",
    icon: Truck,
  },
  {
    name: "Forecast",
    icon: TrendingUp,
  },
  {
    name: "Reports",
    icon: BarChart3,
  },
];

function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="sidebar">

      <div className="brand">
        <div className="brand-logo">S</div>

        <div>
          <h2>SmartStock</h2>
          <span>AI Inventory</span>
        </div>
      </div>

      <nav className="sidebar-menu">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className={
                activePage === item.name
                  ? "menu-item active"
                  : "menu-item"
              }
              onClick={() => setActivePage(item.name)}
            >
              <Icon size={20} />

              <span>{item.name}</span>
            </button>
          );
        })}

      </nav>

      <div className="sidebar-footer">
        <div className="ai-status">
          <span className="status-dot"></span>

          <div>
            <strong>AI Model</strong>
            <small>Ready for prediction</small>
          </div>
        </div>
      </div>

    </aside>
  );
}

export default Sidebar;