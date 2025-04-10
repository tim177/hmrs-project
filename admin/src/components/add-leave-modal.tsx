import type React from "react";

import { useState } from "react";
import { X, Search, Calendar, Upload } from "lucide-react";
import styles from "./add-leave-modal.module.css";

interface AddLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (leaveData: any) => void;
}

interface LeaveFormData {
  employeeName: string;
  designation: string;
  leaveDate: string;
  reason: string;
  documents: File | null;
}

export default function AddLeaveModal({
  isOpen,
  onClose,
  onSave,
}: AddLeaveModalProps) {
  const [formData, setFormData] = useState<LeaveFormData>({
    employeeName: "",
    designation: "",
    leaveDate: "",
    reason: "",
    documents: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, documents: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formPayload = new FormData();
    formPayload.append("fullName", formData.employeeName);
    formPayload.append("position", formData.designation);
    formPayload.append("date", formData.leaveDate);
    formPayload.append("reason", formData.reason);
    formPayload.append("status", "New");
    if (formData.documents) {
      formPayload.append("documents", formData.documents);
    }

    onSave(formPayload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Add New Leave</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <div className={styles.inputWithIcon}>
                <Search className={styles.inputIcon} size={18} />
                <input
                  type="text"
                  placeholder="Search Employee Name"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Designation*"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.inputWithIcon}>
                <input
                  type="date"
                  placeholder="Leave Date*"
                  name="leaveDate"
                  value={formData.leaveDate}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
                <Calendar className={styles.calendarIcon} size={18} />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.inputWithIcon}>
                <input
                  type="text"
                  placeholder="Documents"
                  name="documents"
                  className={styles.input}
                  readOnly
                  value={formData.documents ? formData.documents.name : ""}
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                />

                <Upload className={styles.uploadIcon} size={18} />
                <input
                  type="file"
                  id="file-upload"
                  className={styles.fileInput}
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className={styles.inputGroup + " " + styles.fullWidth}>
              <input
                type="text"
                placeholder="Reason*"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                className={styles.input}
              />
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
  );
}
