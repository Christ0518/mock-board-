"use client";
import { Fetch_to } from '../../../utilities';
import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import { useRouter } from 'next/navigation';
import api_link from "../../../config/api_links/links.json";

function QuizPage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [questionare, setQuestionare] = useState([]);
  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  const [data, setData] = useState({
    examinee_name: "", email: "", score: 0, assign_by: "", passing_score: 75, status: "", exam_title: "", parts: ""
  })

  useEffect(() => {
          async function check() {
              const response = await Fetch_to("/services/jwt/verify");
              if (!response.success) return router.push("/");
              const email = response.data.message.data[0].email;
              const assign_by = localStorage.getItem('assign_by') || '';
              const passing_score = localStorage.getItem('passing_score');
              const exam_title = localStorage.getItem('exam_title');
              const parts = localStorage.getItem('parts');
              
              setData(prev => ({
                ...prev,
                examinee_name: response.data.message.data[0].name,  
                email: email,
                assign_by: assign_by,
                exam_title: exam_title,
                parts: parts,
                passing_score: parseInt(passing_score)
              }));
          }
          check();
      }, []);

  const question = questionare[index];

  useEffect(() => {
  async function check() {
    const response = await Fetch_to("/services/jwt/verify");
    if (!response.success) return router.push("/");

    // 🚫 Prevent restart if exam already submitted
    if (localStorage.getItem('exam_submitted') === 'true') {
      alert('You have already completed this exam.');
      return router.push('/dashboard');
    }

    // 🔒 Lock exam as active
    if (!localStorage.getItem('exam_active')) {
      localStorage.setItem('exam_active', 'true');
    }

    const email = response.data.message.data[0].email;
    const assign_by = localStorage.getItem('assign_by') || '';
    const passing_score = localStorage.getItem('passing_score');
    const exam_title = localStorage.getItem('exam_title');
    const parts = localStorage.getItem('parts');

    setData(prev => ({
      ...prev,
      examinee_name: response.data.message.data[0].name,
      email,
      assign_by,
      exam_title,
      parts,
      passing_score: parseInt(passing_score)
    }));
  }

  check();
}, []);


  // Fetch questionnaire data
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const examId = localStorage.getItem('exam_id');
        if (!examId) {
          console.error('No exam ID found');
          return;
        }

        const response = await Fetch_to(api_link.user_data.questionare, { id: examId });
        
        console.log('Question fetch response:', response);
        
        if (response.success) {
          const rawData = response.data.message.data.data || [];
          
          // Transform the data to match UI structure
          const transformed = rawData.map(item => ({
            q: item.Question || '',
            choices: [item.A || '', item.B || '', item.C || '', item.D || ''],
            correctAnswer: item['Correct Answer'] || ''
          }));
          
          setQuestionare(transformed);
          setQuestionsLoaded(true); // Mark questions as loaded
          
        
        } else {
          const errorMsg = response.message || response.data?.error || response.error || 'Unknown error';
          console.error('Failed to fetch questions:', errorMsg);
          console.error('Full response object:', response);
          alert(`Failed to load exam questions.\n\nError: ${errorMsg}\n\nPlease ensure:\n1. The exam file is uploaded to storage\n2. The Python server is running (http://127.0.0.1:10000)\n3. The exam ID is valid`);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        alert(`An error occurred while loading the exam:\n\n${error.message}\n\nPlease check the console for more details.`);
      }
    };

    fetchQuestions();
  }, []);

  // Timer: persist end time so refresh keeps countdown - only start after questions are loaded
  useEffect(() => {
    if (!questionsLoaded) return; // Don't start timer until questions are loaded

    const timerKey = 'quiz_timer_end';
    
    let endTime = null;
    try {
      endTime = localStorage.getItem(timerKey);
    } catch (e) {
      endTime = null;
    }

    if (!endTime) {
      // Get assigned time in minutes from localStorage and convert to milliseconds
      const assignedTime = localStorage.getItem('assign_time');
      const duration = assignedTime ? parseInt(assignedTime) * 60 * 1000 : 60 * 60 * 1000; // Default 1 hour if not set
      
      const newEnd = Date.now() + duration;
      try { localStorage.setItem(timerKey, String(newEnd)); } catch (e) {}
      endTime = String(newEnd);
    }

    const endTs = Number(endTime);
    function update() {
      if (finished) return; // Stop timer if finished
      
      const remaining = endTs - Date.now();
      if (remaining <= 0) {
        setTimeLeft(0);
        setFinished(true);
        try { 
          localStorage.removeItem(timerKey);
        } catch (e) {}
        return;
      }
      setTimeLeft(remaining);
    }

    update();
    const intervalId = setInterval(update, 1000);
    return () => clearInterval(intervalId);
  }, [finished, questionsLoaded]);

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
    if (index < questionare.length - 1) setIndex(index + 1);
    else {
      setFinished(true);
      // Stop timer and clean up localStorage when quiz is finished
      try { 
        localStorage.removeItem('quiz_timer_end');
      } catch (e) {}
    }
  }

  function prev() {
    if (index > 0) setIndex(index - 1);
  }

  // Calculate score when finished
  useEffect(() => {
    if (finished && questionare.length > 0) {
      let correctCount = 0;
      questionare.forEach((q, i) => {
        if (answers[i] !== undefined) {
          const userAnswer = String.fromCharCode(97 + answers[i]).toUpperCase();
          if (userAnswer === q.correctAnswer) {
            correctCount++;
          }
        }
      });
      
      const calculatedPassingScore = Math.ceil(questionare.length * 0.75);
      const isPassed = correctCount >= calculatedPassingScore;
      
      setData(prev => ({
        ...prev,
        score: correctCount,
        passing_score: calculatedPassingScore,
        status: isPassed ? 'Passed' : 'Failed'
      }));
    }
  }, [finished, questionare, answers]);

  return (
    <div className={styles.quizContainer}>
      <h1 className={styles.quizTitle}>LLE — Library Organization & Management (Practice)</h1>
      <div className={styles.timer}>Time Remaining: {formatTime(timeLeft)}</div>
      {!finished ? (
        <div className={styles.card}>
          {question ? (
            <>
              <div className={styles.questionBlock}>
                <div className={styles.qNumber}>Question {index + 1} / {questionare.length}</div>
                <div className={styles.qText}>{question.q}</div>
              </div>
              <div className={styles.choices}>
                {question.choices?.map((c, i) => (
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
                <button onClick={next} className={styles.controlBtn}>{index < questionare.length - 1 ? 'Next' : 'Finish'}</button>
              </div>
            </>
          ) : (
            <div className={styles.questionBlock}>
              <p>Loading questions...</p>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.resultCard}>
          <h2>Review Completed</h2>
            {/** compute score and missed questions */}
            {(() => {
              const answeredCount = Object.keys(answers).length;
              const missedIndices = questionare
                .map((_, i) => i)
                .filter((i) => answers[i] === undefined);
              
              // Calculate correct answers
              let correctCount = 0;
              questionare.forEach((q, i) => {
                if (answers[i] !== undefined) {
                  const userAnswer = String.fromCharCode(97 + answers[i]).toUpperCase();
                  if (userAnswer === q.correctAnswer) {
                    correctCount++;
                  }
                }
              });
              
              // Calculate passing score dynamically based on total items
              // Passing score is 75% of total items, rounded up
              const calculatedPassingScore = Math.ceil(questionare.length * 0.75);
              
              
              return (
                <>
                 
                  <div style={{ fontSize: '1rem', marginBottom: '20px', color: '#666' }}>
                    Passing Score Required: {calculatedPassingScore} / {questionare.length}
                  </div>
                  <p>You answered {answeredCount} of {questionare.length} questions.</p>
                  <p style={{ marginTop: 6 }}>
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
            {questionare.map((q, i) => {
              const userAnswerIdx = answers[i];
              const userAnswer = userAnswerIdx !== undefined ? String.fromCharCode(97 + userAnswerIdx).toUpperCase() : null;
              
              return (
                <div key={i} className={styles.summaryItem}>
                  <div className={styles.summaryQ}>{i + 1}. {q.q}</div>
                  <div className={styles.summaryA}>
                    Your answer: {userAnswer !== null ? String.fromCharCode(97 + userAnswerIdx) + ". " + q.choices[userAnswerIdx] : 'No answer'}
                    
                  </div>
                </div>
              );
            })}
          </div>
          <div className={styles.controls}>
            <button onClick={() => { setIndex(0); setFinished(false); }} className={styles.controlBtn}>Review Answers</button>
            <button onClick={async() => { 
              try { 
                console.log('Submitting data:', data);
                const response = await Fetch_to(api_link.user_data.update_score, data);
                
                if (response.success) {
                  localStorage.removeItem('quiz_timer_end');
                  localStorage.removeItem('exam_id');
                  localStorage.removeItem('assign_by');
                  localStorage.removeItem('assign_time');
                  localStorage.removeItem('passing_score');
                  router.push('/dashboard');
                } else {
                  alert('Failed to submit score: ' + (response.message || 'Unknown error'));
                }
              } catch (e) {
                console.error('Submit error:', e);
                alert('Error submitting score');
              }
            }} className={styles.controlBtn}>Submit Final Score</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizPage;
