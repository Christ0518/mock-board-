'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './css/styles.module.css';

export default function About({ email }) {
  const router = useRouter();
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [activeSection, setActiveSection] = useState('about');
  
  useEffect(() => {
    // Get user data
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        setUserData(JSON.parse(userStr));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
    
    // Set active section to 'about' when component mounts
    setActiveSection('about');
  }, []);

  const menuItems = [
    { id: 'home', label: 'Home', dir: '/dashboard' },
    { id: 'about', label: 'About', dir: '/about' },
    { id: 'exam', label: 'Exam', dir: '/exam' },
  
  ];

  return (
      <div className={styles.dashboardContainer}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.logo}>
            <Image src="/logo.png" alt="Mock Board Logo" width={100} height={100} className={styles.logoImage} />
            <Image src="/AYL_LOGO.png" alt="AYL Logo" width={100} height={100} className={styles.logoImage1} />
            <Image src="/sbit_logo.png" alt="SBIT Logo" width={100} height={100} className={styles.logoImage2} />
          </div>

          <nav className={styles.nav}>
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`${styles.navItem} ${activeSection === item.id ? styles.active : ''}`}
                onClick={() => {
                  setActiveSection(item.id);
                  router.push(item.dir);
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          {/* Header */}
          <header className={styles.header}>
            <div className={styles.logoContainer}>
              {/* Optional: Add page title or logo here */}
            </div>

            <div className={styles.userSection}>
              <div className={styles.userProfile}>
                <h3> {email ? email : " --- "} </h3>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{userData.name}</span>
                </div>
              </div>

              <button 
                className={styles.logoutBtn}
                onClick={() => {
                  localStorage.removeItem('isAuthenticated');
                  localStorage.removeItem('user');
                  router.push('/login');
                }}
              >
                Logout
              </button>
            </div>
          </header>

          {/* ABOUT PAGE CONTENT */}
          <div className={styles.content}>
           

            <section className={styles.aboutSection}>
              <img src="/logo.png" alt="Librarian’s Hub" className={styles.logo} />
              <h1 className={styles.title}>About the Librarian’s Hub</h1>
              <p className={styles.description}>
                The Librarian’s Hub is dedicated to supporting aspiring and practicing librarians in their journey toward professional excellence.
                We provide free, accessible, and quality resources for exam preparation and continuing education.
              </p>
            </section>

            <section className={styles.missionSection}>
              <h2 className={styles.sectionTitle}> Our Mission</h2>
              <p className={styles.missionText}>
                To empower librarians by providing access to resources, review materials, and guidance that enhance their skills and confidence.
              </p>
            </section>

            <section className={styles.visionSection}>
              <h2 className={styles.sectionTitle}> Our Vision</h2>
              <p className={styles.visionText}>
                To be the most trusted online platform for librarianship review and professional growth.
              </p>
            </section>

            <section className={styles.valuesSection}>
              <h2 className={styles.sectionTitle}> Our Core Values</h2>
              <div className={styles.valuesGrid}>
                <div className={styles.valueCard}>
                  <h3>Knowledge</h3>
                  <p>We promote continuous learning across all areas of librarianship.</p>
                </div>
                <div className={styles.valueCard}>
                  <h3>Integrity</h3>
                  <p>We uphold honesty, transparency, and ethical responsibility.</p>
                </div>
                <div className={styles.valueCard}>
                  <h3>Service</h3>
                  <p>We believe in helping others through access to information and collaboration.</p>
                </div>
                <div className={styles.valueCard}>
                  <h3>Excellence</h3>
                  <p>We aim to deliver high-quality content that supports success in exams and beyond.</p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
  );
}
