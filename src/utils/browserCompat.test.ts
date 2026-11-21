import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clearMemoryStorageFallbacks,
  parseCssColorToRgb,
  prefersReducedMotionSafe,
  safeStorageGet,
  safeStorageRemove,
  safeStorageSet,
} from './browserCompat';

test('safeStorage helpers fall back seamlessly when browser storage throws SecurityError', () => {
  clearMemoryStorageFallbacks();
  const blockedStorage = {
    getItem() {
      throw new Error('SecurityError: storage blocked');
    },
    setItem() {
      throw new Error('SecurityError: storage blocked');
    },
    removeItem() {
      throw new Error('SecurityError: storage blocked');
    },
  } as unknown as Storage;

  const persistedToBrowser = safeStorageSet('nexus_guest_candidate_name', 'Amina Kigozi', 'local', blockedStorage);
  assert.equal(persistedToBrowser, false);
  assert.equal(safeStorageGet('nexus_guest_candidate_name', 'local', blockedStorage), 'Amina Kigozi');

  safeStorageSet('nexus_session_entered', 'true', 'session', null);
  assert.equal(safeStorageGet('nexus_session_entered', 'session', null), 'true');

  safeStorageRemove('nexus_session_entered', 'session', null);
  assert.equal(safeStorageGet('nexus_session_entered', 'session', null), null);
});

test('parseCssColorToRgb parses 3-digit hex, 6-digit hex, rgb(), and falls back cleanly', () => {
  assert.deepEqual(parseCssColorToRgb('#fff'), [1, 1, 1]);
  assert.deepEqual(parseCssColorToRgb('#1e1342'), [30 / 255, 19 / 255, 66 / 255]);
  assert.deepEqual(parseCssColorToRgb('rgb(51, 102, 204)'), [51 / 255, 102 / 255, 204 / 255]);
  assert.deepEqual(parseCssColorToRgb('invalid-color', [0.2, 0.3, 0.4]), [0.2, 0.3, 0.4]);
});

test('prefersReducedMotionSafe returns false safely in non-browser environments', () => {
  assert.equal(prefersReducedMotionSafe(), false);
});
