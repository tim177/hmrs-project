import { Bell, Mail, ChevronDown, User } from "lucide-react";
import styles from "./header.module.css";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.pageTitle}>{title}</h1>
      <div className={styles.headerActions}>
        <button className={styles.iconButton}>
          <Mail size={20} />
        </button>
        <button className={styles.iconButton}>
          <Bell size={20} />
        </button>
        <div className={styles.userProfile}>
          <User size={20} />
          <ChevronDown size={16} />
        </div>
      </div>
    </header>
  );
}
