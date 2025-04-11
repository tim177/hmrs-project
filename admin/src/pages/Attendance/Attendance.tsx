/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Search, MoreVertical, ChevronDown, User } from "lucide-react";
import axios from "../../axiosConfig"; // ✅ make sure this points to the correct file
import styles from "./Attendance.module.css";
import Header from "../../features/dashboard/Header";

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  task: string;
  status: string;
}

export default function AttendancePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch employees from backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("/api/employee/candidates", {
          withCredentials: true,
        });

        const filtered = res.data.map((emp: any) => ({
          id: emp._id,
          name: emp.fullName,
          position: emp.position,
          department: emp.department,
          task: emp.task || "--",
          status: emp.attendanceStatus || "Absent",
        }));

        setEmployees(filtered);
        setFilteredEmployees(filtered);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Apply filters when status or search term changes
  useEffect(() => {
    let filtered = employees;

    if (statusFilter !== "All") {
      filtered = filtered.filter(
        (employee) => employee.status === statusFilter
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (employee) =>
          employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.department
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.task.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEmployees(filtered);
  }, [employees, statusFilter, searchTerm]);

  const handleStatusChange = async (employeeId: string, newStatus: string) => {
    try {
      const updatedEmployees = employees.map((employee) =>
        employee.id === employeeId
          ? { ...employee, status: newStatus }
          : employee
      );
      setEmployees(updatedEmployees);

      await axios.put(
        `/api/employee/candidates/${employeeId}`,
        { attendanceStatus: newStatus },
        { withCredentials: true }
      );

      console.log("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <Header title="Attendance" />
      <div className={styles.controls}>
        <div className={styles.filter}>
          <select
            className={styles.select}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>
        <div className={styles.searchContainer}>
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search"
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.profileCol}>Profile</th>
              <th>Employee Name</th>
              <th>Position</th>
              <th>Department</th>
              <th>Task</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td className={styles.profileCol}>
                    <div className={styles.userIcon}>
                      <User size={20} />
                    </div>
                  </td>
                  <td>{employee.name}</td>
                  <td>{employee.position}</td>
                  <td>{employee.department}</td>
                  <td>{employee.task}</td>
                  <td>
                    <div className={styles.statusDropdown}>
                      <button
                        className={`${styles.statusBtn} ${
                          employee.status === "Present"
                            ? styles.present
                            : styles.absent
                        }`}
                      >
                        {employee.status} <ChevronDown size={16} />
                      </button>
                      <div className={styles.statusOptions}>
                        <div
                          className={styles.statusOption}
                          onClick={() =>
                            handleStatusChange(employee.id, "Present")
                          }
                        >
                          Present
                        </div>
                        <div
                          className={styles.statusOption}
                          onClick={() =>
                            handleStatusChange(employee.id, "Absent")
                          }
                        >
                          Absent
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <button className={styles.actionBtn}>
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className={styles.noData}>
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
