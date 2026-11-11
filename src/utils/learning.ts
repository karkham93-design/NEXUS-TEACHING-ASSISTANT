/**
 * Pure helper utilities for UNEB (Uganda National Examinations Board) Primary (PLE)
 * and Secondary (UCE/UACE) learning, grading calculation, progress tracking, and score evaluations.
 * Reference: https://uneb.ac.ug/
 */

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ProgressSummary {
  totalLessons: number;
  completedLessons: number;
  completionPercentage: number;
  currentLevel: string;
  totalPoints: number;
}

export type UNEBGrade = 'D1' | 'D2' | 'C3' | 'C4' | 'C5' | 'C6' | 'P7' | 'P8' | 'F9';

/**
 * Evaluates standard UNEB numeric score into UNEB Grade points (D1 = 1 to F9 = 9)
 */
export function evaluateUNEBGrade(score: number): { grade: UNEBGrade; points: number; label: string } {
  if (score >= 80) return { grade: 'D1', points: 1, label: 'Distinction 1' };
  if (score >= 70) return { grade: 'D2', points: 2, label: 'Distinction 2' };
  if (score >= 65) return { grade: 'C3', points: 3, label: 'Credit 3' };
  if (score >= 60) return { grade: 'C4', points: 4, label: 'Credit 4' };
  if (score >= 55) return { grade: 'C5', points: 5, label: 'Credit 5' };
  if (score >= 50) return { grade: 'C6', points: 6, label: 'Credit 6' };
  if (score >= 45) return { grade: 'P7', points: 7, label: 'Pass 7' };
  if (score >= 40) return { grade: 'P8', points: 8, label: 'Pass 8' };
  return { grade: 'F9', points: 9, label: 'Fail 9' };
}

/**
 * Calculates official UNEB PLE Division based on 4 subjects aggregate (Eng, Math, Sci, SST).
 * Range: 4 (Best possible) to 36 (Ungraded).
 */
export function calculatePLEDivision(aggregate: number): {
  division: 'Division 1' | 'Division 2' | 'Division 3' | 'Division 4' | 'Division U';
  remarks: string;
} {
  if (aggregate >= 4 && aggregate <= 12) {
    return { division: 'Division 1', remarks: 'First Grade (Excellent performance)' };
  }
  if (aggregate >= 13 && aggregate <= 24) {
    return { division: 'Division 2', remarks: 'Second Grade (Very good performance)' };
  }
  if (aggregate >= 25 && aggregate <= 29) {
    return { division: 'Division 3', remarks: 'Third Grade (Satisfactory performance)' };
  }
  if (aggregate >= 30 && aggregate <= 34) {
    return { division: 'Division 4', remarks: 'Fourth Grade (Pass level)' };
  }
  return { division: 'Division U', remarks: 'Ungraded (Candidate must retake)' };
}

export const POINTS_PER_QUESTION = 2;

/**
 * Calculates current level and completion stats for UNEB candidate study track.
 */
export function calculateLearningProgress(
  totalCount: number,
  completedCount: number,
  scorePoints: number
): ProgressSummary {
  const safeTotal = Math.max(1, totalCount);
  const safeCompleted = Math.min(safeTotal, Math.max(0, completedCount));
  const completionPercentage = Math.round((safeCompleted / safeTotal) * 100);

  let currentLevel = 'Candidate Scholar';
  if (scorePoints >= 30) {
    currentLevel = 'National Scholar (Division 1 Distinction)';
  } else if (scorePoints >= 20) {
    currentLevel = 'UACE Senior Scholar (S.5 - S.6)';
  } else if (scorePoints >= 10) {
    currentLevel = 'UCE Candidate (S.3 - S.4)';
  } else if (scorePoints >= 4) {
    currentLevel = 'Lower Secondary Scholar (S.1 - S.2)';
  } else if (scorePoints >= 2) {
    currentLevel = 'Primary Pupil (P.5 - P.7)';
  }

  return {
    totalLessons: safeTotal,
    completedLessons: safeCompleted,
    completionPercentage,
    currentLevel,
    totalPoints: Math.max(0, scorePoints),
  };
}

/**
 * Validates a quiz submission and computes awarded revision points:
 * Exactly 2 points per correctly answered question.
 */
export function evaluateQuizAnswers(
  questions: QuizQuestion[],
  userAnswers: Record<string, number>
): { score: number; percentage: number; isPassed: boolean; pointsAwarded: number } {
  if (!questions || questions.length === 0) {
    return { score: 0, percentage: 0, isPassed: false, pointsAwarded: 0 };
  }

  let correctCount = 0;
  for (const q of questions) {
    if (userAnswers[q.id] === q.correctIndex) {
      correctCount++;
    }
  }

  const percentage = Math.round((correctCount / questions.length) * 100);
  const isPassed = correctCount > 0; // Any correct question earns real points
  const pointsAwarded = correctCount * POINTS_PER_QUESTION; // Strictly 2 points per question

  return {
    score: correctCount,
    percentage,
    isPassed,
    pointsAwarded,
  };
}
