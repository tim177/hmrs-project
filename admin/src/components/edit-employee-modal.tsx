import type React from "react";
import { useState } from "react";
import { X, Calendar, ChevronDown } from "lucide-react";
import styles from "./edit-employee-modal.module.css";

interface Employee {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  createdAt: string;
  status: "New" | "Selected" | "Rejected";
}

interface EditEmployeeModalProps {
  employee: Employee;
  onClose: () => void;
  onUpdate: (updatedEmployee: Employee) => void;
}

export default function EditEmployeeModal({
  employee,
  onClose,
  onUpdate,
}: EditEmployeeModalProps) {
  const [formData, setFormData] = useState({
    fullName: employee.fullName, // ✅ fixed from `name`
    email: employee.email,
    phone: employee.phone,
    department: employee.department,
    position: employee.position,
    createdAt: employee.createdAt,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/employee/candidates/${employee._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Update parent state
      onUpdate(data.updatedCandidate);

      onClose();
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("Failed to update employee");
    }
  };

  const positions = ["Intern", "Junior", "Senior", "Full Time", "Team Lead"];

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Edit Employee Details</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className={styles.modalBody}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Full Name*</label>
                <input
                  type="text"
                  name="fullName"
                  className={styles.formInput}
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email Address*</label>
                <input
                  type="email"
                  name="email"
                  className={styles.formInput}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Phone Number*</label>
                <input
                  type="tel"
                  name="phone"
                  className={styles.formInput}
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Department*</label>
                <input
                  type="text"
                  name="department"
                  className={styles.formInput}
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Position*</label>
                <div className={styles.selectWrapper}>
                  <select
                    name="position"
                    className={styles.formSelect}
                    value={formData.position}
                    onChange={handleChange}
                    required
                  >
                    {positions.map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className={styles.selectIcon} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Date of Joining*</label>
                <div className={styles.inputWithIcon}>
                  <input
                    type="text"
                    name="createdAt"
                    className={styles.formInput}
                    value={formData.createdAt}
                    onChange={handleChange}
                    required
                  />
                  <Calendar size={18} className={styles.inputIcon} />
                </div>
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.saveButton}>
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
