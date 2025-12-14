"use client";
import api_link from "../../config/api_links/links.json";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./css/styles.module.css";
import Fetch_to from "../../utilities/Fetch_to";

export default function AdminDashboard({ email }) {
  const router = useRouter();
  const [adminData, setAdminData] = useState({ name: "", email: "" });
  const [activeSection, setActiveSection] = useState("adminHome");
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [examData, setExamData] = useState([]);

  const adminMenuItems = [
    { id: "adminHome", label: "Dashboard", dir: "/admin" },
    { id: "manageUsers", label: "Manage Users", dir: "/manage_users" },
    { id: "manageExams", label: "Manage Exams", dir: "/manage_exams" },
    { id: "examResult", label: "Exam Result", dir: "/exam_result" },
  ];

  useEffect(() => {
    try {
      const adminStr = localStorage.getItem("admin");
      if (adminStr) {
        setAdminData(JSON.parse(adminStr));
      }
    } catch (error) {
      console.error("Error loading admin data:", error);
    }

    const RetrieveUserData = async () => {
        const response = await Fetch_to(api_link.admin.retrieve_user_assign_by, { email: email });
        if (response.success) {
            setUserData(response.data.message);
        }
    };
    RetrieveUserData();

    const RetrieveData = async () => {
        const response = await Fetch_to(api_link.storage.retrieve, { email: email });
        if (response.success) {
            setData(response.data.message);
        }
    };
    RetrieveData();

    const RetrieveExamData = async () => {
        const response = await Fetch_to(api_link.admin.exam_result, { email: email });
        if (response.success) {
            setExamData(response.data.message);
        }
    };
    RetrieveExamData();

    // Detect active page
    const path = window.location.pathname;
    const currentSection =
      adminMenuItems.find((item) => item.dir === path)?.id || "adminHome";
    setActiveSection(currentSection);
  }, [email]);

  return (
      <div className={styles.dashboardContainer}>
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
         

          <nav className={styles.nav}>
            {adminMenuItems.map((item) => (
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
          <header className={styles.header}>
            <div></div>

            <div className={styles.userSection}>
              <div className={styles.userProfile}>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{adminData.name}</span>
                  <span className={styles.userEmail}>{adminData.email}</span>
                </div>
              </div>

              <button
                className={styles.logoutBtn}
                onClick={ async() => {
                  const response = await Fetch_to("/services/jwt/deauth");
                  if (response.success) {
                    alert("Successfully");
                    router.push('/login');
                  } else {
                    alert("Something Went Wrong");
                  }
                }}
              >
                Logout
              </button>
            </div>
          </header>

          {/* DASHBOARD CONTENT */}
          <div className={styles.content}>
            <h2 className={styles.sectionTitle}>Admin Dashboard Overview</h2>

            <div className={styles.statsGrid}>
              <div className={styles.statsCard}>
                <h3>Total Users</h3>
                <p className={styles.statNumber}> {userData ? userData.length : 0} </p>
              </div>

              <div className={styles.statsCard}>
                <h3>Mock Exams Created</h3>
                <p className={styles.statNumber}> {data ? data.length : 0} </p>
              </div>

              <div className={styles.statsCard}>
                <h3>Completed Exam Sessions</h3>
                <p className={styles.statNumber}> {examData ? examData.length : 0} </p>
              </div>                                            
            </div>

            <div className={styles.reviewerHubWrapper}>
              <div className={styles.reviewerHub}>
                <h2>Admin Control Center</h2>
                <p>Manage users, exams, results, and system settings.</p>
                <button
                  className={styles.startBtn}
                  onClick={() => router.push("/manage_users")}
                >
                  Manage Users
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
  );
}
