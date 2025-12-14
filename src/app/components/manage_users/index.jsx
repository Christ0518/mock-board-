"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./css/styles.module.css";
import { Fetch_to } from "../../utilities";
import api_link from "../../config/api_links/links.json";

export default function ManageUsers({ email }) {
  const router = useRouter();
  const [adminData, setAdminData] = useState({ name: "", email: "" });
  const [activeSection, setActiveSection] = useState("manageUsers");
  const [userData, setUserData] = useState([]);

  const adminMenuItems = [
    { id: "adminHome", label: "Dashboard", dir: "/admin" },
    { id: "manageUsers", label: "Manage Users", dir: "/manage_users" },
    { id: "manageExams", label: "Manage Exams", dir: "/manage_exams" },
    { id: "examResult", label: "Exam Result", dir: "/exam_result" },
  ];

  useEffect(() => {
    const adminStr = localStorage.getItem("admin");
    if (adminStr) setAdminData(JSON.parse(adminStr));

    const path = window.location.pathname;
    const currentSection =
      adminMenuItems.find((i) => i.dir === path)?.id || "manageUsers";
    setActiveSection(currentSection);

    const RetrieveUserData = async () => {
        const response = await Fetch_to(api_link.admin.retrieve_user_assign_by, { email: email });
        if (response.success) {
            setUserData(response.data.message);
        }
    };
    RetrieveUserData();

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
          <p className={styles.breadcrumb}>Student Status</p>

          {/* Search + Add Button */}
          <div className={styles.topBar}>
            <input
              type="text"
              placeholder="Search by name or exam"
              className={styles.searchInput}
            />

            <button
              className={styles.addButton}
              onClick={() => router.push("/add_examinee")}
            >
              + Assign Examinee
            </button>
          </div>

          {/* Examinees Table */}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Examinee Name</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {userData && userData.length > 0 ? (
                  userData.map((user, index) => (
                    <tr key={index}>

                    <td className={styles.studentCell}>
                      <span> {user.name} </span>
                    </td>
                    <td><span className={styles.published} style={{ 
                      backgroundColor: user.status === "queu" || "underprocess" ? "#fef3c7" : "",
                      color: user.status === "queu" || "underprocess" ? "#92400e" : ""
                    }} 
                      > {user.status} </span></td>

                    <td className={styles.actionBtns}>
                      <button
                        className={styles.viewBtn}
                        onClick={ async () => {

                          const response = await Fetch_to(api_link.admin.unassigned, { email: user.email });

                          if (response.success) {
                            alert("User Successfully Unassigned");
                            window.location.reload();
                          }

                        }}
                      >
                        Unassigned
                      </button>
                    </td>
                  </tr>
                  ))
                ) : (
                  <tr>
                    <td> </td>
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
