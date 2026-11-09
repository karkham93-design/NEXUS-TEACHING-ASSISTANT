/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  MessageSquare,
  Image as ImageIcon,
  Globe,
  Briefcase,
  CheckCircle2,
  Award,
  Flame,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  FileCheck,
  LogOut,
  UserCheck,
  Sun,
  Moon,
} from 'lucide-react';
import {
  signInWithGoogle,
  logoutUser,
  initAuthListener,
  db,
  handleFirestoreError,
  OperationType,
} from './lib/firebase';
import { User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { CURRICULUM_LESSONS, Lesson } from './data/curriculum';
import {
  calculateLearningProgress,
  evaluateQuizAnswers,
  ProgressSummary,
} from './utils/learning';
import { ConceptSimulator } from './components/Simulators';
import { AudioTutor } from './components/AudioTutor';
import { ChatBot } from './components/ChatBot';
import { DiagramGenerator } from './components/DiagramGenerator';
import { WorldPulse } from './components/WorldPulse';
import { WorkspaceHub } from './components/WorkspaceHub';
import { Antigravity } from './components/Antigravity';
import Lightfall from './components/Lightfall';
import Threads from './components/Threads';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nexus_theme') || localStorage.getItem('viva_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'dark';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexus_theme', theme);
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
      }
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [activeTab, setActiveTab] = useState<
    'lessons' | 'chat' | 'diagrams' | 'pulse' | 'workspace'
  >('lessons');

  // Filter level: 'All' | 'Primary (PLE)' | 'Secondary (UCE)' | 'UNEB Guidelines'
  const [levelFilter, setLevelFilter] = useState<string>('All');

  // Selected Lesson
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(CURRICULUM_LESSONS[0]);

  // Student Stats & Progress (Saved to LocalStorage for Guests + Firestore for Signed In)
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nexus_completed_lessons');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [points, setPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('nexus_student_points');
      return saved ? Number(saved) : 140;
    } catch {
      return 140;
    }
  });

  const [streak, setStreak] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('nexus_student_streak');
      return saved ? Number(saved) : 4;
    } catch {
      return 4;
    }
  });

  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = useState<{
    score: number;
    percentage: number;
    isPassed: boolean;
    pointsAwarded: number;
  } | null>(null);

  // Sync to LocalStorage for Guest Scholar persistence
  useEffect(() => {
    try {
      localStorage.setItem('nexus_student_points', String(points));
      localStorage.setItem('nexus_student_streak', String(streak));
      localStorage.setItem('nexus_completed_lessons', JSON.stringify(completedLessonIds));
    } catch (e) {
      console.warn('LocalStorage write notice:', e);
    }
  }, [points, streak, completedLessonIds]);

  // Auth listener
  useEffect(() => {
    const unsubscribe = initAuthListener((user, token) => {
      setCurrentUser(user);
      setAccessToken(token);
      if (user) {
        loadUserProfile(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadUserProfile = async (uid: string) => {
    try {
      const userRef = doc(db, 'users', uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        if (data.points !== undefined && data.points > points) setPoints(data.points);
        if (data.streak !== undefined) setStreak(data.streak);
      } else {
        // Initialize profile in Firestore
        await setDoc(userRef, {
          email: currentUser?.email || '',
          displayName: currentUser?.displayName || 'UNEB Candidate',
          level: 'UCE Candidate (S.3 - S.4)',
          points,
          streak,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `users/${uid}`);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithGoogle();
      if (res) {
        setCurrentUser(res.user);
        setAccessToken(res.accessToken);
        await loadUserProfile(res.user.uid);
      }
    } catch (e) {
      console.error('Login error:', e);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setAccessToken(null);
  };

  // Submit Quiz
  const handleSubmitQuiz = async () => {
    const result = evaluateQuizAnswers(selectedLesson.quiz, quizAnswers);
    setQuizResult(result);

    if (result.isPassed) {
      if (!completedLessonIds.includes(selectedLesson.id)) {
        const nextCompleted = [...completedLessonIds, selectedLesson.id];
        setCompletedLessonIds(nextCompleted);
        const nextPoints = points + result.pointsAwarded;
        setPoints(nextPoints);

        // Persist to Firestore if signed in
        if (currentUser) {
          try {
            const userRef = doc(db, 'users', currentUser.uid);
            await setDoc(
              userRef,
              {
                points: nextPoints,
                updatedAt: new Date().toISOString(),
              },
              { merge: true }
            );

            const lessonDocRef = doc(db, 'users', currentUser.uid, 'lessons', selectedLesson.id);
            await setDoc(lessonDocRef, {
              lessonId: selectedLesson.id,
              title: selectedLesson.title,
              completed: true,
              score: result.percentage,
              lastAccessed: new Date().toISOString(),
            });
          } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, `users/${currentUser.uid}/lessons/${selectedLesson.id}`);
          }
        }
      }
    }
  };

  const filteredLessons = levelFilter === 'All'
    ? CURRICULUM_LESSONS
    : CURRICULUM_LESSONS.filter((l) => l.level === levelFilter);

  const progressSummary: ProgressSummary = calculateLearningProgress(
    CURRICULUM_LESSONS.length,
    completedLessonIds.length,
    points
  );

  return (
    <div className={`relative min-h-screen flex flex-col font-sans selection:bg-red-600 selection:text-white overflow-x-hidden transition-colors duration-200 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Interactive WebGL2 Threads Background (React Bits) matching UNEB palette */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <Threads
          color={theme === 'dark' ? '#06B6D4' : '#0891B2'}
          accentColor={theme === 'dark' ? '#EF4444' : '#b91c1c'}
          lineCount={90}
          thickness={0.7}
          softness={1.2}
          amplitude={1.6}
          distance={0.35}
          waves={1.1}
          speed={0.45}
          split={0.04}
          fray={0.45}
          angle={28}
          taper={0.85}
          brightness={theme === 'dark' ? 1.35 : 0.85}
          parting={0.3}
          enableMouseInteraction={true}
          fade={0.15}
          opacity={theme === 'dark' ? 0.75 : 0.28}
        />
      </div>

      {/* Main App Container positioned above background field */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className={`border-b backdrop-blur-md sticky top-0 z-40 transition-colors ${
          theme === 'dark' ? 'border-slate-800/80 bg-slate-950/80' : 'border-slate-200 bg-white/90 shadow-sm'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            {/* Logo & Identity */}
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/image_2c59f5bc.png"
                alt="NEXUS"
                className="w-11 h-11 object-contain drop-shadow-md hover:scale-105 transition-transform rounded-lg"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl tracking-wider text-cyan-400 drop-shadow-sm font-mono">
                    NEXUS
                  </span>
                  <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-600/60 font-semibold px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
                    AI Teaching Assistant
                  </span>
                  <a
                    href="https://uneb.ac.ug/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden md:flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
                  >
                    <span>uneb.ac.ug</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  Uganda National Examinations Board (UNEB) Curriculum &amp; Examiner Intelligence
                </p>
              </div>
            </div>

            {/* Gamified Candidate Stats, Theme Toggle & Auth */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Dark / Light Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-700 bg-slate-900/80 text-slate-200 hover:text-white hover:bg-slate-800"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle dark/light theme"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span className="hidden sm:inline">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-indigo-500" />
                    <span className="hidden sm:inline">Dark</span>
                  </>
                )}
              </button>

              <div className="hidden sm:flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg text-xs backdrop-blur-sm">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold" title="Revision Points">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>{points} pts</span>
                </div>
                <div className="w-px h-3.5 bg-slate-800" />
                <div className="flex items-center gap-1.5 text-rose-400 font-semibold" title="Study Streak">
                  <Flame className="w-4 h-4 text-rose-400" />
                  <span>{streak}d streak</span>
                </div>
                <div className="w-px h-3.5 bg-slate-800" />
                <span className="text-emerald-300 font-medium">{progressSummary.currentLevel}</span>
              </div>

              {/* Guest / Google Account Status */}
              {currentUser ? (
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-red-400/40">
                    {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                  </div>
                  <div className="hidden md:block text-left text-xs">
                    <div className="font-semibold text-white leading-tight">{currentUser.displayName}</div>
                    <div className="text-[10px] text-slate-400 leading-tight truncate max-w-[120px]">{currentUser.email}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg text-xs"
                    title="Switch to Guest Candidate"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 px-2.5 py-1 rounded-lg text-[11px] font-medium">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Guest Candidate</span>
                  </div>
                  <button
                    onClick={handleGoogleLogin}
                    className="bg-white hover:bg-slate-100 text-slate-900 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shadow-md active:scale-95"
                    title="Connect Google Account to sync notes to Google Drive, Calendar, and Tasks"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                    <span>Google Sync</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto border-t border-slate-800/50 py-1.5">
            {[
              { id: 'lessons', label: 'UNEB Syllabi & Labs', icon: BookOpen },
              { id: 'chat', label: 'NEXUS Examiner Chat', icon: MessageSquare },
              { id: 'diagrams', label: '1K/2K/4K Textbook Diagrams', icon: ImageIcon },
              { id: 'pulse', label: 'UNEB News & Exam Centers', icon: Globe },
              { id: 'workspace', label: 'Google Workspace Hub', icon: Briefcase },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
          {/* Tab 1: UNEB Curriculum, Simulators & Quizzes */}
          {activeTab === 'lessons' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Filter & Syllabi Modules */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-4 shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-white text-xs uppercase tracking-wider text-slate-300">
                      UNEB Examination Modules
                    </h3>
                    <span className="text-xs text-red-400 font-mono font-bold">
                      {progressSummary.completionPercentage}% Mastered
                    </span>
                  </div>

                  {/* Level Filter Tabs */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {['All', 'Primary (PLE)', 'Secondary (UCE)', 'UNEB Guidelines'].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setLevelFilter(lvl)}
                        className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-colors ${
                          levelFilter === lvl
                            ? 'bg-red-600 text-white font-semibold'
                            : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {lvl === 'All' ? 'All' : lvl.split(' ')[0]}
                      </button>
                    ))}
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mb-4 border border-slate-800">
                    <div
                      className="bg-red-500 h-full rounded-full transition-all duration-500 shadow-sm shadow-red-500/50"
                      style={{ width: `${progressSummary.completionPercentage}%` }}
                    />
                  </div>

                  <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                    {filteredLessons.map((lesson) => {
                      const isSelected = selectedLesson.id === lesson.id;
                      const isCompleted = completedLessonIds.includes(lesson.id);
                      return (
                        <div
                          key={lesson.id}
                          onClick={() => {
                            setSelectedLesson(lesson);
                            setQuizAnswers({});
                            setQuizResult(null);
                          }}
                          className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-red-950/50 border-red-500/80 shadow-md ring-1 ring-red-500/30'
                              : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-mono text-red-400 font-semibold uppercase">
                              {lesson.level} • {lesson.subject}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                                  lesson.difficulty === 'Distinction Target'
                                    ? 'bg-rose-950 text-rose-300'
                                    : 'bg-indigo-950 text-indigo-300'
                                }`}
                              >
                                {lesson.difficulty}
                              </span>
                              {isCompleted && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              )}
                            </div>
                          </div>
                          <h4 className="text-xs font-semibold text-white mb-1 leading-snug">
                            {lesson.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 line-clamp-2">
                            {lesson.shortDesc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Selected Module Details & Interactive Labs */}
              <div className="lg:col-span-8 space-y-5">
                {/* Header Overview */}
                <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-5 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-red-950 text-red-300 border border-red-600/60 font-semibold px-2 py-0.5 rounded">
                        {selectedLesson.level}
                      </span>
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-xs text-cyan-300 font-medium">
                        {selectedLesson.subject}
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveTab('chat')}
                      className="text-xs text-red-300 hover:text-white flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-md transition-colors"
                    >
                      <span>Ask Examiner in Chat</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h2 className="text-lg font-bold text-white mb-2">{selectedLesson.title}</h2>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {selectedLesson.conceptSummary}
                  </p>

                  <div className="text-[11px] font-mono text-cyan-400 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 mb-4 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span>{selectedLesson.unebReference}</span>
                  </div>

                  {/* Gemini 3.8 TTS Audio Explanation */}
                  <AudioTutor
                    currentText={`${selectedLesson.title} for ${selectedLesson.level} ${selectedLesson.subject}. ${selectedLesson.conceptSummary} ${selectedLesson.audioNarration}`}
                    onTranscriptionComplete={() => setActiveTab('chat')}
                  />
                </div>

                {/* Subject Interactive Lab Simulator */}
                <ConceptSimulator type={selectedLesson.simulatorType} />

                {/* Key Exam Rules & Revision Invariants */}
                <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-5 shadow-xl">
                  <h3 className="font-semibold text-white text-xs mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>UNEB High-Scoring Invariants &amp; Marking Guide Criteria</span>
                  </h3>
                  <ul className="space-y-2 mb-4">
                    {selectedLesson.keyExamPoints.map((point, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-red-400 font-bold">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="p-3 bg-red-950/30 border border-red-600/40 rounded-lg text-xs text-red-200">
                    <strong>Examiner's Distinction Note: </strong>
                    {selectedLesson.deepDive}
                  </div>
                </div>

                {/* Authentic UNEB Quiz Challenge */}
                <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-5 shadow-xl">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-red-400" />
                      <h3 className="font-semibold text-white text-xs">
                        UNEB Past-Paper Revision Challenge ({selectedLesson.subject})
                      </h3>
                    </div>
                    <span className="text-xs text-slate-400">+70 Revision Points on Pass</span>
                  </div>

                  <div className="space-y-4">
                    {selectedLesson.quiz.map((q, idx) => (
                      <div key={q.id} className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                        <p className="text-xs font-semibold text-white mb-2.5">
                          {idx + 1}. {q.question}
                        </p>
                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => (
                            <label
                              key={optIdx}
                              className={`flex items-start gap-2.5 p-2 rounded-md border cursor-pointer text-xs transition-colors ${
                                quizAnswers[q.id] === optIdx
                                  ? 'bg-red-950/60 border-red-500 text-white'
                                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/50'
                              }`}
                            >
                              <input
                                type="radio"
                                name={q.id}
                                checked={quizAnswers[q.id] === optIdx}
                                onChange={() => setQuizAnswers({ ...quizAnswers, [q.id]: optIdx })}
                                className="mt-0.5 accent-red-500"
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>

                        {quizResult && (
                          <div className="mt-3 text-[11px] p-2 rounded bg-slate-900 border border-slate-800 font-mono text-slate-300">
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={handleSubmitQuiz}
                        disabled={Object.keys(quizAnswers).length < selectedLesson.quiz.length}
                        className="px-5 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white text-xs font-semibold rounded-lg shadow-md shadow-red-600/30 transition-all active:scale-95"
                      >
                        Submit UNEB Marking Evaluation
                      </button>

                      {quizResult && (
                        <div
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-2 ${
                            quizResult.isPassed
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
                              : 'bg-rose-950/80 text-rose-300 border border-rose-700/60'
                          }`}
                        >
                          {quizResult.isPassed ? <CheckCircle2 className="w-4 h-4" /> : null}
                          <span>
                            Score: {quizResult.percentage}% •{' '}
                            {quizResult.isPassed
                              ? `Distinction! Awarded +${quizResult.pointsAwarded} pts`
                              : 'Pass requires 60% credit standard'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: NEXUS Examiner Chat with Fast Response */}
          {activeTab === 'chat' && (
            <div className="max-w-4xl mx-auto">
              <ChatBot
                currentConceptContext={`${selectedLesson.level} ${selectedLesson.subject}: ${selectedLesson.title} - ${selectedLesson.conceptSummary}`}
                isGuest={!currentUser}
                onNavigateSection={(tab) => setActiveTab(tab as any)}
              />
            </div>
          )}

          {/* Tab 3: Visual Textbook Diagram Studio */}
          {activeTab === 'diagrams' && (
            <div className="max-w-4xl mx-auto">
              <DiagramGenerator currentConceptTitle={`${selectedLesson.subject}: ${selectedLesson.title}`} />
            </div>
          )}

          {/* Tab 4: UNEB Portal, News & Exam Centers */}
          {activeTab === 'pulse' && (
            <div className="max-w-4xl mx-auto">
              <WorldPulse />
            </div>
          )}

          {/* Tab 5: Google Workspace Integration */}
          {activeTab === 'workspace' && (
            <div className="max-w-4xl mx-auto">
              <WorkspaceHub
                accessToken={accessToken}
                userEmail={currentUser?.email}
                currentLessonTitle={`${selectedLesson.level} - ${selectedLesson.title}`}
                currentLessonNotes={`UNEB Revision Notes (${selectedLesson.level} - ${selectedLesson.subject})\nTitle: ${selectedLesson.title}\n\nConcept Summary:\n${selectedLesson.conceptSummary}\n\nKey Marking Points:\n${selectedLesson.keyExamPoints.join('\n')}\n\nOfficial Reference: ${selectedLesson.unebReference}`}
              />
            </div>
          )}
        </main>

        {/* Footer with UNEB reference */}
        <footer className={`border-t backdrop-blur-md py-4 mt-8 text-center text-xs transition-colors ${
          theme === 'dark' ? 'border-slate-800/60 bg-slate-950/80 text-slate-500' : 'border-slate-200 bg-white/90 text-slate-600 shadow-inner'
        }`}>
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <img
                src="/assets/aistudio/image_2c59f5bc.png"
                alt="NEXUS"
                className="w-6 h-6 object-contain rounded"
              />
              <span className="font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700">NEXUS AI Teaching Assistant</span>
              <span>•</span>
              <a
                href="https://uneb.ac.ug/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>Uganda National Examinations Board (uneb.ac.ug)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <span className="font-mono text-[11px] text-slate-400">
              Primary (PLE) &amp; Secondary (UCE/UACE) • Powered by Gemini AI
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
