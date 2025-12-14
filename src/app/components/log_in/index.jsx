'use client';
import styles from './css/styles.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Fetch_to } from '../../utilities';
import api_link from "../../config/api_links/links.json";



export default function LogIn() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Prevent SSR/client mismatch
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await Fetch_to(api_link.auth.signin, formData);

    if (response && response.success) {
      await Fetch_to('/services/jwt/auth', {
        email: formData.email
      });

      console.log(response.data);
      if (response.data.message[0].role === "admin") {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } else {
      alert(data?.message || 'Login failed. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="Logo" />
        </div>
        <h1 className={styles.title}>Welcome Back</h1>
        
        
       
               
                

      

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Log In
          </button>
        </form>
        <p className={styles.switchText}>
          Don&apos;t have an account?{' '}
          <span
            className={styles.switchLink}
            onClick={() => router.push('/signup')}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
