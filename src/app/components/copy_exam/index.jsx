"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./css/styles.module.css";
import { Fetch_to } from "../../utilities";
import api_link from "../../config/api_links/links.json";

export default function PartExam({ email }) {
  const router = useRouter();
  const [subjects, setSubjects] = useState([]);
  const [statusParts, setStatusParts] = useState([]);

  useEffect(() => {
    // Get user data
    const RetrieveData = async () => {
        const response = await Fetch_to(api_link.user_data.retrieve_mock_exam, { email: email });
        if (response.success) {

            console.log(statusParts)

            setStatusParts(response.data.message2);

            setSubjects(response.data.message);
        }
    };
    RetrieveData();
  }, [email]);

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
            {subjects.map((item, index) => {
              // Check if previous part exists and if it was failed
              const currentPart = Number(item.parts);
              const previousPart = currentPart - 1;
              
              // Find the status of the previous part
              const previousPartStatus = statusParts.find(
                status => Number(status.parts) === previousPart
              );
              
              // Disable button if:
              // 1. Previous part exists and was failed, OR
              // 2. Previous part exists but hasn't been taken yet (not in statusParts)
              const isDisabled = previousPart > 0 && 
                                 (!previousPartStatus || previousPartStatus.status === 'Failed');
              
              return (
                <div key={index} className={styles.subjectCard}>
                  <h3 className={styles.cardTitle}>{item.exam_title}</h3>
                  <p className={styles.cardDesc}> Part {item.parts} </p>
                  
                  {isDisabled && (
                    <p style={{ color: '#F44336', fontSize: '0.9rem', marginTop: '10px' }}>
                      Complete Part {previousPart} first
                    </p>
                  )}
                  
                  <button
                    className={styles.beginBtn}
                    disabled={isDisabled}
                    style={isDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                    onClick={() => {
                      if (isDisabled) return;
                      localStorage.setItem("exam_id", item.id);
                      localStorage.setItem("assign_time", item.duration);
                      localStorage.setItem("assign_by", item.email);
                      localStorage.setItem("passing_score", item.passing_score || 75);
                      localStorage.setItem("exam_title", item.exam_title);
                      localStorage.setItem("parts", item.parts);
                      router.push('/part_exam/library-organization')
                    }}
                  >
                    {isDisabled ? 'Locked' : 'Begin Test'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
