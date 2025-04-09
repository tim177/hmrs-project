import React from "react";
import { Outlet } from "react-router-dom";
import styles from "./DashboardLayout.module.css";
import Sidebar from "./Sidebar";

const DashboardLayout: React.FC = () => {
  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
