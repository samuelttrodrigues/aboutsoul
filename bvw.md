# Plan: Manual Beta Testing Checklist

## Context

This checklist covers every area that must be validated before a beta release.
It accounts for: recent encryption work (Phases A–E + key recovery fix), chat UI redesign,
stream cost optimizations, and the LGPD/GDPR blockers listed in CLAUDE.md.

**Two devices are required** for encryption and message status tests.
Keep the debug log visible (`flutter run` or Logcat) throughout — `debugPrint` statements
from the instrumentation passes will tell you exactly what's happening inside.

---

## 🔴 Hard Blockers — Beta cannot ship without these passing

### B1 — Cloud Functions deployed
- [ ] Confirm all CF versions in the Firebase console match the current `functions/src/` code:
  `createConversation`, `onMessageCreated`, `sendGroupMessage`, `createGroup`, `joinGroup`, `onPostLiked`, `distributeGroupKey`
- [ ] Test `createConversation` end-to-end: open a new 1-on-1 chat and confirm the conversation index appears under both `users/{uid}/conversations/` docs

### B2 — App Check debug token registered
- [ x] Register debug token in Firebase Console → App Check
- [ x] Confirm no `App Check token is invalid` errors in logs on a fresh install

### B3 — EULA / Terms / Privacy Policy screens present
- [ ] User must see and accept T&C before completing registration — confirm this gate exists
- [ ] If missing, this is a legal blocker for Brazilian App Store / Play Store submission

### B4 — Account deletion works end-to-end
- [ ] Trigger account deletion → confirm `accountStatus: pending_deletion` is set in Firestore
- [ ] Log back in → confirm `AccountPendingDeletion` screen appears with the reactivation option
- [ ] Tap reactivate → confirm `cancelAccountDeletion` Cloud Function runs and status reverts
- [ ] Wait (or manually set) 30 days → confirm deletion Cloud Function hard-deletes posts, messages, media, profile (LGPD Right to Erasure)

### B5 — Admin UID not hardcoded in production rules
- [ ] Check `firestore.rules` for any hardcoded UID strings — must use Custom Claims instead
- [ ] If hardcoded, do not ship to production until replaced

---

## 🟡 Auth Flows

### A1 — Registration
- [X ] Register new user with email → lands on Step 2 profile completion screen
- [X ] Complete profile → confirm Firestore `/users/{uid}` doc created with correct fields
- [X ] Onboarding shown once, welcome dialog appears after onboarding complete
- [X ] Register with Google → same profile completion flow

### A2 — Login
- [ X] Login with email → main screen visible
- [X ] Login with Google → main screen visible
- [X ] Wrong password → error shown (not a crash)
- [ X] `markPendingWelcomeCheck` flow: returning user who hasn't seen welcome dialog gets it once

### A3 — Logout
- [ X] Tap logout → navigates to LoginScreen (root navigator, no stale tabs)
- [ X] Log in again → no residual state from previous session in any tab
- [ ] Confirm `E2eEncryptionService.clearDerivedKeyCache()` called (check log for `[AuthCubit]` on logout)

### A4 — Cold start / token refresh
- [ ] Force-close and reopen → auth stream re-fires, `restoredFromLocal` in E2E log, no key loss dialog

---

## 🟡 E2E Encryption — 1-on-1 (two devices required)

### E1 — Happy path: both devices have their keys
- [ ] Device A sends text → Device B sees plaintext (not `[Encrypted message]`)
- [ ] Device B sends text → Device A sees plaintext
- [ ] Log confirms: `AUDIT [Decrypt]: dm decryptText=ok` for every message

### E2 — Image messages
- [ ] Device A sends image → Device B sees image (not broken-image icon)
- [ ] Tap image on Device B → full-screen zoom opens (InteractiveViewer)
- [ ] Hot-restart Device B → image bubble still shows (Hive persisted)
- [ ] After hot-restart → tap image → zoom still works (re-decrypts on widget rebuild)

### E3 — Message status
- [ ] Sent → single tick visible on Device A
- [ ] Device B opens conversation → double tick on Device A (read receipt)
- [ ] Group: `lastReadMessageId` updated in `/members/{uid}` (check Firestore)

### E4 — Key recovery: passphrase restore (fresh install)
- [ ] Device A sets a passphrase backup: Settings → Recovery Key → "Backup with passphrase"
- [ ] Uninstall app on Device A (wipes `flutter_secure_storage`)
- [ ] Reinstall and log in on Device A
- [ ] **Expected**: `PassphraseRestoreDialog` appears (NOT the "key lost" dead-end dialog)
- [ ] Enter correct passphrase → dialog dismissed, old messages decrypt correctly
- [ ] Log confirms: `AUDIT [InitE2E]: backup found — deferring to user`

### E5 — Key recovery: wrong passphrase
- [ ] Same reinstall scenario as E4
- [ ] Enter wrong passphrase → error message shown in dialog, dialog stays open, can retry
- [ ] Retry with correct passphrase → success

### E6 — Key recovery: skip restore
- [ ] Same reinstall scenario as E4
- [ ] Tap "Skip — use new key" → dialog dismisses
- [ ] "Chave de segurança perdida" alert appears
- [ ] Old messages show as `[Encrypted message]` (correct — unrecoverable)
- [ ] New messages sent after skip encrypt and decrypt correctly

### E7 — Key recovery: no backup (passphrase never set)
- [ ] Uninstall without ever setting a passphrase backup
- [ ] Reinstall and log in
- [ ] **Expected**: NO restore dialog — immediately generates new pair and shows "key lost" alert
- [ ] Log confirms: `AUDIT [InitE2E]: no backup found — key is truly unrecoverable`

