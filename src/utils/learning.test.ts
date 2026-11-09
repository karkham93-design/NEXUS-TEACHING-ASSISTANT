import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateLearningProgress,
  evaluateQuizAnswers,
  evaluateUNEBGrade,
  calculatePLEDivision,
} from './learning';

test('evaluateUNEBGrade converts percentage scores into official UNEB grades and points', () => {
  assert.equal(evaluateUNEBGrade(85).grade, 'D1');
  assert.equal(evaluateUNEBGrade(85).points, 1);

  assert.equal(evaluateUNEBGrade(72).grade, 'D2');
  assert.equal(evaluateUNEBGrade(67).grade, 'C3');
  assert.equal(evaluateUNEBGrade(52).grade, 'C6');
  assert.equal(evaluateUNEBGrade(47).grade, 'P7');
  assert.equal(evaluateUNEBGrade(30).grade, 'F9');
});

test('calculatePLEDivision calculates official Divisions 1 to U from 4 subjects aggregate', () => {
  assert.equal(calculatePLEDivision(4).division, 'Division 1');
  assert.equal(calculatePLEDivision(12).division, 'Division 1');
  assert.equal(calculatePLEDivision(13).division, 'Division 2');
  assert.equal(calculatePLEDivision(24).division, 'Division 2');
  assert.equal(calculatePLEDivision(27).division, 'Division 3');
  assert.equal(calculatePLEDivision(32).division, 'Division 4');
  assert.equal(calculatePLEDivision(35).division, 'Division U');
});

test('calculateLearningProgress calculates completion and UNEB academic levels', () => {
  const result = calculateLearningProgress(10, 5, 200);
  assert.equal(result.totalLessons, 10);
  assert.equal(result.completedLessons, 5);
  assert.equal(result.completionPercentage, 50);
  assert.equal(result.currentLevel, 'UCE Candidate (S.3 - S.4)');
});

test('evaluateQuizAnswers scores correctly with UNEB 60% credit benchmark', () => {
  const questions = [
    { id: 'q1', question: 'What is the main function of red blood cells?', options: ['Carry oxygen', 'Fight disease'], correctIndex: 0, explanation: '' },
    { id: 'q2', question: 'Which lake is shared by Uganda, Kenya and Tanzania?', options: ['Lake Victoria', 'Lake Albert'], correctIndex: 0, explanation: '' },
  ];

  const pass = evaluateQuizAnswers(questions, { q1: 0, q2: 0 });
  assert.equal(pass.score, 2);
  assert.equal(pass.isPassed, true);
  assert.equal(pass.pointsAwarded, 70);
});
