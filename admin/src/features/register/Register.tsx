import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import styles from "./Register.module.css";
import axios from "../../axiosConfig"; // adjust path if needed
import { toast } from "react-toastify";
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
      const response = await axios.post("/api/user/register", {
        username: data.fullName,
        email: data.email,
        password: data.password,
      });

      if (response.status === 201 || response.status === 200) {
        toast.success("Registration successful!...");
        setSubmitSuccess("Registration successful! Navigating to dashboard.");
        navigate("/dashboard/candidates");
        reset();
      } else {
        throw new Error("Unexpected response status");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      setSubmitError(message);
      toast.error(message);
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
                    type={"password"}
                    id="password"
                    placeholder="Password"
                    {...register("password")}
                    className={errors.password ? styles.inputError : ""}
                  />
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
                    type={"password"}
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    {...register("confirmPassword")}
                    className={errors.confirmPassword ? styles.inputError : ""}
                  />
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
