import {
  Search,
  Bell,
  UserCircle,
} from "lucide-react";

function Topbar() {
  return (
    <header className="topbar">

      <div className="search-box">
        <Search size={18} />

        <input
          type="text"
          placeholder="Search products..."
        />
      </div>

      <div className="topbar-right">

        <button className="icon-button">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <div className="profile">

          <UserCircle size={34} />

          <div>
            <strong>Admin</strong>
            <small>Business Owner</small>
          </div>

        </div>

      </div>

    </header>
  );
}

export default Topbar;