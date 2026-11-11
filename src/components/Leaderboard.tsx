import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { collection, onSnapshot, query, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  Trophy,
  Award,
  Sparkles,
  UserCheck,
  Star,
  Medal,
  ClipboardCheck,
  Zap,
  Edit2,
  Check,
  User as UserIcon,
} from 'lucide-react';

export interface LeaderboardStudent {
  id: string;
  name: string;
  rank: number;
  department: string;
  courses: number;
  points: number;
  questionsAnswered: number;
  badges: string[];
  avatarBg: string;
  avatarText: string;
  isCurrentUser?: boolean;
  isGuest?: boolean;
}

interface LeaderboardProps {
  currentUser: User | null;
  currentPoints: number;
  completedLessonsCount: number;
  theme: 'dark' | 'light';
  onSignInClick?: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  currentUser,
  currentPoints,
  completedLessonsCount,
  theme,
  onSignInClick,
}) => {
  const [firestoreEntries, setFirestoreEntries] = useState<Record<string, any>>({});
  const [isEditingGuestName, setIsEditingGuestName] = useState<boolean>(false);
  const [guestCandidateName, setGuestCandidateName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nexus_guest_candidate_name');
      if (saved) return saved;
    }
    return 'Guest Candidate';
  });
  const [guestNameInput, setGuestNameInput] = useState<string>(guestCandidateName);

  // Real-time listener for Firestore /leaderboard (available for both guests and authenticated users)
  useEffect(() => {
    try {
      const q = query(collection(db, 'leaderboard'), limit(50));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const remoteData: Record<string, any> = {};
          snapshot.forEach((doc) => {
            remoteData[doc.id] = doc.data();
          });
          setFirestoreEntries(remoteData);
        },
        (error) => {
          console.info('Leaderboard live sync notice:', error.message);
        }
      );
      return () => unsubscribe();
    } catch (e) {
      console.info('Firestore Leaderboard subscription note:', e);
    }
  }, []);

  // Save guest name changes to local storage
  const handleSaveGuestName = () => {
    const trimmed = guestNameInput.trim() || 'Guest Candidate';
    setGuestCandidateName(trimmed);
    localStorage.setItem('nexus_guest_candidate_name', trimmed);
    setIsEditingGuestName(false);
  };

  // Construct consolidated leaderboard entries (zero mock/example names!)
  const allStudents: LeaderboardStudent[] = React.useMemo(() => {
    const list: LeaderboardStudent[] = [];

    // Calculate badges based on points and completed lessons
    const computeBadges = (pts: number, lessonsCount: number) => {
      const badges: string[] = ['red_star'];
      if (lessonsCount >= 1 || pts >= 180) badges.push('silver_medal');
      if (pts >= 250) badges.push('gold_rosette');
      if (lessonsCount >= 2) badges.push('checklist');
      if (pts >= 350) badges.push('blue_rosette');
      return badges;
    };

    // 1. Current user entry (Guest OR Signed-In)
    if (currentUser) {
      // Signed in user
      const existingFirestore = firestoreEntries[currentUser.uid];
      const userPoints = Math.max(currentPoints, existingFirestore?.points || 0);
      const userQuestions = Math.max(completedLessonsCount * 2, existingFirestore?.questionsAnswered || 0);
      const userCourses = Math.max(completedLessonsCount * 4, existingFirestore?.courses || 12);
      const displayName = currentUser.displayName || currentUser.email?.split('@')[0] || 'Candidate';

      list.push({
        id: currentUser.uid,
        name: displayName,
        rank: 1,
        department: existingFirestore?.department || 'UNEB Secondary & PLE Track',
        courses: userCourses,
        points: userPoints,
        questionsAnswered: userQuestions,
        badges: computeBadges(userPoints, completedLessonsCount),
        avatarBg: 'bg-red-600',
        avatarText: (displayName[0] || 'U').toUpperCase(),
        isCurrentUser: true,
        isGuest: false,
      });
    } else {
      // Guest candidate entry (guaranteed to appear on the leaderboard!)
      const guestPoints = currentPoints;
      const guestQuestions = completedLessonsCount * 2;
      const guestCourses = Math.max(completedLessonsCount * 4, 12);

      list.push({
        id: 'guest_active_scholar',
        name: guestCandidateName,
        rank: 1,
        department: 'UNEB Candidate Track (Guest)',
        courses: guestCourses,
        points: guestPoints,
        questionsAnswered: guestQuestions,
        badges: computeBadges(guestPoints, completedLessonsCount),
        avatarBg: 'bg-cyan-600',
        avatarText: (guestCandidateName[0] || 'G').toUpperCase(),
        isCurrentUser: true,
        isGuest: true,
      });
    }

    // 2. Add other registered candidates from Firestore (excluding current user to avoid duplicates)
    Object.entries(firestoreEntries).forEach(([uid, data]) => {
      const isSelf = currentUser && uid === currentUser.uid;
      if (!isSelf && data.displayName) {
        list.push({
          id: uid,
          name: data.displayName,
          rank: 99,
          department: data.department || 'UNEB Candidate Track',
          courses: data.courses || 12,
          points: data.points || 0,
          questionsAnswered: data.questionsAnswered || 0,
          badges: Array.isArray(data.badges) ? data.badges : ['red_star'],
          avatarBg: 'bg-indigo-600',
          avatarText: (data.displayName?.[0] || 'C').toUpperCase(),
          isCurrentUser: false,
          isGuest: false,
        });
      }
    });

    // 3. Load other stored guest candidates from local registry if present
    if (typeof window !== 'undefined') {
      try {
        const storedGuestsRaw = localStorage.getItem('nexus_guest_candidates_registry');
        if (storedGuestsRaw) {
          const parsed = JSON.parse(storedGuestsRaw);
          if (Array.isArray(parsed)) {
            parsed.forEach((g: any) => {
              if (g.name && g.name !== guestCandidateName) {
                list.push({
                  id: g.id || `guest_${g.name}`,
                  name: g.name,
                  rank: 99,
                  department: g.department || 'UNEB Candidate Scholar',
                  courses: g.courses || 12,
                  points: g.points || 140,
                  questionsAnswered: g.questionsAnswered || 2,
                  badges: g.badges || ['red_star'],
                  avatarBg: 'bg-emerald-600',
                  avatarText: (g.name[0] || 'G').toUpperCase(),
                  isCurrentUser: false,
                  isGuest: true,
                });
              }
            });
          }
        }
      } catch (err) {
        console.warn('Local guest registry parse note:', err);
      }
    }

    // Sort by points descending
    list.sort((a, b) => b.points - a.points);

    // Assign 1-indexed ranks
    return list.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }, [currentUser, currentPoints, completedLessonsCount, firestoreEntries, guestCandidateName]);

  // Row color theme mapping corresponding precisely to image_44e24ff6.png
  const getRowStyle = (rank: number, isCurrentUser?: boolean) => {
    if (isCurrentUser) {
      return theme === 'dark'
        ? 'bg-red-950/40 border-2 border-red-500/80 shadow-md shadow-red-900/20'
        : 'bg-red-50 border-2 border-red-400 shadow-md';
    }

    switch (rank) {
      case 1:
        return theme === 'dark'
          ? 'bg-teal-950/40 border border-teal-800/50 hover:bg-teal-900/40 text-slate-100'
          : 'bg-[#E7F8F2] border border-[#C5EFE0] hover:bg-[#DDF5EC] text-slate-900';
      case 2:
        return theme === 'dark'
          ? 'bg-amber-950/30 border border-amber-800/40 hover:bg-amber-900/30 text-slate-100'
          : 'bg-[#FFF3E5] border border-[#FFE2C2] hover:bg-[#FFEBD4] text-slate-900';
      case 3:
        return theme === 'dark'
          ? 'bg-rose-950/30 border border-rose-800/40 hover:bg-rose-900/30 text-slate-100'
          : 'bg-[#FFEBE6] border border-[#FFD4CA] hover:bg-[#FFE0D7] text-slate-900';
      case 4:
        return theme === 'dark'
          ? 'bg-pink-950/30 border border-pink-800/40 hover:bg-pink-900/30 text-slate-100'
          : 'bg-[#FCE8F3] border border-[#F8CCE6] hover:bg-[#FAD9EC] text-slate-900';
      case 5:
        return theme === 'dark'
          ? 'bg-purple-950/30 border border-purple-800/40 hover:bg-purple-900/30 text-slate-100'
          : 'bg-[#F0EBFC] border border-[#DFD3F9] hover:bg-[#E8DFF9] text-slate-900';
      default:
        return theme === 'dark'
          ? 'bg-slate-900/60 border border-slate-800/60 hover:bg-slate-800/50 text-slate-200'
          : 'bg-slate-50 border border-slate-200 hover:bg-slate-100/80 text-slate-800';
    }
  };

  // Render badge chip icon
  const renderBadge = (badgeKey: string) => {
    switch (badgeKey) {
      case 'red_star':
        return (
          <div
            key={badgeKey}
            title="10 Questions / Drills Completed"
            className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-sm ring-1 ring-rose-400"
          >
            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-200" />
          </div>
        );
      case 'silver_medal':
        return (
          <div
            key={badgeKey}
            title="10 Quizzes Mastered"
            className="w-7 h-7 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center shadow-sm ring-1 ring-slate-400"
          >
            <Medal className="w-3.5 h-3.5 text-slate-700" />
          </div>
        );
      case 'gold_rosette':
        return (
          <div
            key={badgeKey}
            title="20 Quizzes Mastered"
            className="w-7 h-7 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-sm ring-1 ring-amber-300"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-950" />
          </div>
        );
      case 'blue_rosette':
        return (
          <div
            key={badgeKey}
            title="20 Drills Completed"
            className="w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-sm ring-1 ring-sky-300"
          >
            <Zap className="w-3.5 h-3.5 fill-sky-100 text-white" />
          </div>
        );
      case 'checklist':
      default:
        return (
          <div
            key={badgeKey}
            title="All Checklists Completed"
            className="w-7 h-7 rounded-full bg-teal-400 text-teal-950 flex items-center justify-center shadow-sm ring-1 ring-teal-300"
          >
            <ClipboardCheck className="w-3.5 h-3.5 text-teal-900" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Guest Scholar Banner & Custom Name Editor */}
      {!currentUser && (
        <div className="bg-gradient-to-r from-red-950/70 via-slate-900 to-cyan-950/70 border border-red-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-sm sm:text-base">
                  Guest Candidate Active on Leaderboard
                </h4>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-600/50 font-bold px-2 py-0.5 rounded-full font-mono uppercase">
                  Ranked Live
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Your questions, drills, and revision points are tracked live. You appear right on the leaderboard below!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {isEditingGuestName ? (
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <input
                  type="text"
                  value={guestNameInput}
                  onChange={(e) => setGuestNameInput(e.target.value)}
                  placeholder="Enter Candidate Name"
                  className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono w-full sm:w-44"
                />
                <button
                  onClick={handleSaveGuestName}
                  className="p-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs"
                  title="Save Name"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setGuestNameInput(guestCandidateName);
                  setIsEditingGuestName(true);
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs flex items-center gap-1.5 transition-all"
              >
                <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Set Candidate Name</span>
              </button>
            )}

            {onSignInClick && (
              <button
                onClick={onSignInClick}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-red-600/30 transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap"
              >
                <UserCheck className="w-4 h-4" />
                <span>Connect Google</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Leaderboard Card - Replicating image_44e24ff6.png without mock/example names */}
      <div className={`rounded-2xl border shadow-2xl p-5 sm:p-8 transition-colors ${
        theme === 'dark'
          ? 'bg-slate-900/95 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header Block with Title & Brand Crest */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/40">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Candidate Goals Leaderboard
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              National UNEB Primary &amp; Secondary revision rankings • Real candidate scores from completed exam drills
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-center">
            <img
              src="/assets/aistudio/image_2c59f5bc.png"
              alt="NEXUS"
              className="w-10 h-10 object-contain drop-shadow-sm"
            />
            <div className="text-right">
              <div className="font-mono text-xs font-black tracking-wider text-cyan-400">
                NEXUS ACADEMY
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                UNEB INTELLIGENCE
              </div>
            </div>
          </div>
        </div>

        {/* Candidate Quick Summary Card */}
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-600/15 via-slate-800/40 to-cyan-500/15 border border-red-500/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-600 text-white font-bold flex items-center justify-center text-sm shadow-md ring-2 ring-cyan-400/50">
              {currentUser?.displayName
                ? currentUser.displayName[0].toUpperCase()
                : (guestCandidateName[0] || 'G').toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">
                  {currentUser?.displayName || guestCandidateName}
                </span>
                <span className="text-[10px] bg-red-950 text-red-300 border border-red-500/50 font-bold px-2 py-0.5 rounded-full font-mono uppercase">
                  {currentUser ? 'Signed In' : 'Guest Scholar'}
                </span>
              </div>
              <div className="text-xs text-slate-400">
                {currentUser?.email || 'Local Revision Session'} • {completedLessonsCount} Lessons Mastered
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[11px] text-slate-400 font-medium">Accumulated Points</div>
              <div className="text-lg font-mono font-extrabold text-amber-400">
                {currentPoints} pts
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-slate-400 font-medium">National Rank</div>
              <div className="text-lg font-mono font-extrabold text-cyan-400">
                #{String(allStudents.find((s) => s.isCurrentUser)?.rank || 1).padStart(3, '0')}
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Table Container */}
        <div className="overflow-x-auto">
          {/* Header Row Styled exactly as in image_44e24ff6.png (Dark Pill / Black Rounded Header) */}
          <div className="min-w-[680px] bg-black text-white rounded-xl px-6 py-3.5 mb-3 grid grid-cols-12 text-xs font-bold uppercase tracking-wider items-center shadow-lg">
            <div className="col-span-4 flex items-center gap-2">
              <span>Name</span>
            </div>
            <div className="col-span-2 text-center">
              <span>Rank</span>
            </div>
            <div className="col-span-3">
              <span>Department / Track</span>
            </div>
            <div className="col-span-1 text-center">
              <span>Courses</span>
            </div>
            <div className="col-span-2 text-right pr-2">
              <span>Badges</span>
            </div>
          </div>

          {/* Student Rows */}
          <div className="min-w-[680px] space-y-2.5">
            {allStudents.map((student) => {
              const rankStr = String(student.rank).padStart(3, '0');
              const rowStyle = getRowStyle(student.rank, student.isCurrentUser);

              return (
                <div
                  key={student.id}
                  className={`rounded-xl px-6 py-3.5 grid grid-cols-12 items-center transition-all ${rowStyle}`}
                >
                  {/* Name + Avatar */}
                  <div className="col-span-4 flex items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-full ${student.avatarBg} text-white font-bold text-xs flex items-center justify-center shadow-md flex-shrink-0`}
                    >
                      {student.avatarText}
                    </div>
                    <div>
                      <div className="font-bold text-sm leading-tight flex items-center gap-2">
                        <span>{student.name}</span>
                        {student.isCurrentUser && (
                          <span className="text-[10px] bg-red-600 text-white font-mono px-1.5 py-0.5 rounded font-bold">
                            YOU
                          </span>
                        )}
                        {student.isGuest && (
                          <span className="text-[9px] bg-cyan-950 text-cyan-300 border border-cyan-600/40 font-mono px-1 rounded">
                            GUEST
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] opacity-75 leading-tight mt-0.5">
                        {student.points} pts earned
                      </div>
                    </div>
                  </div>

                  {/* Rank with 001, 002 formatting */}
                  <div className="col-span-2 text-center">
                    <span className="font-mono font-extrabold text-sm tracking-widest">
                      {rankStr}
                    </span>
                  </div>

                  {/* Department */}
                  <div className="col-span-3 text-xs font-semibold opacity-90 truncate pr-2">
                    {student.department}
                  </div>

                  {/* Courses Count */}
                  <div className="col-span-1 text-center font-mono font-bold text-sm">
                    {student.courses}
                  </div>

                  {/* Badges List */}
                  <div className="col-span-2 flex items-center justify-end gap-1.5 pr-1">
                    {student.badges.map((b) => renderBadge(b))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend Footer - Matching the bottom section in image_44e24ff6.png */}
        <div className="mt-8 pt-6 border-t border-slate-800/40 grid grid-cols-2 sm:grid-cols-5 gap-3.5 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-rose-500 flex items-center justify-center flex-shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-200" />
            </div>
            <span className="font-semibold text-slate-300 text-[11px]">10 Drills Completed</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center flex-shrink-0">
              <Zap className="w-3.5 h-3.5 fill-sky-100 text-white" />
            </div>
            <span className="font-semibold text-slate-300 text-[11px]">20 Drills Completed</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-slate-300 flex items-center justify-center flex-shrink-0">
              <Medal className="w-3.5 h-3.5 text-slate-700" />
            </div>
            <span className="font-semibold text-slate-300 text-[11px]">10 Quizzes Mastered</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0">
              <Trophy className="w-3.5 h-3.5 text-amber-950" />
            </div>
            <span className="font-semibold text-slate-300 text-[11px]">20 Quizzes Mastered</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-teal-400 flex items-center justify-center flex-shrink-0">
              <ClipboardCheck className="w-3.5 h-3.5 text-teal-900" />
            </div>
            <span className="font-semibold text-slate-300 text-[11px]">All Checklists Completed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
