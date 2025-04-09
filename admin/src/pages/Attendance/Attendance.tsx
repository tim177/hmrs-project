import React, { useEffect, useState } from "react";
import { Search, ChevronDown, MoreVertical, User } from "lucide-react";
import styles from "./Attendance.module.css";
import EditEmployeeModal from "../../components/edit-employee-modal";
import Header from "../../features/dashboard/Header";

type Employee = {
  _id: string;
  fullName: string;
  position: string;
  department: string;
  task: string;
  status: string;
};

export default function AttendanceTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/employee/candidates"
        );
        const data = await res.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filtered = data.map((emp: any) => ({
          _id: emp._id,
          fullName: emp.fullName,
          position: emp.position,
          department: emp.department,
          task: emp.task || "N/A", // fallback if task is missing
          status: emp.status || "Pending", // fallback
        }));
        setEmployees(filtered);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleActionClick = (employeeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdownId(openDropdownId === employeeId ? null : employeeId);
  };

  const handleEditClick = (employee: Employee, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEmployee(employee);
    setIsModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleDeleteClick = (employeeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Delete employee with ID: ${employeeId}`);
    setOpenDropdownId(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleClickOutside = () => {
    setOpenDropdownId(null);
  };

  return (
    <div className={styles.container} onClick={handleClickOutside}>
      <Header title="Attendance" />

      <div className={styles.filters}>
        <div className={styles.filterDropdown}>
          <span>Position</span>
          <ChevronDown size={16} />
        </div>

        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} size={18} />
          <input
            type="text"
            placeholder="Search"
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Profile</th>
              <th>Employee Name</th>
              <th>Position</th>
              <th>Department</th>
              <th>Task</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td>
                  <div className={styles.profileAvatar}>
                    <User size={18} />
                  </div>
                </td>
                <td>{employee.fullName}</td>
                <td>{employee.position}</td>
                <td>{employee.department}</td>
                <td>{employee.task}</td>
                <td>{employee.status}</td>
                <td>
                  <div
                    className={styles.actionDropdownContainer}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className={styles.actionButton}
                      onClick={(e) => handleActionClick(employee._id, e)}
                    >
                      <MoreVertical size={18} />
                    </button>
                    {openDropdownId === employee._id && (
                      <div className={styles.actionDropdown}>
                        <button
                          className={styles.dropdownItem}
                          onClick={(e) => handleEditClick(employee, e)}
                        >
                          Edit
                        </button>
                        <button
                          className={styles.dropdownItem}
                          onClick={(e) => handleDeleteClick(employee._id, e)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedEmployee && (
        <EditEmployeeModal employee={selectedEmployee} onClose={closeModal} />
      )}
    </div>
  );
}
