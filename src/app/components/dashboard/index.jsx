'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './css/styles.module.css';

export default function Dashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [activeSection, setActiveSection] = useState('home');

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

    // Set active section based on current path
    const path = window.location.pathname;
    const currentSection = menuItems.find(item => item.dir === path)?.id || 'home';
    setActiveSection(currentSection);
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
                  if (item.dir === '/about') {
                    console.log('Navigating to About page');
                  }
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
    {/* You can add your logo here if needed */}
  </div>

  <div className={styles.userSection}>
    

    <div className={styles.userProfile}>
      <Image
        src="/user.jpg"
        alt="User avatar"
        width={50}
        height={50}
        className={styles.avatar}
      />
      <div className={styles.userInfo}>
        <span className={styles.userName}>{userData.name}</span>
      </div>
    </div>

    {/* Logout button moved outside userProfile */}
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

          {/* Dashboard Content */}
          <div className={styles.content}>
            {/* Stats Cards */}
            <div className={styles.statsGrid}>
              <div className={styles.statsCard}>
                <h3>Mock Exams Completed</h3>
                <p className={styles.statNumber}>12</p>
              </div>
              <div className={styles.statsCard}>
                <h3>Average Score</h3>
                <p className={styles.statNumber}>85%</p>
              </div>
              <div className={styles.statsCard}>
                <h3>Study Hours</h3>
                <p className={styles.statNumber}>48</p>
              </div>
              <div className={styles.statsCard}>
                <h3>Days Until Exam</h3>
                <p className={styles.statNumber}>30</p>
              </div>
            </div>

            <div className={styles.content}>
 

  <div className={styles.reviewerHubWrapper}>
    <div className={styles.reviewerHub}>
      <h2>Your Ultimate Reviewer Hub</h2>
      <p>Where Future Librarians Turn Preparation into Success.</p>
      <button 
        className={styles.startBtn}
        onClick={() => router.push('/exam')}
      >
        Start Reviewing Now
      </button>
    </div>
  </div>
</div>




          </div>
        </main>
      </div>
  );

}
