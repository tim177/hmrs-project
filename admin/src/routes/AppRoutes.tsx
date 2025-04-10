import { Route, Routes } from "react-router-dom";
import Login from "../features/auth/Login";
import Register from "../features/register/Register";
import Dashboard from "../pages/Candidates/dashboard";
import DashboardLayout from "../features/dashboard/DashboardLayout";
import EmployeesTable from "../pages/Employees/Employees";
import SimpleLeavesPage from "../pages/Leaves/Leaves";
import AttendanceTable from "../pages/Attendance/Attendance";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="candidates" element={<Dashboard />} />
          <Route path="employee" element={<EmployeesTable />} />
          <Route path="attendance" element={<AttendanceTable />} />
          <Route path="leaves" element={<SimpleLeavesPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
