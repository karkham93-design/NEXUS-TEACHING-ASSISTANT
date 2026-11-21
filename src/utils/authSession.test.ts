import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeGuestCandidateName,
  classifyGoogleAuthError,
  getTrackPresetById,
  MAX_GUEST_NAME_LENGTH,
} from './authSession';

test('normalizeGuestCandidateName trims whitespace, collapses spacing, and falls back cleanly', () => {
  assert.equal(normalizeGuestCandidateName(''), 'Guest Candidate');
  assert.equal(normalizeGuestCandidateName('   \n\t  '), 'Guest Candidate');
  assert.equal(normalizeGuestCandidateName('  Sarah   Namubiru  '), 'Sarah Namubiru');

  const veryLong = 'A'.repeat(100);
  assert.equal(normalizeGuestCandidateName(veryLong).length, MAX_GUEST_NAME_LENGTH);
});

test('classifyGoogleAuthError identifies popup-blocked, popup-closed, network, and generic errors', () => {
  const blocked = classifyGoogleAuthError({ code: 'auth/popup-blocked', message: 'Firebase: Error (auth/popup-blocked).' });
  assert.equal(blocked.kind, 'popup-blocked');
  assert.match(blocked.message, /blocked/i);

  const unauthDomain = classifyGoogleAuthError({ code: 'auth/unauthorized-domain', message: 'Firebase: Error (auth/unauthorized-domain).' });
  assert.equal(unauthDomain.kind, 'other');
  assert.match(unauthDomain.message, /Guest Candidate/i);

  const closed = classifyGoogleAuthError({ code: 'auth/popup-closed-by-user' });
  assert.equal(closed.kind, 'popup-closed');

  const net = classifyGoogleAuthError({ code: 'auth/network-request-failed' });
  assert.equal(net.kind, 'network');

  const generic = classifyGoogleAuthError(new Error('Unexpected failure'));
  assert.equal(generic.kind, 'other');
  assert.equal(generic.message, 'Unexpected failure');
});

test('getTrackPresetById resolves valid tracks and defaults safely', () => {
  const ple = getTrackPresetById('ple');
  assert.equal(ple.levelFilter, 'Primary (PLE)');
  assert.equal(ple.initialTab, 'lessons');

  const visuals = getTrackPresetById('visuals');
  assert.equal(visuals.initialTab, 'diagrams');

  const fallback = getTrackPresetById('unknown-track');
  assert.equal(fallback.id, 'all');
});
