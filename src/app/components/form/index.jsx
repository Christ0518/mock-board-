'use client';
import * as XLSX from "xlsx";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './css/styles.module.css';
import { SweetAlert2, Fetch_toFile } from "../../utilities";
import api_link from "../../config/api_links/links.json";
import Swal from "sweetalert2";

export default function Form ({ email }) {
  const router = useRouter();
  const fileRef = useRef(null);
  const [excelFile, setExcelFile] = useState(null);
  const [adminData, setAdminData] = useState({ name: "", email: email || "", duration: "" });
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [rowCount, setRowCount] = useState(0);

  useEffect(() => {
    setAdminData(prev => ({
      ...prev,
      email: email || ""
    }));
  }, [email]);
  
  const UploadExcel = () => {
    fileRef.current?.click();
  };

  const HandleFile = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
          SweetAlert2("Invalid File", "Please select an Excel file (.xlsx)", "warning", true, "Okay");
          return;
      }

      setFileName(file.name);
      setExcelFile(file);

      // ------------ READ EXCEL ROWS ON CLIENT ------------
      const reader = new FileReader();

      reader.onload = async (event) => {
          const arrayBuffer = event.target.result;
          const workbook = XLSX.read(arrayBuffer, { type: "array" });

          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          const rows = XLSX.utils.sheet_to_json(worksheet);
          setRowCount(rows.length);

          console.log("Excel Rows:", rows);
      };

      reader.readAsArrayBuffer(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ------------ UPLOAD THE FILE TO BACKEND ------------
          SweetAlert2("Uploading", "Please wait...", "info", false, "", false, "", true);

          const response = await Fetch_toFile(api_link.storage.uploadfile, excelFile, { 
            email: adminData.email, 
            items: rowCount, 
            duration: adminData.duration,
            name: adminData.name
          }); 

          Swal.close();

          if (response.success) {
              SweetAlert2("Success", "File uploaded successfully!", "success", true, "Okay");
              fileRef.current.value = "";
              setFileName("");
              setRowCount(0);
              setAdminData(prev => ({
                ...prev,
                name: "", duration: ""
              }));
          } else {
              SweetAlert2("Error", response.message || "Upload failed", "error", true, "Confirm");
              fileRef.current.value = "";
              setFileName("");
          }


  };

  return (
      <div className={styles.dashboardContainer}>
        <div className={styles.formWrapper}>
          <div className={styles.formHeader}>
            <h1 className={styles.formTitle}>Create Exam</h1>
            <p className={styles.formSubtitle}>Upload exam questions and configure settings</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Exam Name */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="name">
                <span className={styles.labelIcon}>📝</span>
                Exam Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={adminData.name}
                onChange={handleInputChange}
                placeholder="e.g., Final Mathematics Exam"
                className={styles.input}
                required
              />
            </div>

            {/* Duration */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="duration">
                <span className={styles.labelIcon}>⏱️</span>
                Duration (minutes)
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={adminData.duration}
                onChange={handleInputChange}
                placeholder="60"
                min="1"
                className={styles.input}
                required
              />
            </div>

            {/* File Upload */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>📊</span>
                Upload Questions (Excel)
              </label>
              <div className={styles.uploadSection}>
                <button
                  type="button"
                  onClick={UploadExcel}
                  className={styles.uploadButton}
                >
                  <span className={styles.uploadIcon}>📁</span>
                  {fileName ? "Change File" : "Choose Excel File"}
                </button>
                {fileName && (
                  <div className={styles.fileInfo}>
                    <span className={styles.fileName}>📄 {fileName}</span>
                    <span className={styles.fileDetails}>{rowCount} questions detected</span>
                  </div>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                style={{ display: "none" }}
                onChange={HandleFile}
              />
            </div>

            {/* Form Summary */}
            {adminData.name && adminData.duration && fileName && (
              <div className={styles.formSummary}>
                <h3 className={styles.summaryTitle}>📋 Summary</h3>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Exam:</span>
                    <span className={styles.summaryValue}>{adminData.name}</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Duration:</span>
                    <span className={styles.summaryValue}>{adminData.duration} min</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Questions:</span>
                    <span className={styles.summaryValue}>{rowCount}</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Admin:</span>
                    <span className={styles.summaryValue}>{adminData.email}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className={styles.formActions}>
              <button 
                type="button" 
                onClick={() => { router.push("/manage_exams"); setLoading(true); }}
                className={styles.secondaryButton}
              >
                ← Back
              </button>
              <button 
                type="submit" 
                className={styles.primaryButton}
                disabled={loading}
              >
                {loading ? "Processing..." : "Create Exam →"}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}
