import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  saveDraft,
  loadDraft,
  clearDraft,
  savePrefs,
  loadPrefs,
  DEFAULT_PREFS,
  wasRecurringScheduled,
  setRecurringScheduled,
  getFirstLaunchAt,
  hasEngaged,
  setHasEngaged,
} from '../src/services/storage';

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('storage: draft', () => {
  it('round-trips a saved draft', async () => {
    await saveDraft({ patientInitials: 'ML', gender: 'M' });
    const draft = await loadDraft<any>();
    expect(draft).toEqual({ patientInitials: 'ML', gender: 'M' });
  });

  it('returns null when no draft is stored', async () => {
    expect(await loadDraft()).toBeNull();
  });

  it('clears a draft', async () => {
    await saveDraft({ patientInitials: 'AB' });
    await clearDraft();
    expect(await loadDraft()).toBeNull();
  });
});

describe('storage: prefs', () => {
  it('defaults to both notifications on', async () => {
    expect(await loadPrefs()).toEqual(DEFAULT_PREFS);
    expect(DEFAULT_PREFS).toEqual({ weeklyNudge: true, safetyTips: true });
  });

  it('persists updated prefs', async () => {
    await savePrefs({ weeklyNudge: false, safetyTips: true });
    expect(await loadPrefs()).toEqual({ weeklyNudge: false, safetyTips: true });
  });
});

describe('storage: flags', () => {
  it('tracks the recurring-scheduled flag', async () => {
    expect(await wasRecurringScheduled()).toBe(false);
    await setRecurringScheduled(true);
    expect(await wasRecurringScheduled()).toBe(true);
  });

  it('getFirstLaunchAt is stable across calls', async () => {
    const first = await getFirstLaunchAt();
    const second = await getFirstLaunchAt();
    expect(second).toBe(first);
    expect(typeof first).toBe('number');
  });

  it('tracks engagement', async () => {
    expect(await hasEngaged()).toBe(false);
    await setHasEngaged();
    expect(await hasEngaged()).toBe(true);
  });
});
