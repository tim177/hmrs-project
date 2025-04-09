import type React from "react";
import { useState, useEffect } from "react";
import { Search, ChevronDown, MoreVertical, User } from "lucide-react";
import styles from "./employee-table.module.css";
import EditEmployeeModal from "../../components/edit-employee-modal";
import Header from "../../features/dashboard/Header";

type Employee = {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  createdAt: string;
  status: "New" | "Selected" | "Rejected";
};

export default function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [filterStatus, setFilterStatus] = useState<string>("All");

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
          email: emp.email,
          phone: emp.phone,
          position: emp.position,
          department: emp.department,
          status: emp.status,
          createdAt: emp.createdAt,
        }));

        setEmployees(filtered);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleActionClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleEditClick = (employee: Employee, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEmployee(employee);
    setIsModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Delete employee with ID: ${id}`);
    setOpenDropdownId(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleClickOutside = () => {
    setOpenDropdownId(null);
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB");
  };

  console.log(employees);
  return (
    <div className={styles.container} onClick={handleClickOutside}>
      <Header title="Employee" />

      <div className={styles.filters}>
        <div className={styles.filterDropdown}>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="All">All</option>
            <option value="New">New</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
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
              <th>Email Address</th>
              <th>Phone Number</th>
              <th>Position</th>
              <th>Department</th>
              <th>Date of Joining</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees
              .filter((emp) =>
                filterStatus === "All"
                  ? true
                  : emp.status === filterStatus.toLowerCase()
              )
              .map((emp) => (
                <tr key={emp._id}>
                  <td>
                    <div className={styles.profileAvatar}>
                      <User size={18} />
                    </div>
                  </td>
                  <td>{emp.fullName}</td>
                  <td>{emp.email}</td>
                  <td>{emp.phone}</td>
                  <td>{emp.position}</td>
                  <td>{emp.department}</td>
                  <td>{formatDate(emp.createdAt)}</td>
                  <td>
                    <div
                      className={styles.actionDropdownContainer}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className={styles.actionButton}
                        onClick={(e) => handleActionClick(emp._id, e)}
                      >
                        <MoreVertical size={18} />
                      </button>
                      {openDropdownId === emp._id && (
                        <div className={styles.actionDropdown}>
                          <button
                            className={styles.dropdownItem}
                            onClick={(e) => handleEditClick(emp, e)}
                          >
                            Edit
                          </button>
                          <button
                            className={styles.dropdownItem}
                            onClick={(e) => handleDeleteClick(emp._id, e)}
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
        <EditEmployeeModal
          employee={selectedEmployee}
          onClose={closeModal}
          onUpdate={(updatedEmp) => {
            setEmployees((prev) =>
              prev.map((emp) => (emp._id === updatedEmp._id ? updatedEmp : emp))
            );
          }}
        />
      )}
    </div>
  );
}
