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

 
  

  <h2 className={styles.sectionTitle}>Manage Mock Board Exams</h2>

  {/* Top Controls */}
  <div className={styles.topControls}>
    <input
      type="text"
      placeholder="Search mock exams..."
      className={styles.searchInput}
    />

    <button
      className={styles.addBtn}
      onClick={() => router.push("/manage_exams/create")}
    >
      ➕ Create Mock Exam
    </button>
  </div>

  {/* Exam Table */}
  <div className={styles.tableWrapper}>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Exam Title</th>
          <th>Exam Type</th>
          <th>Items</th>
          <th>Duration</th>
          <th>Status</th>
          <th>Date Created</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>General Education Mock Board</td>
          <td>General Education</td>
          <td>150</td>
          <td>2 hrs</td>
          <td><span className={styles.published}>Published</span></td>
          <td>2025-01-10</td>
          <td className={styles.actions}>
            <button className={styles.viewBtn}>View</button>
            <button className={styles.editBtn}>Edit</button>
            <button className={styles.deleteBtn}>Delete</button>
          </td>
        </tr>

        <tr>
          <td>Professional Education Mock Board</td>
          <td>Professional Education</td>
          <td>170</td>
          <td>2 hrs</td>
          <td><span className={styles.published}>Published</span></td>
          <td>2025-01-14</td>
          <td className={styles.actions}>
            <button className={styles.viewBtn}>View</button>
            <button className={styles.editBtn}>Edit</button>
            <button className={styles.deleteBtn}>Delete</button>
          </td>
        </tr>

        <tr>
          <td>Major Exam – English</td>
          <td>Major Subject</td>
          <td>150</td>
          <td>2 hrs</td>
          <td><span className={styles.draft}>Draft</span></td>
          <td>2025-01-18</td>
          <td className={styles.actions}>
            <button className={styles.viewBtn}>View</button>
            <button className={styles.editBtn}>Edit</button>
            <button className={styles.deleteBtn}>Delete</button>
          </td>
        </tr>

        <tr>
          <td>Major Exam – Mathematics</td>
          <td>Major Subject</td>
          <td>150</td>
          <td>2 hrs</td>
          <td><span className={styles.published}>Published</span></td>
          <td>2025-01-20</td>
          <td className={styles.actions}>
            <button className={styles.viewBtn}>View</button>
            <button className={styles.editBtn}>Edit</button>
            <button className={styles.deleteBtn}>Delete</button>
          </td>
        </tr>

        <tr>
          <td>LET Comprehensive Mock Board</td>
          <td>Full Exam</td>
          <td>300</td>
          <td>3 hrs</td>
          <td><span className={styles.published}>Published</span></td>
          <td>2025-01-05</td>
          <td className={styles.actions}>
            <button className={styles.viewBtn}>View</button>
            <button className={styles.editBtn}>Edit</button>
            <button className={styles.deleteBtn}>Delete</button>
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
