# ADR Reporter

A mobile app for reporting **Adverse Drug Reactions (ADR)**. It walks a clinician
through a structured ADR form, generates a shareable PDF report, and adds
supporting tools: an on-device medicine side-effect reference, an "Ask AI"
assistant, a **Drug Safety — Alerts & News** feed, and **on-device notifications**
that keep users engaged.

- **Platform:** React Native (New Architecture, Hermes). This pass targets **Android**.
- **Data:** Fully on-device — no backend. Notifications are local (no Firebase/push server).
- **Optional:** "Ask AI" uses Perplexity if an API key is supplied.

---

## Getting started (developers)

```sh
# 1. Install dependencies
npm install

# 2. Start Metro
npm start

# 3. Build & run on an Android device / emulator (Android 13+ recommended)
npm run android
```

Two native modules were added (`@notifee/react-native`,
`@react-native-async-storage/async-storage`), so after pulling this you must run
`npm install` and rebuild the app — a Metro-only reload won't pick up native code.

**Optional — enable Ask AI:** paste a Perplexity key into
`src/config/aiConfig.ts` (`PERPLEXITY_API_KEY`). Without it, the chat UI still
opens and explains that no key is configured.

**Tests:** `npm test` (Jest — logic + a full App render, 26 tests).

---

## Using the app

The form is split into sections, navigated with **Next / Previous** buttons.
Everything you type is **auto-saved as a draft**, so an unfinished report is
remembered if you leave and come back.

| Screen | What you do |
|---|---|
| **A. Patient Information** | Case type (Initial / Follow-Up), patient initials\*, age or DOB\*, gender\*, weight, and reference numbers. The **🔔 icon** (top-right) opens Alerts & News. |
| **B. Suspected Adverse Reaction** | Reaction start/stop dates (date picker) and a description of what happened and how it was managed. |
| **C. Medications** | Up to **4 suspected medications** (name, manufacturer, batch, expiry, dose, route, frequency, dates, indication, action taken, reintroduction, causality) and up to 4 **concomitant** medicines. Per medicine: **Check known side effects** (offline reference) and **Ask AI about this medicine**. |
| **AMC / NCC Use** | Investigations, medical history, **seriousness** (tick all that apply), **outcome**, and additional information. |
| **D. Reporter Details** | Reporter name & address, pin, email, contact, occupation, and report date. |
| **Preview & Submit** | Review every section (with **Edit** shortcuts), then **Open Report** to generate the ADR PDF and open it in any installed PDF viewer. |
| **Medicine Reference** | Search a medicine to see its known side effects and clinical warnings. |
| **Alerts & News** | Drug-safety feed (alerts, research, news), recently reported cases, and **notification settings**. |

\* Required before continuing past Patient Information.

**Ask AI (💬):** a floating button on every screen opens a chat assistant for
drug side-effects, causality, and help completing the form.

---

## Notifications — what fires and when

All notifications are **local / on-device**. On Android 13+ the app asks for
notification permission on first launch. Timing uses battery-friendly
(inexact) alarms, so real fire times can drift by a few minutes, especially in
Doze; aggressive OEM battery managers or a force-stop can pause scheduled ones
until the app is reopened.

| Notification | Scheduled when… | First fires | Repeats | Tapping opens | User control |
|---|---|---|---|---|---|
| **Hourly safety updates** (news) | First launch, or when toggled on (default **on**) | **~1 hour** after scheduling (not at launch) | **Every 1 hour** | Alerts & News feed | Toggle in Alerts & News |
| **Weekly safety tip** | First launch (default **on**) | **+6 days** | **Weekly** | Medicine Reference | Toggle in Alerts & News |
| **Weekly reporting nudge** | First launch (default **on**) | **+3 days** | **Weekly** | Patient Info form | Toggle in Alerts & News |
| **Finish your report** (draft) | You background the app with an **unsaved draft** | **~4 hours** later | No (one-shot) | Patient Info form | Auto-cancelled when you reopen or submit |
| **Outcome follow-up** | You tap **Open Report** and the outcome is still open\* | **+10 days** | No (one per report) | Patient Info (as a Follow-Up case) | Automatic |
| **First-report onboarding** | Installed but no report started | **~48 hours** after first launch | No (one-shot) | Patient Info form | Auto-cancelled once you start a report |

\* "Open outcome" = Recovering, Not Recovered, Unknown, or blank. No follow-up is
scheduled for Recovered / Fatal / Recovered with sequelae.

**Steady-state volume** (defaults, all on): ~1 news alert per hour, plus 2 per
week (nudge + tip), plus the event-driven draft / follow-up / onboarding pings.
Every recurring notification can be turned off individually in the
**Alerts & News → Notifications** section.

**Example timeline** (fresh install, opened at 12:30, both toggles on):

- 12:30 – install & open (nothing fires yet)
- **13:30** – first hourly news update, then 14:30, 15:30, … every hour
- **Day 2** – onboarding reminder (only if no report was started)
- **Day 3** – first weekly reporting nudge, then weekly
- **Day 6** – first weekly safety tip, then weekly
- **Any time** – background an unfinished report → reminder 4h later; submit a
  report with an open outcome → follow-up 10 days later

---

## Project structure

```
App.tsx                         Navigation + engagement/notification wiring
index.js                        Entry point + notifee background handler
src/
  screens/                      Form steps, Preview, Medicine Reference, Alerts & News
  components/                   BackgroundWrapper, NewsImage, Ask AI provider
  contexts/FormContext.tsx      Form state + draft autosave (AsyncStorage)
  services/
    NotificationService.ts      All local notification scheduling
    storage.ts                  AsyncStorage helpers (draft, prefs, flags)
    DrugService.ts              Drug-data lookups (mocked)
  data/newsFeed.ts              Bundled alerts / research / news / cases
  utils/mockAI.ts               On-device side-effect reference library
  utils/openAdrPdf.ts           Copies the bundled PDF out and opens it
  theme/theme.ts                Design tokens (colours, spacing, radius, shadows)
  config/aiConfig.ts            Perplexity "Ask AI" configuration
```

---

## Notes & limitations

- **Android only** this pass — iOS is not configured for notifications/push.
- Notifications are **local**. Broadcast/remote push (e.g. a central drug-recall
  alert to all users) would need FCM + a backend and, for iOS, an Apple
  Developer account — intentionally out of scope here.
- The medicine reference and news feed are **bundled data** so they work offline;
  news photos are fetched over https when a connection is available and fall
  back to a clean placeholder otherwise.
