import { NavLink, useNavigate } from "react-router-dom";
import { Search, Users, Calendar, FileText, LogOut } from "lucide-react";
import styles from "./Sidebar.module.css";
import { useState } from "react";
import LogoutModal from "../../components/logout-modal";
import { toast } from "react-toastify";
import axios from "../../axiosConfig";

export default function Sidebar() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout", {}, { withCredentials: true }); // adjust if your route is different

      // Optional: Clear any stored tokens if you're using localStorage/sessionStorage
      // localStorage.removeItem("token");

      toast.success("Logged out successfully");

      setIsLogoutModalOpen(false);
      navigate("/register");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>LOGO</div>
      </div>

      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} size={18} />
        <input
          type="text"
          placeholder="Search"
          className={styles.searchInput}
        />
      </div>

      <nav className={styles.navigation}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Recruitment</h3>
          <ul className={styles.menu}>
            <li>
              <NavLink
                to="/dashboard/candidates"
                className={({ isActive }) =>
                  `${styles.menuItem} ${isActive ? styles.active : ""}`
                }
              >
                <Users size={18} />
                <span>Candidates</span>
              </NavLink>
            </li>
          </ul>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Organization</h3>
          <ul className={styles.menu}>
            <li>
              <NavLink
                to="/dashboard/employee"
                className={({ isActive }) =>
                  `${styles.menuItem} ${isActive ? styles.active : ""}`
                }
              >
                <Users size={18} />
                <span>Employees</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/attendance"
                className={({ isActive }) =>
                  `${styles.menuItem} ${isActive ? styles.active : ""}`
                }
              >
                <Calendar size={18} />
                <span>Attendance</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/leaves"
                className={({ isActive }) =>
                  `${styles.menuItem} ${isActive ? styles.active : ""}`
                }
              >
                <FileText size={18} />
                <span>Leaves</span>
              </NavLink>
            </li>
          </ul>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Others</h3>
          <ul className={styles.menu}>
            <li>
              <button
                className={styles.menuItem}
                onClick={() => setIsLogoutModalOpen(true)}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </aside>
  );
}
