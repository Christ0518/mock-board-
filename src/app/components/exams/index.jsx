"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./css/styles.module.css";
import api_link from "../../config/api_links/links.json";
import { Fetch_to } from "../../utilities";

export default function AvailableExams({ email }) {
  const router = useRouter();
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [activeSection, setActiveSection] = useState("exam");
  const [data, setData] = useState([]);

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

    const RetrieveData = async () => {
        const response = await Fetch_to(api_link.user_data.retrieve_mock_exam, { email: email });
        if (response.success) {
            setData(response.data.message);
        }
    };
    RetrieveData();

  }, []);

  const menuItems = [
    { id: "home", label: "Home", dir: "/dashboard" },
    { id: "about", label: "About", dir: "/about" },
    { id: "exam", label: "Exam", dir: "/exam" },
   
  ];

  const exams = [
    
    { title: "Librarian Licensure Examination (LLE)" },
    
  ];

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <Image src="/logo.png" alt="Mock Board Logo" width={100} height={100} className={styles.logoImage} />
          <Image src="/AYL_LOGO.png" alt="AYL Logo" width={100} height={100} className={styles.logoImage1} />
          <Image src="/sbit_logo.png" alt="SBIT Logo" width={100} height={100} className={styles.logoImage2} />
        </div>

        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`${styles.navItem} ${activeSection === item.id ? styles.active : ""}`}
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

      {/* Main Exam Content */}
      <main className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.pageTitle}></h1>
          
          <div className={styles.userSection}>
            <div className={styles.userProfile}>
              { email ? email : " --- " }
              <div className={styles.userInfo}>
                <span className={styles.userName}>{userData.name}</span>
              </div>
            </div>

            <button 
              className={styles.logoutBtn}
              onClick={() => {
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('user');
                router.push('/login');
              }}
            >
              Logout
            </button>
          </div>
        </header>

        <div className={styles.container}>
          <div className={styles.headerSection}>
            <h1>BLIS COMPUTER-BASED LICENSURE REVIEW:<br/> PRE-BOARD EXAMINATION </h1>
            <p>La Consolacion College Bacolod</p>
          </div>

          {/* Instruction Box */}
          <div className={styles.instructionBox}>
            <div className={styles.instructionHeader}>
              <svg className={styles.instructionIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              <h3>Exam Instructions</h3>
            </div>
            <div className={styles.instructionContent}>
              <ul className={styles.instructionList}>
                <li>
                  <span className={styles.instructionNumber}>1</span>
                  <div>
                    <strong>Read Carefully:</strong> You are about to begin the Computer-Based Licensure Review Examination. <br/>The exam is divided into one continuous session with a total allotted time of 2 hours.
                  </div>
                </li>
                <li>
                  <span className={styles.instructionNumber}>2</span>
                  <div>
                    <strong>Total Exam Time: </strong> You will have 2 hours (120 minutes) to complete the entire examination.
                  </div>
                </li>
                <li>
                  <span className={styles.instructionNumber}>3</span>
                  <div>
                    <strong>Navigation and Answering</strong> You may skip questions and move forward at any time.<br/>
You may revisit and review any unanswered or previously answered items as long as you are still within the 2-hour time limit.<br/>
The system will allow full navigation across all items until time expires.

                  </div>
                </li>
                <li>
                  <span className={styles.instructionNumber}>4</span>
                  <div>
                    <strong>	Time Limit:</strong> 	Once the 2-hour timer runs out, the system will automatically submit your answers.<br/>
	Any questions left unanswered at that time will remain blank.


                  </div>
                </li>
                <li>
                  <span className={styles.instructionNumber}>5</span>
                  <div>
                    <strong>Submission:</strong> You may submit the exam early if you finish before the time limit.<br/>
However, once you click “Submit”, you will not be able to return to the exam.

                  </div>
                </li>
              </ul>
              <div className={styles.instructionNote}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
                <p><strong>General Guidelines:</strong> 	Ensure a stable internet connection and do not close the browser during the exam.<br/>
	Use the on-screen tools (flag, mark for review, next/previous) to manage your time efficiently.

</p>
              </div>
            </div>
          </div>

          <div className={styles.examSection}>
            <div className={styles.examGrid}>
              {exams.map((exam, index) => (
                <div key={index} className={styles.card}>
                  <h3>{exam.title}</h3>
                  <p>Click to begin review</p>
                  <button
                    className={styles.beginBtn}
                    onClick={() => router.push('/part_exam')}
                    aria-label={`Begin review for ${exam.title}`}
                  >
                    Begin Review
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
