"use client";
import styles from "./css/styles.module.css";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Fetch_to } from "../../utilities";
import api_link from "../../config/api_links/links.json";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await Fetch_to(api_link.auth.check_email, { email: formData.email });

    if (data.success) {

      const data = await Fetch_to(api_link.auth.signup, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        c_password: formData.confirmPassword,
        role: formData.role
      });

      if (data.success) {
        router.push("/login");
      } else {
        alert(data.message);
      }

    } else {

      alert(data.message);

    }

    
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupBox}>
        <div className={styles.logoSection}>
          <img src="/lccb_logo.png" alt="LCCB Logo" className={styles.logo} />
        </div>
        <h2 className={styles.title}>Create Account</h2>

        <form className={styles.form} onSubmit={handleSubmit}>

          <div className={styles.inputGroup}>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* 🔹 NEW Confirm Password Field */}
          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* Role Selection */}
          <div className={styles.inputGroup1}>
            <label htmlFor="role">Select Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className={styles.submitButton}>
            Sign Up
          </button>
        </form>

        <div className={styles.divider}>
          <span>Or</span>
        </div>

        {/* Google Auth (unchanged) */}
        <div className={styles.googleSignup}>
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
            {typeof window !== "undefined" && (
              <GoogleLogin
                onSuccess={async (response) => {
                  try {
                    await handleGoogleSuccess(response);
                    localStorage.setItem(
                      "user",
                      JSON.stringify({
                        name: "Google User",
                        email: "google@example.com",
                        role: "student",
                      })
                    );
                    router.push("/student/dashboard");
                  } catch (error) {
                    alert("Google signup failed. Please try again.");
                  }
                }}
                onError={() => alert("Google signup failed.")}
                text="signup_with"
              />
            )}
          </GoogleOAuthProvider>
        </div>

        <p className={styles.switchText}>
          Already have an account?{" "}
          <Link href="/login" className={styles.switchLink}>
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
