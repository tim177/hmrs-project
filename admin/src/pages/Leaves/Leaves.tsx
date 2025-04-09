import { useEffect, useState } from "react";
import { Search, ChevronDown, User, FileText } from "lucide-react";
import Calendar from "react-calendar";
import styles from "./leaves.module.css";
import "react-calendar/dist/Calendar.css";
import Header from "../../features/dashboard/Header";
import AddLeaveModal from "../../components/add-leave-modal";

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSaveLeave = (leaveData: any) => {
    // Here you would typically save the leave data to your backend
    console.log("Leave data saved:", leaveData);
    // You could also update your local state to show the new leave
  };

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/employee/candidates"
        );
        const data = await res.json();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filteredLeaves = data.map((leave: any) => ({
          _id: leave._id,
          fullName: leave.fullName,
          position: leave.position,
          date: leave.date,
          reason: leave.reason,
          status: leave.status,
          hasDocuments: leave.hasDocuments,
        }));

        setLeaves(filteredLeaves);
      } catch (error) {
        console.error("Failed to fetch leaves:", error);
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
                  <td>{leave.date}</td>
                  <td>{leave.reason}</td>
                  <td>
                    <div
                      className={`${styles.statusDropdown} ${
                        styles[leave.status.toLowerCase()]
                      }`}
                    >
                      <select
                        defaultValue={leave.status}
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
                  <div className={styles.approvedLeaveDate}>{leave.date}</div>
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
