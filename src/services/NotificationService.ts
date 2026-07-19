// ============================================================
//  NotificationService — all LOCAL (on-device) notifications.
//
//  No backend, no Firebase, no push tokens. Everything is
//  scheduled from inside the app with @notifee/react-native.
//  Android-only for this pass (channels + POST_NOTIFICATIONS).
// ============================================================

import notifee, {
  AndroidImportance,
  AuthorizationStatus,
  EventType,
  RepeatFrequency,
  TimestampTrigger,
  TriggerType,
} from "@notifee/react-native";

import { KNOWN_MEDICINES, getMockSideEffects } from "../utils/mockAI";
import {
  loadPrefs,
  setRecurringScheduled,
  wasRecurringScheduled,
  getFirstLaunchAt,
  hasEngaged,
} from "./storage";

// Stable notification / channel ids so we can update or cancel them.
export const CHANNELS = {
  reminders: "reminders",
  tips: "tips",
} as const;

export const NOTIF_IDS = {
  draftReminder: "draft-reminder",
  weeklyNudge: "weekly-nudge",
  weeklyTip: "weekly-tip",
  onboarding: "onboarding",
} as const;

// Screens a notification tap can deep-link to. Kept in sync with the navigator.
export type NotifScreen = "PatientInfo" | "MedicineScreen";

const DAY = 24 * 60 * 60 * 1000;

// ---- Setup -------------------------------------------------

/** Request permission (Android 13+ dialog) and create channels. */
export async function init(): Promise<boolean> {
  const settings = await notifee.requestPermission();
  await notifee.createChannel({
    id: CHANNELS.reminders,
    name: "Reminders",
    importance: AndroidImportance.HIGH,
  });
  await notifee.createChannel({
    id: CHANNELS.tips,
    name: "Safety tips",
    importance: AndroidImportance.DEFAULT,
  });
  return settings.authorizationStatus === AuthorizationStatus.AUTHORIZED;
}

function timestampTrigger(
  timestamp: number,
  repeatFrequency?: RepeatFrequency,
): TimestampTrigger {
  return {
    type: TriggerType.TIMESTAMP,
    timestamp,
    repeatFrequency,
    // Inexact alarm that can fire in Doze; needs no exact-alarm permission.
    alarmManager: { allowWhileIdle: true },
  };
}

// ---- #1 Draft "finish your report" reminder ---------------

/** Fire once, a few hours out, unless the report is submitted first. */
export async function scheduleDraftReminder(hoursOut = 4): Promise<void> {
  await notifee.createTriggerNotification(
    {
      id: NOTIF_IDS.draftReminder,
      title: "Finish your ADR report",
      body: "You have an unfinished adverse drug reaction report. Tap to complete it.",
      android: {
        channelId: CHANNELS.reminders,
        pressAction: { id: "default" },
        smallIcon: "ic_launcher",
      },
      data: { screen: "PatientInfo" satisfies NotifScreen },
    },
    timestampTrigger(Date.now() + hoursOut * 60 * 60 * 1000),
  );
}

export const cancelDraftReminder = () =>
  notifee.cancelTriggerNotification(NOTIF_IDS.draftReminder);

// ---- #2 Outcome follow-up reminder ------------------------

/**
 * When a report is submitted and the outcome is still open, nudge the user to
 * file a Follow-Up report after the reaction has had time to evolve.
 * Content is deliberately PHI-free (shows on the lock screen).
 */
export async function scheduleFollowUp(
  outcome?: string,
  daysOut = 10,
): Promise<void> {
  const open =
    !outcome ||
    outcome === "Recovering" ||
    outcome === "Not Recovered" ||
    outcome === "Unknown";
  if (!open) return;

  await notifee.createTriggerNotification(
    {
      // Unique id so multiple reports each get their own follow-up.
      id: `follow-up-${Date.now()}`,
      title: "Time for an ADR follow-up",
      body: "A reaction you reported may need an outcome update. Tap to file a follow-up.",
      android: {
        channelId: CHANNELS.reminders,
        pressAction: { id: "default" },
        smallIcon: "ic_launcher",
      },
      data: { screen: "PatientInfo" satisfies NotifScreen, caseType: "Follow-Up" },
    },
    timestampTrigger(Date.now() + daysOut * DAY),
  );
}

