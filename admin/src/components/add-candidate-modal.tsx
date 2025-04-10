import type React from "react";

import { X, Upload } from "lucide-react";
import { useState } from "react";
import styles from "./add-candidate-modal.module.css";
import axios from "../axiosConfig";
import { toast } from "react-toastify";

interface AddCandidateModalProps {
  onClose: () => void;
  onSave: () => void;
}

export default function AddCandidateModal({
  onClose,
  onSave,
}: AddCandidateModalProps) {
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

    const form = new FormData();
    form.append("fullName", formData.fullName);
    form.append("email", formData.email);
    form.append("phone", formData.phone);
    form.append("position", formData.position);
    form.append("experience", formData.experience);
    if (formData.resume) {
      form.append("resume", formData.resume);
    }

    try {
      await axios.post("/api/employee/candidates", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onSave();
      toast.success("Candidate added successfully!");
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Submission failed");
    }

    console.log("Form submitted:", formData);
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
