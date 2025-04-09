import { useEffect, useState } from "react";
import { Search, ChevronDown, MoreVertical } from "lucide-react";
import styles from "./dashboard.module.css";
import AddCandidateModal from "../../components/add-candidate-modal";
import Header from "../../features/dashboard/Header";

type ICandidate = {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  status: string;
  experience: string;
  createdAt: string;
};

export default function CandidatesTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [candidates, setCandidates] = useState<ICandidate[]>([]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchCandidates = async () => {
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
          status: emp.status,
          createdAt: emp.createdAt,
        }));
        console.log(data);
        setCandidates(filtered);
      } catch (error) {
        console.error("Failed to fetch candidates:", error);
      }
    };

    fetchCandidates();
  }, []);

  return (
    <div className={styles.container}>
      <Header title="Candidates" />

      <div className={styles.filters}>
        <div className={styles.filterOptions}>
          <div className={styles.filterDropdown}>
            <span>New</span>
            <ChevronDown size={16} />
          </div>
          <div className={styles.filterDropdown}>
            <span>Position</span>
            <ChevronDown size={16} />
          </div>
        </div>

        <div className={styles.actionArea}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={18} />
            <input
              type="text"
              placeholder="Search"
              className={styles.searchInput}
            />
          </div>
          <button className={styles.addButton} onClick={openModal}>
            Add Candidate
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Sr no.</th>
              <th>Candidates Name</th>
              <th>Email Address</th>
              <th>Phone Number</th>
              <th>Position</th>
              <th>Status</th>
              <th>Experience</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {candidates.length > 0 &&
              candidates.map((candidate, index) => (
                <tr key={candidate._id}>
                  <td>{index + 1 < 10 ? `0${index + 1}` : index + 1}</td>
                  <td>{candidate.fullName}</td>
                  <td>{candidate.email}</td>
                  <td>{candidate.phone}</td>
                  <td>{candidate.position}</td>
                  <td>
                    <div className={styles.statusDropdown}>
                      <span>{candidate.status}</span>
                      <ChevronDown size={16} />
                    </div>
                  </td>
                  <td>{candidate.experience}+ yr</td>
                  <td>
                    <button className={styles.actionButton}>
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && <AddCandidateModal onClose={closeModal} />}
    </div>
  );
}
