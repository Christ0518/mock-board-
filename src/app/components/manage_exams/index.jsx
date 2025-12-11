"use client";
import * as XLSX from "xlsx";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./css/styles.module.css";
import { SweetAlert2, Fetch_toFile, Fetch_to } from "../../utilities";
import api_link from "../../config/api_links/links.json";
import Swal from "sweetalert2";

export default function ManageExams({ email }) {
  const router = useRouter();
  const [adminData, setAdminData] = useState({ name: "", email: "" });
  const [activeSection, setActiveSection] = useState("manageUsers");
  const fileRef = useRef(null);
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState("");

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

    const RetrieveData = async () => {
        const response = await Fetch_to(api_link.storage.retrieve, { email: email });
        if (response.success) {
            setData(response.data.message);
        }
    };
    RetrieveData();

  }, [refresh, email]);

  const UploadExcel = () => {
        fileRef.current?.click();
    };


  const HandleFile = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
          alert("Please select an Excel file (.xlsx)");
          return;
      }

      console.log("Excel selected:", file);

      // ------------ READ EXCEL ROWS ON CLIENT ------------
      const reader = new FileReader();

      reader.onload = async (event) => {
          const arrayBuffer = event.target.result;
          const workbook = XLSX.read(arrayBuffer, { type: "array" });

          const sheetName = workbook.SheetNames[0]; // first sheet
          const worksheet = workbook.Sheets[sheetName];

          const rows = XLSX.utils.sheet_to_json(worksheet);

          console.log("Excel Rows:", rows); 
          // rows array will contain all data inside the sheet

          // ------------ UPLOAD THE FILE TO BACKEND ------------
          SweetAlert2("Uploading", "Please wait...", "info", false, "", false, "", true);

          const response = await Fetch_toFile(api_link.storage.uploadfile, file, { email: email, items: rows.length });

          Swal.close();

          if (response.success) {
              SweetAlert2("Success", "Successfully uploaded", "success", true, "Okay");
              fileRef.current.value = "";
              setRefresh(!refresh);
          } else {
              SweetAlert2("Error", response.message, "error", true, "Confirm");
              fileRef.current.value = "";
          }
      };

      reader.readAsArrayBuffer(file);
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* SIDEBAR */}

      <>
        <input
        ref={fileRef}
        type="file"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        style={{ display: "none" }}
        onChange={HandleFile}
        />
      </>

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
      className={styles.addBtn} onClick={UploadExcel}
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
              <td> {excel.items} </td>
              <td> {excel.duration} </td>
              <td> {new Date(excel.created_at).toLocaleDateString("en-US")} </td>
              <td className={styles.actions}>
                <button className={styles.viewBtn}>View</button>
                <button className={styles.editBtn}>Edit</button>
                <button className={styles.deleteBtn}>Delete</button>
              </td>
            </tr>
          ))
        ) : (
          <tr> </tr>
        )}

        

      </tbody>
    </table>
  </div>
</div>
      </main>
    </div>
  );
}
