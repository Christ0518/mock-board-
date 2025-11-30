"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./css/styles.module.css";

export default function AvailableExams() {
  const router = useRouter();
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [activeSection, setActiveSection] = useState("exam");

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
  }, []);

  const menuItems = [
    { id: "home", label: "Home", dir: "/dashboard" },
    { id: "about", label: "About", dir: "/about" },
    { id: "exam", label: "Exam", dir: "/exam" },
   
  ];

  const exams = [
    
    { title: "Librarian Licensure Examination (LLE)" },
    
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
              className={`${styles.navItem} ${activeSection === item.id ? styles.active : ""}`}
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

      {/* Main Exam Content */}
      <main className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>Available Exams</h1>
          
          <div className={styles.userSection}>
            <div className={styles.userProfile}>
              <Image
                src="/user.jpg"
                alt="User avatar"
                width={50}
                height={50}
                className={styles.avatar}
              />
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

        <div className={styles.container}>
          <div className={styles.headerSection}>
            <h1>Librarian Licensure Examination</h1>
            <p>Browse free online reviewers for Librarian Licensure Examination (LLE) Board Reviewers PH.</p>
          </div>

          <div className={styles.examSection}>
            <h2>Choose Your Exam</h2>
            <div className={styles.examGrid}>
              {exams.map((exam, index) => (
                <div key={index} className={styles.card}>
                  <h3>{exam.title}</h3>
                  <p>Click to begin review</p>
                  <button
                    className={styles.beginBtn}
                    onClick={() => router.push('/part_exam')}
                    aria-label={`Begin review for ${exam.title}`}
                  >
                    Begin Review
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
