// Thin, typed wrapper around AsyncStorage for the few things the engagement
// features need to remember between launches: the in-progress form draft, the
// user's notification opt-out preferences, and a couple of scheduling flags.

import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  draft: "adr:draft",
  prefs: "adr:notificationPrefs",
  recurringScheduled: "adr:recurringScheduled",
  firstLaunchAt: "adr:firstLaunchAt",
  hasEngaged: "adr:hasEngaged",
} as const;

export type NotificationPrefs = {
  weeklyNudge: boolean;
  safetyTips: boolean;
  hourlyNews: boolean;
};

export const DEFAULT_PREFS: NotificationPrefs = {
  weeklyNudge: true,
  safetyTips: true,
  hourlyNews: true,
};

async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

async function writeJson(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* best effort — storage failures should never crash the app */
  }
}

// ---- Draft (the in-progress ADR form) ----
export const saveDraft = (form: unknown) => writeJson(KEYS.draft, form);
export const loadDraft = <T>(): Promise<T | null> =>
  readJson<T | null>(KEYS.draft, null);
export const clearDraft = () => AsyncStorage.removeItem(KEYS.draft).catch(() => {});

// ---- Notification preferences ----
export async function loadPrefs(): Promise<NotificationPrefs> {
  // Merge over defaults so prefs saved before a new toggle existed stay valid.
  const stored = await readJson<Partial<NotificationPrefs>>(KEYS.prefs, {});
  return { ...DEFAULT_PREFS, ...stored };
}
export const savePrefs = (prefs: NotificationPrefs) => writeJson(KEYS.prefs, prefs);

// ---- Scheduling flags ----
export const wasRecurringScheduled = () =>
  readJson<boolean>(KEYS.recurringScheduled, false);
export const setRecurringScheduled = (v: boolean) =>
  writeJson(KEYS.recurringScheduled, v);

// ---- First-run / onboarding ----
export async function getFirstLaunchAt(): Promise<number> {
  const existing = await readJson<number | null>(KEYS.firstLaunchAt, null);
  if (existing) return existing;
  const now = Date.now();
  await writeJson(KEYS.firstLaunchAt, now);
  return now;
}
export const hasEngaged = () => readJson<boolean>(KEYS.hasEngaged, false);
export const setHasEngaged = () => writeJson(KEYS.hasEngaged, true);
