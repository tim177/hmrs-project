import type React from "react";

import { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  MoreVertical,
  Mail,
  Bell,
  User,
} from "lucide-react";
import styles from "./employee-table.module.css";
import EditEmployeeModal from "../../components/edit-employee-modal";

interface Employee {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  status: string;
  createdAt: string;
}

export default function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState<string>("");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  // Fetch employees from backend
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          "http://localhost:5000/api/employee/candidates"
        );
        const data = await res.json();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filtered = data.map((emp: any) => ({
          _id: emp._id,
          fullName: emp.fullName,
          email: emp.email,
          phone: emp.phone,
          position: emp.position,
          department: emp.department,
          status: emp.status,
          createdAt: emp.createdAt,
        }));

        setEmployees(filtered);
        setFilteredEmployees(filtered);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
        setError("Failed to load employees. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Filter employees based on search term and position filter
  useEffect(() => {
    let result = employees;

    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      result = result.filter(
        (employee) =>
          employee.fullName.toLowerCase().includes(lowerCaseSearch) ||
          employee.email.toLowerCase().includes(lowerCaseSearch) ||
          employee.department.toLowerCase().includes(lowerCaseSearch)
      );
    }

    if (positionFilter) {
      result = result.filter((employee) => employee.status === positionFilter);
    }

    setFilteredEmployees(result);
  }, [employees, searchTerm, positionFilter]);

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

  const handleDeleteClick = async (employeeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(
        `http://localhost:5000/api/employee/candidates/${employeeId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Remove employee from state
        setEmployees(employees.filter((emp) => emp._id !== employeeId));
      } else {
        console.error("Failed to delete employee");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
    setOpenDropdownId(null);
  };

  const handleStatusChange = async (employeeId: string, newStatus: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/employee/candidates/${employeeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        // Update employee status in state
        setEmployees(
          employees.map((emp) =>
            emp._id === employeeId ? { ...emp, status: newStatus } : emp
          )
        );
      } else {
        console.error("Failed to update employee status");
      }
    } catch (error) {
      console.error("Error updating employee status:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleEmployeeUpdate = (updatedEmployee: Employee) => {
    setEmployees(
      employees.map((emp) =>
        emp._id === updatedEmployee._id ? updatedEmployee : emp
      )
    );
    closeModal();
  };

  const handleClickOutside = () => {
    setOpenDropdownId(null);
  };

  // Format date to MM/DD/YY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${String(
      date.getFullYear()
    ).slice(2)}`;
  };

  return (
    <div className={styles.container} onClick={handleClickOutside}>
      <header className={styles.header}>
        <h1 className={styles.title}>Employees</h1>
        <div className={styles.headerActions}>
          <button className={styles.iconButton}>
            <Mail size={20} />
          </button>
          <button className={styles.iconButton}>
            <Bell size={20} />
          </button>
          <div className={styles.userProfile}>
            <div className={styles.userAvatar}>
              <User size={18} />
            </div>
            <ChevronDown size={16} />
          </div>
        </div>
      </header>

      <div className={styles.filters}>
        <div className={styles.filterDropdown}>
          <select
            className={styles.filterSelect}
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
          >
            <option value="">All Positions</option>
            <option value="New">New</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
          <ChevronDown size={16} className={styles.filterIcon} />
        </div>

        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} size={18} />
          <input
            type="text"
            placeholder="Search"
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Profile</th>
              <th>Employee Name</th>
              <th>Email Address</th>
              <th>Phone Number</th>
              <th>Position</th>
              <th>Department</th>
              <th>Date of Joining</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className={styles.messageCell}>
                  Loading employees...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={8} className={styles.messageCell}>
                  {error}
                </td>
              </tr>
            ) : filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.messageCell}>
                  No employees found
                </td>
              </tr>
            ) : (
              filteredEmployees.map((employee) => (
                <tr key={employee._id}>
                  <td>
                    <div className={styles.profileAvatar}>
                      <User size={18} />
                    </div>
                  </td>
                  <td>{employee.fullName}</td>
                  <td>{employee.email}</td>
                  <td>{employee.phone}</td>
                  <td>
                    <div className={styles.statusDropdown}>
                      <select
                        className={styles.statusSelect}
                        value={employee.status}
                        onChange={(e) =>
                          handleStatusChange(employee._id, e.target.value)
                        }
                      >
                        <option value="New">New</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                      <ChevronDown size={16} className={styles.statusIcon} />
                    </div>
                  </td>
                  <td>{employee.department}</td>
                  <td>{formatDate(employee.createdAt)}</td>
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedEmployee && (
        <EditEmployeeModal
          employee={selectedEmployee}
          onClose={closeModal}
          onUpdate={handleEmployeeUpdate}
        />
      )}
    </div>
  );
}
