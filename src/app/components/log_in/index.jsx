'use client';
import styles from './css/styles.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Fetch_to } from '../../utilities';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

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

    const data = await Fetch_to('/services/api/login', formData);

    if (data && data.success) {
      await Fetch_to('/services/jwt/auth', {
        email: formData.email
      });

      console.log(data);
      if (data.data.user.role === "admin") {
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
        
        {/* Google Login Button */}
        <div className={styles.googleLogin}>
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            {typeof window !== 'undefined' && (
              <GoogleLogin
                onSuccess={async (response) => {
                  try {
                    await handleGoogleSuccess(response);
                    router.push('/dashboard');
                  } catch (error) {
                    console.error('Google login failed:', error);
                    alert('Login failed. Please try again.');
                  }
                }}
                onError={(err) => {
                  // Handle FedCM AbortError and other errors gracefully
                  console.error('Google Login Failed', err);
                  if (err && err.error && err.error === 'idpiframe_initialization_failed') {
                    alert('Google Sign-in not available in this browser. Please try a different browser.');
                  } else {
                    alert('Google login failed. Please try again.');
                  }
                }}
              />
            )}
          </GoogleOAuthProvider>
        </div>

        <div className={styles.divider}>
          <span>Or</span>
        </div>

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
