import type React from "react";

import { X, Upload } from "lucide-react";
import { useState } from "react";
import styles from "./add-candidate-modal.module.css";

interface AddCandidateModalProps {
  onClose: () => void;
}

export default function AddCandidateModal({ onClose }: AddCandidateModalProps) {
  const [formData, setFormData] = useState<{
    fullName: string;
    email: string;
    phone: string;
    position: string;
    experience: string;
    resume: File | null;
    agreement: boolean;
  }>({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    resume: null,
    agreement: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      position: formData.position,
      experience: formData.experience,
    };

    try {
      const res = await fetch("http://localhost:5000/api/employee/candidates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to submit candidate");

      alert("Candidate added successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Submission failed");
    }
    console.log("Form submitted:", formData);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Add New Candidate</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className={styles.modalBody}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name*"
                  className={styles.formInput}
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address*"
                  className={styles.formInput}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number*"
                  className={styles.formInput}
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  name="position"
                  placeholder="Position*"
                  className={styles.formInput}
                  value={formData.position}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  name="experience"
                  placeholder="Experience*"
                  className={styles.formInput}
                  value={formData.experience}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <div className={styles.fileInput}>
                  <input
                    type="file"
                    name="resume"
                    id="resume"
                    className={styles.hiddenFileInput}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFormData({
                          ...formData,
                          resume: e.target.files[0],
                        });
                      }
                    }}
                  />
                  <label htmlFor="resume" className={styles.fileInputLabel}>
                    <span>Resume*</span>
                    <Upload size={18} />
                  </label>
                </div>
              </div>
            </div>

            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                name="agreement"
                id="agreement"
                checked={formData.agreement}
                onChange={handleChange}
                className={styles.checkbox}
              />
              <label htmlFor="agreement" className={styles.checkboxLabel}>
                I hereby declare that the above information is true to the best
                of my knowledge and belief
              </label>
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
