/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Search, ChevronDown, User, FileText } from "lucide-react";
import Calendar from "react-calendar";
import styles from "./leaves.module.css";
import "react-calendar/dist/Calendar.css";
import Header from "../../features/dashboard/Header";
import AddLeaveModal from "../../components/add-leave-modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../../axiosConfig";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

type Leave = {
  _id: string;
  fullName: string;
  position: string;
  date: string;
  reason: string;
  status: "New" | "Approved" | "Rejected";
  hasDocuments: boolean;
};

export default function SimpleLeavesPage() {
  const [value, onChange] = useState<Value>(new Date());
  const [statusOptions] = useState(["New", "Approved", "Rejected"]);
  const [leaves, setLeaves] = useState<Leave[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveLeave = async (formData: FormData) => {
    try {
      const res = await axios.post("/api/leaves", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setLeaves((prev) => [...prev, res.data]);
      toast.success("Leave added successfully!");
    } catch (error: any) {
      console.error("Error saving leave:", error);
      toast.error(
        `Error adding leave: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const handleStatusChange = async (leaveId: string, newStatus: string) => {
    try {
      await axios.patch(`/api/leaves/${leaveId}`, {
        status: newStatus,
      });

      setLeaves((prev) =>
        prev.map((leave) =>
          leave._id === leaveId
            ? { ...leave, status: newStatus as Leave["status"] }
            : leave
        )
      );
      toast.success("Leave status updated!");
    } catch (error: any) {
      console.error("Error updating leave status:", error);
      toast.error(
        `Error updating status: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get("/api/leaves");
        setLeaves(res.data);
      } catch (error: any) {
        console.error("Failed to fetch leaves:", error);
        toast.error(
          `Error fetching leaves: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    };

    fetchLeaves();
  }, []);

  return (
    <div className={styles.container}>
      <Header title="Leaves" />

      <div className={styles.filters}>
        <div className={styles.filterDropdown}>
          <span>Status</span>
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
        <button className={styles.addButton} onClick={handleOpenModal}>
          Add Leave
        </button>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.leavesTable}>
          <h2 className={styles.sectionTitle}>Applied Leaves</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Profile</th>
                <th>Name</th>
                <th>Date</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Docs</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave._id}>
                  <td>
                    <div className={styles.profileAvatar}>
                      <User size={18} />
                    </div>
                  </td>
                  <td>
                    <div>
                      <div className={styles.employeeName}>
                        {leave.fullName}
                      </div>
                      <div className={styles.employeePosition}>
                        {leave.position}
                      </div>
                    </div>
                  </td>
                  <td>
                    {new Date(leave.date).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td>{leave.reason}</td>
                  <td>
                    <div
                      className={`${styles.statusDropdown} ${
                        styles[leave.status.toLowerCase()]
                      }`}
                    >
                      <select
                        value={leave.status}
                        onChange={(e) =>
                          handleStatusChange(leave._id, e.target.value)
                        }
                        className={styles.statusSelect}
                      >
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={16} />
                    </div>
                  </td>
                  <td>
                    {leave.hasDocuments && (
                      <FileText size={18} className={styles.docIcon} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.calendarSection}>
          <h2 className={styles.sectionTitle}>Leave Calendar</h2>
          <div className={styles.calendar}>
            <Calendar
              onChange={onChange}
              value={value}
              className={styles.reactCalendar}
            />
          </div>

          <div className={styles.approvedLeaves}>
            <h3 className={styles.approvedLeavesTitle}>Approved Leaves</h3>
            {leaves
              .filter((leave) => leave.status === "Approved")
              .map((leave) => (
                <div key={leave._id} className={styles.approvedLeaveItem}>
                  <div className={styles.approvedLeaveProfile}>
                    <div className={styles.profileAvatar}>
                      <User size={18} />
                    </div>
                    <div>
                      <div className={styles.employeeName}>
                        {leave.fullName}
                      </div>
                      <div className={styles.employeePosition}>
                        {leave.position}
                      </div>
                    </div>
                  </div>
                  <div className={styles.approvedLeaveDate}>
                    {new Date(leave.date).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <AddLeaveModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveLeave}
      />
    </div>
  );
}
