/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Login.module.css";
import { toast } from "react-toastify";
import axios from "../../axiosConfig";
// Zod schema for validation
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// TypeScript type from schema
type LoginData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    try {
      const res = await axios.post("/api/user/login", data); // uses baseURL from config
      if (res.status === 200) {
        toast.success("Login successful! 🎉");
        navigate("/dashboard/candidates");
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed";
      setServerError(message);
      toast.error(message);
    }
  };

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
            <form
              className={styles.loginForm}
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className={styles.formGroup}>
                <label htmlFor="email">
                  Email Address<span className={styles.required}>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Email Address"
                  {...register("email")}
                />
                {errors.email && (
                  <p className={styles.error}>{errors.email.message}</p>
                )}
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
                    {...register("password")}
                  />
                </div>
                {errors.password && (
                  <p className={styles.error}>{errors.password.message}</p>
                )}
              </div>

              <div className={styles.forgotPassword}>
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>

              {serverError && <p className={styles.error}>{serverError}</p>}

              <button
                type="submit"
                className={styles.loginButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
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
