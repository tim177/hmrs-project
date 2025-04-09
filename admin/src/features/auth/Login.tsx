import { Link } from "react-router-dom";
import styles from "./Login.module.css";

export default function Login() {
  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <div className={styles.logo}>LOGO</div>
      </div>
      <div className={styles.authContainer}>
        <div className={styles.leftSection}>
          <div className={styles.dashboardPreview}>
            <img
              src="/placeholder.svg"
              alt="Dashboard Preview"
              width={400}
              height={400}
              className={styles.previewImage}
            />
          </div>
          <div className={styles.previewText}>
            <h2>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod
            </h2>
            <p>
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
              minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.
            </p>
          </div>
          <div className={styles.dots}>
            <span className={`${styles.dot} ${styles.active}`}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.formContainer}>
            <h1>Welcome Back</h1>
            <form className={styles.loginForm}>
              <div className={styles.formGroup}>
                <label htmlFor="email">
                  Email Address<span className={styles.required}>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Email Address"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="password">
                  Password<span className={styles.required}>*</span>
                </label>
                <div className={styles.passwordContainer}>
                  <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    required
                  />
                  <button type="button" className={styles.eyeIcon}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className={styles.forgotPassword}>
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>
              <button type="submit" className={styles.loginButton}>
                Login
              </button>
            </form>
            <div className={styles.registerLink}>
              Don&apos;t have an account? <Link to="/register">Register</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
