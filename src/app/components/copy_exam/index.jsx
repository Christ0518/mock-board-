"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./css/styles.module.css";

export default function PartExam() {
  const router = useRouter();
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [activeSection, setActiveSection] = useState("part_exam");

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



 
  const subjects = [
    {
      title: "Library Organization & Management",
      desc: "PART 1 TEST.",
    },
    {
      title: "Reference, Bibliography & User Services",
      desc: "PART 2 TEST.",
    },
    {
      title: "Indexing & Abstracting",
      desc: "PART 3 TEST.",
    },
    {
      title: "Cataloging & Classification",
      desc: "PART 4 TEST.",
    },
    {
      title: "Selection & Acquisition",
      desc: "PART 5 TEST.",
    },
    {
      title: "Information Technology",
      desc: "PART 6 TEST.",
    },
  ];

  return (
    <div className={styles.dashboardContainer}>
      <main className={styles.mainContent}>
        <div className={styles.mainWrapper}>
          {/* Back Button */}
          <button 
            className={styles.backButton}
            onClick={() => router.push('/exam')}
          >
            <span className={styles.backArrow}>←</span>
            Back to Exams
          </button>

          {/* Page Header */}
          <h1 className={styles.pageTitle}>Librarian Licensure Examination (LLE) Subjects</h1>
          <p className={styles.pageSubtitle}>
            Choose a topic under <strong>Librarian Licensure Examination (LLE)</strong> to start reviewing.
          </p>

          {/* Subject Grid */}
          <div className={styles.subjectGrid}>
            {subjects.map((item, index) => (
              <div key={index} className={styles.subjectCard}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDesc}>{item.desc}</p>
                {/* If this is the Library Organization subject, add a Begin Test button */}
                {item.title.toLowerCase().includes('library organization') && (
                  <button
                    className={styles.beginBtn}
                    onClick={() => router.push('/part_exam/library-organization')}
                  >
                    Begin Test
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
