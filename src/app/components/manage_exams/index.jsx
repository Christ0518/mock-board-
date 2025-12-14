"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./css/styles.module.css";
import { Fetch_to, SweetAlert2, Fetch_download } from "../../utilities";
import api_link from "../../config/api_links/links.json";
import Swal from "sweetalert2";

export default function ManageExams({ email }) {
  const router = useRouter();
  const [adminData, setAdminData] = useState({ name: "", email: "" });
  const [activeSection, setActiveSection] = useState("manageUsers");
  const [data, setData] = useState([]);

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

    const RetrieveData = async () => {
        const response = await Fetch_to(api_link.storage.retrieve, { email: email });
        if (response.success) {
            setData(response.data.message);
        }
    };
    RetrieveData();

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
                router.push("/login");
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
      className={styles.addBtn} onClick={() => {router.push("/form");}}
    >
      ➕ Upload Excel File
    </button>
  </div>

  {/* Exam Table */}
  <div className={styles.tableWrapper}>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Exam Title</th>
          <th>Parts</th>
          <th>Items</th>
          <th>Duration</th>
          <th>Date Created</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {data && data.length > 0 ? (
          data.map((excel, index) => (
            <tr key={index}>
              <td> {excel.exam_title} </td>
              <td> part {excel.parts} </td>
              <td> {excel.items} </td>
              <td> {excel.duration} min </td>
              <td> {new Date(excel.created_at).toLocaleDateString("en-US")} </td>
              <td className={styles.actions}>
                <button
                    className={styles.editBtn}
                    onClick={async () => {
                      try {
                        const response = await Fetch_download(
                          api_link.storage.download,
                          { filePath: excel.file_dir, name: excel.exam_title },
                          { "x-api-key": process.env.API_KEY || "" },
                          3,
                          1000,
                          true // <-- important: expect a Blob
                        );

                        if (!response.success) {
                          SweetAlert2("Error", `${response.message}`, "error", true, "Okay");
                          return;
                        }

                        // Trigger download
                        const url = window.URL.createObjectURL(response.data);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = excel.exam_title + ".xlsx";
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        window.URL.revokeObjectURL(url);
                      } catch (error) {
                        console.error(error);
                        SweetAlert2("Error", "Download failed", "error", true, "Okay");
                      }
                    }}
                  >
                    Download
                  </button>

                <button className={styles.deleteBtn} onClick={ async () => {

                  SweetAlert2("Deleting", "Please wait...", "info", false, "", false, "", true);

                  const response = await Fetch_to(api_link.storage.delete, { id: excel.id, filePath: excel.file_dir });

                  Swal.close();

                  if (response.success) {
                      SweetAlert2("Success", "Deleted!", "success", true, "Okay")
                      .then(() => {
                        window.location.reload();
                      });

                  } else {
                      SweetAlert2("Error", response.message || "Upload failed", "error", true, "Confirm").then(() => {
                        window.location.reload();
                      });
                  }

                }} >Delete</button>
              </td>
            </tr>
          ))
        ) : (
          <tr> 
            <td></td>
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
