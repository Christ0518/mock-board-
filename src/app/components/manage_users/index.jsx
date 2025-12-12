"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./css/styles.module.css";

export default function ManageUsers() {
  const router = useRouter();
  const [adminData, setAdminData] = useState({ name: "", email: "" });
  const [activeSection, setActiveSection] = useState("manageUsers");

  const adminMenuItems = [
    { id: "adminHome", label: "Dashboard", dir: "/admin" },
    { id: "manageUsers", label: "Manage Users", dir: "/manage_users" },
    { id: "manageExams", label: "Manage Exams", dir: "/manage_exams" },
  ];

  useEffect(() => {
    const adminStr = localStorage.getItem("admin");
    if (adminStr) setAdminData(JSON.parse(adminStr));

    const path = window.location.pathname;
    const currentSection =
      adminMenuItems.find((i) => i.dir === path)?.id || "manageUsers";
    setActiveSection(currentSection);
  }, []);

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
        {/* HEADER */}
        <header className={styles.header}>
          <div className={styles.userSection}>
            <div className={styles.userProfile}>
              
              <div className={styles.userInfo}>
                <span className={styles.userName}>{adminData.name}</span>
                <span className={styles.userEmail}>{adminData.email}</span>
              </div>
            </div>

            <button
              className={styles.logoutBtn}
              onClick={() => {
                localStorage.removeItem("admin");
                router.push("/log_in");
              }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* MOCK BOARD EXAMINEES LIST */}
        <div className={styles.content}>
          <h2 className={styles.sectionTitle}>Manage Users</h2>
          <p className={styles.breadcrumb}>User login history</p>

          {/* Search + Add Button */}
          <div className={styles.topBar}>
            <input
              type="text"
              placeholder="Search by name or exam"
              className={styles.searchInput}
            />

            <button
              className={styles.addButton}
              onClick={() => router.push("/manage_users/create")}
            >
              + Add Examinee
            </button>
          </div>

          {/* Examinees Table */}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th></th>
                  <th>Examinee Name</th>
                  <th>Exam Name</th>
                  <th>Exam Type</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th>Date Taken</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td><input type="checkbox" /></td>

                  <td className={styles.studentCell}>
                    <Image
                      src="/student1.png"
                      alt="Examinee"
                      width={35}
                      height={35}
                      className={styles.studentAvatar}
                    />
                    <span>John Doe</span>
                  </td>

                  <td>General Education Mock</td>
                  <td>General Education</td>
                  <td><span className={styles.published}>Completed</span></td>
                  <td>85%</td>
                  <td>2025-01-15</td>

                  <td className={styles.actionBtns}>
                    <button
                      className={styles.viewBtn}
                      onClick={() => router.push("/manage_users/view/1")}
                    >
                      View
                    </button>
                    <button className={styles.deleteIcon}>🗑️</button>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
