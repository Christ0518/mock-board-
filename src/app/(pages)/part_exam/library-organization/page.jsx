"use client";

import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import { useRouter } from 'next/navigation';

const questions = [
  {
    q: "This is the proper order of the management process.",
    choices: [
      "Leading, Controlling, Organizing, Staffing, Planning",
      "Planning, Organizing, Staffing, Leading, Controlling",
      "Organizing, Staffing, Planning, Leading, Controlling",
      "Planning, Leading, Organizing, Staffing, Controlling",
    ],
  },
  {
    q: "The library can be considered an open system because it",
    choices: [
      "It is concerned with budgeting and resource management",
      "It influences and influenced by its external environment",
      "It uses mathematical and statistical models",
      "Its focus is on customer satisfaction",
    ],
  },
  {
    q: "______________________________ is about utilizing organizational resources to achieve the set of objectives.",
    choices: ["Leading", "Controlling", "Managing", "Organizing"],
  },
  {
    q: "He is referred to as the Father of the Social Systems Approach to organization and management.",
    choices: ["Henri Fayol", "Frederick W. Taylor", "Peter Drucker", "Vilfredo Pareto"],
  },
  {
    q: "The managerial function involves selecting missions and objectives as well as the actions to achieve them.",
    choices: ["Organizing", "Budgeting", "Planning", "Staffing"],
  },
  {
    q: "They are considered plans because they are general statements or understandings that guide or channel thinking in decision-making.",
    choices: ["Procedures", "Guidelines", "Policies", "Rules"],
  },
  {
    q: "These are the ends toward which the activity is aimed.",
    choices: ["Mission", "Vision", "Objectives", "Result"],
  },
  {
    q: "A motivation theory that focuses on the hierarchy of needs was proposed by",
    choices: ["Henri Fayol", "Abraham Maslow", "Nathaniel Hawthorne", "Lilian Gilbreth"],
  },
  {
    q: "The law on the Code of Ethics for Registered Librarians",
    choices: [
      "Res. No. 2, S. 1992 of the PRC-BFL",
      "Res. No. 1, S. 1992 of the PRC-BFL",
      "Res. No. 5, S. 1992 of the PRC-BFL",
      "Res. No. 7, S. 1999",
    ],
  },
  {
    q: "The right of any person to read and express views that may be unpopular or offensive to some people, within certain limitations (libel, slander, etc).",
    choices: ["intellectual property", "intellectual freedom", "copyright piracy", "copyright holder"],
  },
  {
    q: "A type of library established, supported, and administered by a business firm, private corporation, association, government agency, or other special interest group or agency to meet the information needs of its members or staff in pursuance of the goals of the organization.",
    choices: ["Special Library", "Public Library", "Academic Library", "School Library"],
  },
  {
    q: "The current chairperson of the Board for Librarians.",
    choices: ["Corazon M. Nera", "Yolanda C. Granda", "Lourdes T. David", "None of the above"],
  },
  {
    q: "A management technique that involves analysis of the strengths, weaknesses, opportunities, and threats to the organization.",
    choices: ["Management by Objectives (MBO)", "Strategic Management", "Total Quality Management", "None of the above"],
  },
  {
    q: "According to PRC, at least how many (in terms of percentage) should an examinee receive per subject to pass the Librarian’s Licensure Examination?",
    choices: ["70%", "75%", "50%", "None of the above"],
  },
  {
    q: "Performance appraisal involves",
    choices: ["Selection and hiring of new staff", "Evaluation of employee’s strengths and weaknesses in his job", "Planning the career path of an employee", "None of the above"],
  },
  {
    q: "Theory X and Theory Y are management theories attributed to",
    choices: ["Douglas McGregor", "Henri Fayol", "Abraham Maslow", "Mary Parker Follet"],
  },
  {
    q: "During this period, the apprenticeship method is replaced with the factory system in production.",
    choices: ["Agricultural period", "Modern period", "Industrial period", "Post-production period"],
  },
  {
    q: "A group or individual creativity technique by which efforts are made to find a conclusion to a specific problem by gathering a list of ideas spontaneously contributed by its members.",
    choices: ["Meeting", "Consultation", "Brainstorming", "Delegation"],
  },
  {
    q: "The accredited Professional Organization (APO) of the PRB for Librarians.",
    choices: [
      "Philippine Association of Academic and Research Librarians (PAARL)",
      "Association of Special Libraries in the Philippines (ASLP)",
      "Philippine Librarians Association, Inc. (PLAI)",
      "Public Librarians Association of the Philippines (PLAP)",
    ],
  },
  {
    q: "The current President of PLAI.",
    choices: ["Elisa V. Garcia", "Elizabeth R. Peralejo", "Elvira B. Lapuz", "Emma M. Rey"],
  },
  {
    q: "The first licensure examination was held in Manila on",
    choices: [
      "December 3 and 4, 1992",
      "December 3 and 4, 1990",
      "December 3 and 4, 1991",
      "December 3 and 4, 1993",
    ],
  },
  {
    q: "The committee for libraries under the NCCA",
    choices: [
      "NCCA-Committee on Archives",
      "NCCA-Committee on Library and Information Services",
      "NCCA-Committee on Art Galleries",
      "NCCA-Committee on Museums",
    ],
  },
  {
    q: "A bureaucracy can be best characterized by having",
    choices: ["Vertical flow of communication", "Formal structure", "Division of labor", "All of the above"],
  },
  {
    q: "Arranging jobs in hierarchical order, defining position titles and qualification requirements.",
    choices: ["Job classification", "Job analysis", "Performance evaluation", "Job audit"],
  },
  {
    q: "He theorized that two factors motivate employees: motivation and maintenance factors.",
    choices: ["Mary Parker Follet", "Frederick Herzberg", "Adam Smith", "Self-actualization"],
  },
  {
    q: "A set of standards governing the conduct and judgment of librarians, library, and staff, and other information professionals in their work.",
    choices: ["Information studies", "Copyright law", "Code of Ethics", "Intellectual responsibility"],
  },
  {
    q: "The government agency that issues ISBN",
    choices: ["National Printing Office", "The National Library", "The National Archives", "The Library of Congress"],
  },
  {
    q: "A diagram that shows the structure of an organization and the relationships and relative ranks of its parts and positions/jobs.",
    choices: ["Map", "Almanac", "Organizational chart", "Organizational plan"],
  },
  {
    q: "The first school library in the Philippines.",
    choices: ["Philippine Normal University (PNU)", "University of the Philippines (UP)", "Polytechnic University of the Philippines", "University of the East (UE)"],
  },
  {
    q: "Planning ______________ is the environment in which plans are expected to operate",
    choices: ["Forecasts", "Review", "Premise", "Missions and purposes"],
  },
  {
    q: "The first school library established in the Philippines.",
    choices: ["V. Mapa High School", "Jose Rizal High School", "Torres High School", "Pampanga High School"],
  },
  {
    q: "A _____________________ is any library which provides general library services free of charge to all residents of a given community receiving its financial from public funds.",
    choices: ["Academic library", "Public library", "School library", "Special library"],
  },
  {
    q: "Proclamation No. 837 of Pres. Corazon C. Aquino is popularly known as",
    choices: ["Library and Information Services Month", "Library Month", "National Book Week", "National Children’s Day"],
  },
  {
    q: "The law that created the PRC",
    choices: ["PD 49", "RA 9246", "PD 223", "None of the above"],
  },
  {
    q: "The acronym PRC stands for",
    choices: [
      "Philippine Regulation Commission",
      "Professional Regulation Commission",
      "Philippine Racing Commission",
      "Philippine Railways Commission",
    ],
  },
  {
    q: "The following statements best describe “control” except",
    choices: [
      "The measurement and correction of performance to make sure that the objectives and the plans devised to attain them are being accomplished.",
      "It implies the existence of goals and plans and the regulations of the organization’s activities toward those goals",
      "It is concerned with keeping things on track and successful progress toward meeting specified objectives",
      "All of the above",
    ],
  },
  {
    q: " Which statement below shows the relatedness of sports to coaching?",
    choices: [
      "The sports team wants to win games while the work team wants to satisfy customers.",
      "The coach sets challenging expectations for the teams while the supervisor plays the role of a coach for bringing out the best in employees.",
      "Workers are more highly motivated to participate in sports than they are in their jobs.",
      "All of the above",
    ],
  },
  {
    q: "Below are statements that show a balance of the needs of diverse patron groups while maintaining fair policies except for one",
    choices: ["Promote Diversity and Inclusion", "Customize Services and Programs", "Provide Accessibility Services", "Speedy organization of library materials"],
  },
  {
    q: "One of the promotional activities of the library is the author’s book signing. How do you organize it?",
    choices: ["Social media", "Confirm Author Availability", "Flyers and posters", "All of the above"],
  },
  {
    q: "One of the salient responsibilities of a library manager is to evaluate the success of a library program. How would she do it? ",
    choices: ["Collect feedback from participants through surveys, comment cards, or verbal feedback.", "Review the budget and resources allocated to the program compared to the outcomes achieved.", "Evaluate the level of cooperation, contribution, and mutual benefit achieved.", "All of the above"],
  },
  {
    q: "The library closes at 7 PM, however, there are still students inside who refuse to leave because they are not yet done with their research. How would you handle them? ",
    choices: ["Instruct the patron that the library is closing soon and that it's time to wrap up their activities and prepare to leave.", "Offer assistance to the patron to help them finish any tasks they were working. ", "Give the patron a few gentle reminders as closing time approaches, indicating when the library will be closing and when they need to leave.", "Inform the security guard and have him instruct the students to leave the library premises."],
  },
  {
    q: "If you catch one patron stealing library materials how would you call his attention?",
    choices: ["Approach the patron calmly and respectfully in a private area away from other patrons. Avoid accusing them directly, as it may escalate the situation.", "Document the incident, including the details of the suspicion, the conversation with the patron, and any actions taken by library staff or security, for reference and follow-up if needed.", "Refer patron to the Discipline Office for processing", "A & B"],
  },
  {
    q: "A faculty is requesting to see the library file of a colleague if you were the facilitating librarian. How would you respond to a request for confidential patron information from law enforcement?",
    choices: ["Ask the law enforcement officer for official identification and documentation of the request, including a subpoena or court order if applicable.", "Consult the library's policies and procedures regarding the release of patron information", "Take steps to protect the privacy and confidentiality of patron records to the greatest extent possible, consistent with applicable laws and regulations.", "All of the above"],
  },
  {
    q: "You were roaming around the library when you saw a patron sleeping in the library. What do you do?",
    choices: ["Approach the patron quietly and assess their condition.", "Gently wake up the patron if they are sleeping and inform them that sleeping in the library is not allowed", "Politely remind the patron of the library's rules and policies regarding behavior, e.g. against sleeping, loitering, or disruptive behavior.", "All of the above"],
  },
  {
    q: "How would you respond to a patron using offensive language?",
    choices: ["Remain calm and composed when addressing the situation.", "Communicate the library's rules and policies regarding appropriate behavior, including prohibitions against offensive language, harassment, or disruptive behavior.", "Keep an eye on the patron's behavior to ensure compliance with library policies. If the offensive language continues or escalates, consider taking further action.", "All of the above"],
  },
  {
    q: "Below are a library manager’s approaches to evaluating her or his team’s performance evaluation except for one",
    choices: ["Set clear and SMART expectations", "Schedule formal performance evaluation meetings with each staff member at regular intervals. ", "Encourage staff members to conduct self-assessments of their performance, reflecting on their accomplishments, challenges, and areas for development.", "Disregard team performance evaluation instead focus on individual evaluation "],
  },
  {
    q: "To stay updated on trends and changes in the library profession the following are the best ways to employ ",
    choices: ["Joining professional associations and organizations related to librarianship", "Participating in continuing education opportunities", "Reading professional literature", "All of the above"],
  },
  {
    q: "You have observed that your technical librarian has a new method for cataloging library materials. How do you evaluate it?",
    choices: ["Take the time to fully understand the new cataloging method proposed by your colleague.", "Evaluate how well the proposed cataloging method aligns with the goals, priorities, and strategic direction of the library.", "Continuously gather feedback from library staff and stakeholders during and after the implementation of the new cataloging method.", "All of the above"],
  },
  {
    q: "As a library manager, how do you address a situation where you suspect a staff member of unethical behavior?",
    choices: ["Gather relevant evidence or information ", "Listen attentively to the staff member's response and give them an opportunity to explain their actions or clarify any misunderstandings. ", "A & B", "None of the above"],
  },
  {
    q: "One of the important roles of the library is to ensure compliance with copyright laws. How does the library manager implement it?",
    choices: ["Provide comprehensive training and education to library staff and users about copyright laws, fair use guidelines, and the library's copyright policies and procedures.", "Offer access to legal resources and tools that facilitate compliance with copyright laws", "Collaborate with legal experts, copyright specialists, and professional organizations to seek guidance and advice on complex copyright issues or legal questions.", "All of the above"],
  },
 
];