### E8 — Decryption retry (key-init race condition)
- [ ] Open a conversation immediately after login (before key init completes)
- [ ] Log confirms: at most 2 calls to `_syncNetworkMessages` (initial + 1 retry), then stops
- [ ] No infinite `scheduling ONE retry` loop in logs

### E9 — Encrypted message stubs visible
- [ ] If any messages failed decryption permanently → they appear as `[Encrypted message]` bubbles, not invisible
- [ ] Total bubble count in UI matches total doc count in Firestore

---

## 🟡 E2E Encryption — Groups

### G1 — Group key distribution
- [ ] Create group → confirm `distributeGroupKey` CF ran (check `/conversations/{id}/e2e_group_keys/`)
- [ ] All members can send and read group messages (plaintext after decryption)
- [ ] New member joins → `joinGroup` CF distributes key to new member

### G2 — Group message flow
- [ ] Send text in group from Device A → Devices B and C see plaintext
- [ ] Group images display correctly (group image encryption is deferred — they use plaintext URLs)

---

## 🟡 Chat UI

### C1 — Conversation list
- [ ] Conversations sorted by most recent
- [ ] `lastMessage` preview updates when a new message arrives
- [ ] Unread count badge appears and clears when conversation is opened
- [ ] Avatar loads or shows fallback

### C2 — Chat detail
- [ ] Messages display in correct order (newest at bottom)
- [ ] Date separator pills appear between days
- [ ] Scroll-to-bottom FAB appears when scrolled up; tap scrolls to bottom
- [ ] Long-press → Copy and Favorite options work; heart indicator appears on bubble
- [ ] Favorite saved to Hive, visible on Favorite Messages page (heart icon in AppBar)
- [ ] Reply to message → quote bubble shows correct preview; tap scrolls to original with highlight

### C3 — Message input
- [ ] Type and send text → appears immediately (optimistic from Hive, `pending` status)
- [ ] Send image → picker opens, image uploads, encrypted bubble appears
- [ ] Empty send disabled

### C4 — Firestore read cost (stream optimization)
- [ ] First open of conversation: log shows `getMessagesStream since=null`
- [ ] Navigate away and back: log shows `getMessagesStream since=<timestamp>` (incremental)
- [ ] If no new messages arrived: 0 docs returned on re-open (check log count)

### C5 — Offline behavior
- [ ] Disable network → send a message → status `pending` in bubble
- [ ] Re-enable network → message syncs → status becomes `sent`
- [ ] Open a cached conversation offline → messages visible from Hive, no crash

### C6 — Leave conversation
- [ ] Leave 1-on-1 → conversation removed from list, `softDeleteConversation` CF called
- [ ] Leave group → `removeMember` CF called, member removed

---

## 🟡 Threads / Feed / Videos / Search / Profile

### T1 — Threads
- [ ] Threads page loads
- [ ] Thread detail opens with `CustomScrollView` (no nested ListView crash)
- [ ] Post comment → appears immediately
- [ ] Nested replies render with correct connection lines

### F1 — Feed / Posts
- [ ] Feed loads with `discoveryScore` ordering
- [ ] Like a post → counter increments, `onPostLiked` CF fires (throttled — no spam)
- [ ] Only `isPublic: true` posts visible to non-followers

### V1 — Videos
- [ ] Videos page opens in immersive mode (status bar hidden)
- [ ] Swipe-escape arrows visible; tapping navigates to adjacent tabs
- [ ] SystemChrome restores to `edgeToEdge` on tab switch away from videos

### S1 — Search / Discovery
- [ ] Search returns results
- [ ] Discovery feed shows posts sorted by `discoveryScore`

### P1 — Profile
- [ ] Profile data correct
- [ ] Edit profile → Firestore updated, profile reflects changes
- [ ] Recovery Key tile in Settings → opens passphrase backup/restore flow

---

## 🟡 Notifications

- [ ] Receive message while app backgrounded → FCM push appears
- [ ] Tap notification → opens correct conversation
- [ ] FCM token registered on login (`/users/{uid}/tokens/`), removed on logout

---

## 🟡 Security Spot-Checks

- [ ] Firestore REST: read another user's `/users/{uid}/conversations/` → `PERMISSION_DENIED`
- [ ] Write a message to a conversation you're not a participant of → `PERMISSION_DENIED`
- [ ] Write `authorId` as someone else's UID → Security Rules reject
- [ ] **EXIF stripping: NOT yet implemented** — disable camera-to-upload path OR warn beta testers not to share real photos until this is implemented (GPS metadata is exposed)

---

## 🔴 Known LGPD Gaps (must resolve before public production — can ship to closed beta with informed testers)

| Gap | Risk |
|-----|------|
| EXIF stripping on image upload | GPS/device metadata exposed |
| Consent logging for image features | LGPD audit trail missing |
| Account deletion Cloud Function hard-delete | Right to Erasure incomplete |
| Hardcoded admin UID in Security Rules | Must use Custom Claims |
| EULA / Privacy Policy in-app screens | App Store / legal requirement |

---

## Test Setup Required

| Requirement | Why |
|-------------|-----|
| 2 physical devices (or 1 device + emulator) | E2E message flow, read receipts |
| 1 full uninstall + reinstall scenario | Key recovery (E4–E7) |
| Firebase Console open | Verify CF execution, inspect Firestore docs |
| `flutter run` with console visible | Live `debugPrint` logs |
| Airplane mode toggle | Offline behavior (C5) |
| A user account that previously set a passphrase backup | Key recovery restore path (E4, E5) |
