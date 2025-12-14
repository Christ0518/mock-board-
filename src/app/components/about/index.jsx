'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './css/styles.module.css';

export default function About({ email }) {
  const router = useRouter();
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [activeSection, setActiveSection] = useState('about');
  
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
    
    // Set active section to 'about' when component mounts
    setActiveSection('about');
  }, []);

  const menuItems = [
    { id: 'home', label: 'Home', dir: '/dashboard' },
    { id: 'about', label: 'About', dir: '/about' },
    { id: 'exam', label: 'Exam', dir: '/exam' },
  
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
                className={`${styles.navItem} ${activeSection === item.id ? styles.active : ''}`}
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

        {/* Main Content */}
        <main className={styles.mainContent}>
          {/* Header */}
          <header className={styles.header}>
            <div className={styles.logoContainer}>
              {/* Optional: Add page title or logo here */}
            </div>

            <div className={styles.userSection}>
              <div className={styles.userProfile}>
                <h3> {email ? email : " --- "} </h3>
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

          {/* ABOUT PAGE CONTENT */}
          <div className={styles.content}>
           

            <section className={styles.aboutSection}>
              <img src="/logo.png" alt="Librarian’s Hub" className={styles.logo} />
              <h1 className={styles.title}>LCCB Librarian’s Licensure Examination Preparation Portal</h1>
              <p className={styles.description}>
                The LCCB Librarian’s Licensure Examination Preparation Portal is an online platform designed to support aspiring librarians in preparing for the Licensure Examination. It provides access to study materials, practice tests, guidance, and resources aligned with professional standards to help students build the knowledge, skills, and confidence needed to succeed.
              </p>
            </section>

            <section className={styles.missionSection}>
              <h2 className={styles.sectionTitle}> Mission Statement</h2>
              <p className={styles.missionText}>
               The LCCB Bachelor of Library and Information Science program forms competent and ethical information professionals grounded in Catholic Augustinian core values. It equips students with the skills to manage, organize, and share information effectively, fostering lifelong learning and service to the community.


              </p>
            </section>

            <section className={styles.visionSection}>
              <h2 className={styles.sectionTitle}>Vision Statement</h2>
              <p className={styles.visionText}>
                The LCCB Bachelor of Library and Information Science program envisions producing exemplary information professionals who, guided by Catholic Augustinian core values, lead in the ethical management and dissemination of knowledge, promote lifelong learning, and serve the community with integrity and compassion.
              </p>
            </section>

            <section className={styles.valuesSection}>
              <h2 className={styles.sectionTitle}> LCCB Core Values</h2>
              <div className={styles.valuesGrid}>
                <div className={styles.valueCard}>
                  <h3>Christ-Centeredness</h3>
                  <p>We are to model Jesus Christ in all that we do. The Lordship of Christ should be evident in every aspect of our education, relationships and endeavour at LCCB.</p>
                </div>
                <div className={styles.valueCard}>
                  <h3>Excellence</h3>
                  <p>All of us, individually and collectively, takes pride in the quality of one’s work, insist on thoroughness and integrity in one’s work learns new information and skills to enhance personal and professional growth.</p>
                </div>
                <div className={styles.valueCard}>
                  <h3>Stewardship</h3>
                  <p>Our Creator blessed us with an abundance of resources. We foster a spirit of service to the college, and committed to being and responsible stewards of the College’s resources and the earth community.</p>
                </div>
                <div className={styles.valueCard}>
                  <h3>Community of Friends</h3>
                  <p>We foster a spirit of friendship, unity, and independence based on mutual trust and respect to create a social responsive environment that challenges all of us to listen, to learn and to serve.</p>
                </div>
                 <div className={styles.valueCard}>
                  <h3>Diversity</h3>
                  <p>We are diverse community, but also one, united by a shared commitment to cultural diversity, mutual respect among all persons, and compassion for others, honest and open communication, integrity in all that we do. </p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
  );
}