function QuizPage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 60 * 1000);

  const question = questions[index];

  // Timer: persist end time so refresh keeps countdown
  useEffect(() => {
    const key = 'lle_quiz_end';
    
    let end = null;
    try {
      end = localStorage.getItem(key);
    } catch (e) {
      end = null;
    }

    if (!end) {
      const newEnd = Date.now() + 60 * 60 * 1000; // 1 hour
      try { localStorage.setItem(key, String(newEnd)); } catch (e) {}
      end = String(newEnd);
    }

    const endTs = Number(end);
    function update() {
      if (finished) return; // Stop timer if finished
      
      const remaining = endTs - Date.now();
      if (remaining <= 0) {
        setTimeLeft(0);
        setFinished(true);
        try { 
          localStorage.removeItem(key);
        } catch (e) {}
        return;
      }
      setTimeLeft(remaining);
    }

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [finished]);

  function formatTime(ms) {
    if (!ms || ms <= 0) return '00:00:00';
    const total = Math.floor(ms / 1000);
    const hrs = Math.floor(total / 3600);
    const mins = Math.floor((total % 3600) / 60);
    const secs = total % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function select(choiceIdx) {
    setAnswers((prev) => ({ ...prev, [index]: choiceIdx }));
  }

  function next() {
    if (index < questions.length - 1) setIndex(index + 1);
    else {
      setFinished(true);
      // Stop timer and clean up localStorage when quiz is finished
      try { 
        localStorage.removeItem('lle_quiz_end');
      } catch (e) {}
    }
  }

  function prev() {
    if (index > 0) setIndex(index - 1);
  }

  return (
    <div className={styles.quizContainer}>
      <h1 className={styles.quizTitle}>LLE — Library Organization & Management (Practice)</h1>
      <div className={styles.timer}>Time Remaining: {formatTime(timeLeft)}</div>
      {!finished ? (
        <div className={styles.card}>
          <div className={styles.questionBlock}>
            <div className={styles.qNumber}>Question {index + 1} / {questions.length}</div>
            <div className={styles.qText}>{question.q}</div>
          </div>
          <div className={styles.choices}>
            {question.choices.map((c, i) => (
              <label key={i} className={styles.choice}>
                <input
                  type="radio"
                  name={`q-${index}`}
                  checked={answers[index] === i}
                  onChange={() => select(i)}
                />
                <span>{String.fromCharCode(97 + i)}. {c}</span>
              </label>
            ))}
          </div>
          <div className={styles.controls}>
            <button onClick={prev} disabled={index === 0} className={styles.controlBtn}>Previous</button>
            <button onClick={next} className={styles.controlBtn}>{index < questions.length - 1 ? 'Next' : 'Finish'}</button>
          </div>
        </div>
      ) : (
        <div className={styles.resultCard}>
          <h2>Review Completed</h2>
            {/** compute missed questions */}
            {(() => {
              const answeredCount = Object.keys(answers).length;
              const missedIndices = questions
                .map((_, i) => i)
                .filter((i) => answers[i] === undefined);
              return (
                <>
                  <p>You answered {answeredCount} of {questions.length} questions.</p>
                  <p style={{ marginTop: 6 }}>
                    Missed: <strong>{missedIndices.length}</strong>
                    {missedIndices.length > 0 && (
                      <span style={{ marginLeft: 8 }}>
                        (Questions: {missedIndices.map((n) => n + 1).join(', ')})
                      </span>
                    )}
                  </p>
                </>
              );
            })()}
          <div className={styles.summary}>
            {questions.map((q, i) => (
              <div key={i} className={styles.summaryItem}>
                <div className={styles.summaryQ}>{i + 1}. {q.q}</div>
                <div className={styles.summaryA}>Your answer: {answers[i] !== undefined ? String.fromCharCode(97 + answers[i]) + ". " + q.choices[answers[i]] : 'No answer'}</div>
              </div>
            ))}
          </div>
          <div className={styles.controls}>
            <button onClick={() => { setIndex(0); setFinished(false); }} className={styles.controlBtn}>Review Answers</button>
            <button onClick={() => { 
              try { 
                localStorage.removeItem('lle_quiz_end');
              } catch (e) {}
              router.push('/exam'); 
            }} className={styles.controlBtn}>Back to Exams</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizPage;