// ---- #3 / #4 Weekly recurring nudge + safety tip ----------

function getRandomTip(): { title: string; body: string } {
  const meds = KNOWN_MEDICINES;
  // Vary by day so repeated calls surface different tips.
  const med = meds[Math.floor(Date.now() / DAY) % meds.length];
  const effects = getMockSideEffects(med);
  const withMsg = effects.find((e) => e.warningMessage) ?? effects[0];
  const label = med.charAt(0).toUpperCase() + med.slice(1);
  return {
    title: `Safety tip: ${label}`,
    body: withMsg?.warningMessage ?? withMsg?.label ?? "Open the app for drug safety references.",
  };
}

/** Register the two weekly notifications once, respecting opt-out prefs. */
export async function ensureRecurring(force = false): Promise<void> {
  const prefs = await loadPrefs();

  // Weekly reporting nudge (#3)
  if (prefs.weeklyNudge) {
    await notifee.createTriggerNotification(
      {
        id: NOTIF_IDS.weeklyNudge,
        title: "Seen an adverse drug reaction?",
        body: "Report any reactions you observed this week — it takes under two minutes.",
        android: {
          channelId: CHANNELS.reminders,
          pressAction: { id: "default" },
          smallIcon: "ic_launcher",
        },
        data: { screen: "PatientInfo" satisfies NotifScreen },
      },
      timestampTrigger(Date.now() + 3 * DAY, RepeatFrequency.WEEKLY),
    );
  } else {
    await notifee.cancelTriggerNotification(NOTIF_IDS.weeklyNudge);
  }

  // Weekly safety tip (#4), offset so the two don't land on the same day.
  if (prefs.safetyTips) {
    const tip = getRandomTip();
    await notifee.createTriggerNotification(
      {
        id: NOTIF_IDS.weeklyTip,
        title: tip.title,
        body: tip.body,
        android: {
          channelId: CHANNELS.tips,
          pressAction: { id: "default" },
          smallIcon: "ic_launcher",
        },
        data: { screen: "MedicineScreen" satisfies NotifScreen },
      },
      timestampTrigger(Date.now() + 6 * DAY, RepeatFrequency.WEEKLY),
    );
  } else {
    await notifee.cancelTriggerNotification(NOTIF_IDS.weeklyTip);
  }

  if (!force) await setRecurringScheduled(true);
}

/** Called on startup: schedule recurring notifications the first time only. */
export async function initRecurringOnce(): Promise<void> {
  if (await wasRecurringScheduled()) return;
  await ensureRecurring();
}

/** Called from the settings screen after a toggle changes. */
export const applyPrefs = () => ensureRecurring(true);

// ---- #5 First-report onboarding ---------------------------

/** If the user installed but never engaged, remind them ~48h in. */
export async function scheduleOnboardingIfNeeded(): Promise<void> {
  if (await hasEngaged()) return;
  const firstLaunch = await getFirstLaunchAt();
  const fireAt = firstLaunch + 2 * DAY;
  if (fireAt <= Date.now()) return; // window already passed
  await notifee.createTriggerNotification(
    {
      id: NOTIF_IDS.onboarding,
      title: "Create your first ADR report",
      body: "Report an adverse drug reaction in a few quick steps.",
      android: {
        channelId: CHANNELS.reminders,
        pressAction: { id: "default" },
        smallIcon: "ic_launcher",
      },
      data: { screen: "PatientInfo" satisfies NotifScreen },
    },
    timestampTrigger(fireAt),
  );
}

export const cancelOnboarding = () =>
  notifee.cancelTriggerNotification(NOTIF_IDS.onboarding);

// ---- Tap handling helpers ---------------------------------

/** Subscribe to notification taps while the app is running. Returns unsubscribe. */
export function onNotificationPress(
  handler: (data: { [key: string]: any }) => void,
): () => void {
  return notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS && detail.notification?.data) {
      handler(detail.notification.data);
    }
  });
}

/** Data of the notification that cold-started the app, if any. */
export async function getInitialRoute(): Promise<{ [key: string]: any } | null> {
  const initial = await notifee.getInitialNotification();
  return (initial?.notification?.data as { [key: string]: any }) ?? null;
}

export { EventType };
