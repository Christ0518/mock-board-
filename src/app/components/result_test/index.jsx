"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./css/styles.module.css";
import { Fetch_to } from "../../utilities";
import api_link from "../../config/api_links/links.json";

export default function ResultTest({ email }) {
  const router = useRouter();
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [activeSection, setActiveSection] = useState("test_result");
  const [data, setData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);

  const menuItems = [
    { id: 'home', label: 'Home', dir: '/dashboard' },
    { id: 'about', label: 'About', dir: '/about' },
    { id: 'exam', label: 'Exam', dir: '/exam' },
    { id: "testResult", label: "Test Result", dir: "/test_result" }
  ];

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) setUserData(JSON.parse(userStr));

    const path = window.location.pathname;
    const currentSection =
      menuItems.find((i) => i.dir === path)?.id || "testResult";
    setActiveSection(currentSection);

    const RetrieveUserData = async () => {
      const response = await Fetch_to(api_link.admin.Result_test, { email: email });
      if (response.success) {
        setData(response.data.message);
      }
    };
    RetrieveUserData();
  }, [email]);

  return (
    <div className={styles.dashboardContainer}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`${styles.navItem} ${
                activeSection === item.id ? styles.active : ""
              }`}
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

      {/* MAIN CONTENT */}
      <main className={styles.mainContent}>
        {/* HEADER */}
        <header className={styles.header}>
          <div className={styles.userSection}>
            <div className={styles.userProfile}>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{userData.name}</span>
                <span className={styles.userEmail}>{userData.email}</span>
              </div>
            </div>

            <button
              className={styles.logoutBtn}
              onClick={() => {
                localStorage.removeItem("user");
                router.push("/login");
              }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* MOCK BOARD EXAMINEES LIST */}
        <div className={styles.content}>
          <h2 className={styles.sectionTitle}>Exam Result</h2>
          <p className={styles.breadcrumb}>Result</p>

          {/* Search + Add Button */}
          <div className={styles.topBar}>
            <input
              type="text"
              placeholder="Search by name or exam"
              className={styles.searchInput}
            />
          </div>

          {/* Examinees Table */}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Examinee Name</th>
                  <th>Exam Title</th>
                  <th>Parts</th>
                  <th>Score</th>
                  <th>Passing Score</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {data && data.length > 0 ? (
                  data.map((item, index) => (
                    <>
                      <tr key={index}>
                        <td className={styles.studentCell}>
                          <span> {item.examinee_name} </span>
                        </td>
                        
                        <td> {item.exam_title} </td>
                        <td> Part {item.parts} </td>
                        <td>
                          <span className={styles.scoreTag}>
                            {item.score}
                          </span>
                        </td>
                        <td> {item.passing_score} </td>
                        <td>
                          <span className={`${styles.statusTag} ${
                            item.status === "passed" ? styles.statusPassed : styles.statusFailed
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className={styles.viewDetailsBtn}
                            onClick={() => setExpandedRow(expandedRow === index ? null : index)}
                          >
                            {expandedRow === index ? "Hide Details" : "View Details"}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Details Row */}
                      {expandedRow === index && (
                        <tr className={styles.expandedRow}>
                          <td colSpan="7">
                            <div className={styles.detailsContainer}>
                              <h3 className={styles.detailsTitle}>Question-by-Question Results</h3>
                              
                              {item.answers && item.answers.length > 0 ? (
                                <div className={styles.answersGrid}>
                                  {item.answers.map((answer, ansIndex) => (
                                    <div 
                                      key={ansIndex} 
                                      className={`${styles.answerCard} ${
                                        answer.is_correct ? styles.correctAnswer : styles.wrongAnswer
                                      }`}
                                    >
                                      <div className={styles.questionNumber}>
                                        Question #{ansIndex + 1}
                                        <span className={styles.statusIcon}>
                                          {answer.is_correct ? "✓" : "✗"}
                                        </span>
                                      </div>
                                      <div className={styles.answerDetails}>
                                        <p><strong>Question:</strong> {answer.question || "N/A"}</p>
                                        <p><strong>Examinee's Answer:</strong> 
                                          <span className={answer.is_correct ? styles.correct : styles.wrong}>
                                            {answer.examinee_answer || "No answer"}
                                          </span>
                                        </p>
                                        {!answer.is_correct && (
                                          <p><strong>Correct Answer:</strong> 
                                            <span className={styles.correct}>
                                              {answer.correct_answer}
                                            </span>
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className={styles.noData}>No detailed answer data available</p>
                              )}

                              <div className={styles.summarySection}>
                                <div className={styles.summaryItem}>
                                  <span className={styles.summaryLabel}>Total Questions:</span>
                                  <span className={styles.summaryValue}>{item.answers?.length || 0}</span>
                                </div>
                                <div className={styles.summaryItem}>
                                  <span className={styles.summaryLabel}>Correct Answers:</span>
                                  <span className={`${styles.summaryValue} ${styles.correct}`}>
                                    {item.answers?.filter(a => a.is_correct).length || 0}
                                  </span>
                                </div>
                                <div className={styles.summaryItem}>
                                  <span className={styles.summaryLabel}>Wrong Answers:</span>
                                  <span className={`${styles.summaryValue} ${styles.wrong}`}>
                                    {item.answers?.filter(a => !a.is_correct).length || 0}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className={styles.noData}>No results found</td>
                  </tr>
                )}

              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
