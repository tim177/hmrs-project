import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import styles from "./Register.module.css";

// Define the validation schema with Zod
const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");
    console.log("data is:", data);
    try {
      const response = await fetch("http://localhost:5000/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.fullName,
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      setSubmitSuccess("Registration successful! Navigating to dashboard.");
      navigate("/dashboard");

      reset();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
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
              src="/placeholder.svg?height=400&width=400"
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
            <h1>Welcome to Dashboard</h1>

            {submitSuccess && (
              <div className={styles.successMessage}>{submitSuccess}</div>
            )}
            {submitError && (
              <div className={styles.errorMessage}>{submitError}</div>
            )}

            <form
              className={styles.registerForm}
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className={styles.formGroup}>
                <label htmlFor="fullName">
                  Full name<span className={styles.required}>*</span>
                </label>
                <input
                  id="fullName"
                  placeholder="Full name"
                  {...register("fullName")}
                  className={errors.fullName ? styles.inputError : ""}
                />
                {errors.fullName && (
                  <p className={styles.errorText}>{errors.fullName.message}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">
                  Email Address<span className={styles.required}>*</span>
                </label>
                <input
                  id="email"
                  placeholder="Email Address"
                  {...register("email")}
                  className={errors.email ? styles.inputError : ""}
                />
                {errors.email && (
                  <p className={styles.errorText}>{errors.email.message}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password">
                  Password<span className={styles.required}>*</span>
                </label>
                <div className={styles.passwordContainer}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Password"
                    {...register("password")}
                    className={errors.password ? styles.inputError : ""}
                  />
                  <button
                    type="button"
                    className={styles.eyeIcon}
                    onClick={() => setShowPassword(!showPassword)}
                  >
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
                      {showPassword ? (
                        <>
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </>
                      ) : (
                        <>
                          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                          <line x1="2" x2="22" y1="2" y2="22" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
                {errors.password && (
                  <p className={styles.errorText}>{errors.password.message}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">
                  Confirm Password<span className={styles.required}>*</span>
                </label>
                <div className={styles.passwordContainer}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    {...register("confirmPassword")}
                    className={errors.confirmPassword ? styles.inputError : ""}
                  />
                  <button
                    type="button"
                    className={styles.eyeIcon}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
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
                      {showConfirmPassword ? (
                        <>
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </>
                      ) : (
                        <>
                          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                          <line x1="2" x2="22" y1="2" y2="22" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className={styles.errorText}>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className={styles.registerButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register"}
              </button>
            </form>
            <div className={styles.loginLink}>
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
