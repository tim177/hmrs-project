import styles from "./logout-modal.module.css";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
}: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.content}>
          <h2 className={styles.title}>Logout</h2>
          <p className={styles.message}>Are you sure you want to logout?</p>

          <div className={styles.actions}>
            <button className={styles.noBtn} onClick={onClose}>
              No
            </button>
            <button className={styles.yesBtn} onClick={onConfirm}>
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
