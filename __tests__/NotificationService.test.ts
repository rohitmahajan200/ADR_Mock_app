import notifee, { TriggerType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  init,
  scheduleFollowUp,
  ensureRecurring,
  initRecurringOnce,
  scheduleOnboardingIfNeeded,
  NOTIF_IDS,
} from '../src/services/NotificationService';
import { savePrefs, setHasEngaged } from '../src/services/storage';

const create = notifee.createTriggerNotification as jest.Mock;
const cancel = notifee.cancelTriggerNotification as jest.Mock;

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

describe('init', () => {
  it('requests permission and creates both channels', async () => {
    const ok = await init();
    expect(notifee.requestPermission).toHaveBeenCalled();
    expect(notifee.createChannel).toHaveBeenCalledTimes(2);
    expect(ok).toBe(true); // mock returns AUTHORIZED
  });
});

describe('scheduleFollowUp — outcome gating', () => {
  it.each([undefined, 'Recovering', 'Not Recovered', 'Unknown'])(
    'schedules when outcome is open (%s)',
    async (outcome) => {
      await scheduleFollowUp(outcome as any);
      expect(create).toHaveBeenCalledTimes(1);
    },
  );

  it.each(['Recovered', 'Fatal', 'Recovered with sequelae'])(
    'does NOT schedule when outcome is resolved (%s)',
    async (outcome) => {
      await scheduleFollowUp(outcome);
      expect(create).not.toHaveBeenCalled();
    },
  );

  it('schedules with PatientInfo + Follow-Up case-type data', async () => {
    await scheduleFollowUp('Recovering');
    const [notification] = create.mock.calls[0];
    expect(notification.data).toMatchObject({
      screen: 'PatientInfo',
      caseType: 'Follow-Up',
    });
    // Never leak patient info into the body (shows on lock screen).
    expect(notification.body).not.toMatch(/patient|initials/i);
  });
});

describe('ensureRecurring — respects opt-out prefs', () => {
  it('schedules all three when every pref is on', async () => {
    await savePrefs({ weeklyNudge: true, safetyTips: true, hourlyNews: true });
    await ensureRecurring(true);
    const ids = create.mock.calls.map((c) => c[0].id);
    expect(ids).toContain(NOTIF_IDS.weeklyNudge);
    expect(ids).toContain(NOTIF_IDS.weeklyTip);
    expect(ids).toContain(NOTIF_IDS.hourlyNews);
    expect(cancel).not.toHaveBeenCalled();
  });

  it('cancels the notifications whose prefs are off', async () => {
    await savePrefs({ weeklyNudge: false, safetyTips: true, hourlyNews: false });
    await ensureRecurring(true);
    const created = create.mock.calls.map((c) => c[0].id);
    expect(created).toContain(NOTIF_IDS.weeklyTip);
    expect(created).not.toContain(NOTIF_IDS.weeklyNudge);
    expect(created).not.toContain(NOTIF_IDS.hourlyNews);
    expect(cancel).toHaveBeenCalledWith(NOTIF_IDS.weeklyNudge);
    expect(cancel).toHaveBeenCalledWith(NOTIF_IDS.hourlyNews);
  });

  it('safety tip deep-links to the Medicine Reference screen', async () => {
    await savePrefs({ weeklyNudge: false, safetyTips: true, hourlyNews: false });
    await ensureRecurring(true);
    const tip = create.mock.calls.find((c) => c[0].id === NOTIF_IDS.weeklyTip);
    expect(tip[0].data.screen).toBe('MedicineScreen');
    expect(tip[0].title.length).toBeGreaterThan(0);
    expect(tip[0].body.length).toBeGreaterThan(0);
  });

  it('hourly update is an INTERVAL trigger that opens the news tab', async () => {
    await savePrefs({ weeklyNudge: false, safetyTips: false, hourlyNews: true });
    await ensureRecurring(true);
    const hourly = create.mock.calls.find(
      (c) => c[0].id === NOTIF_IDS.hourlyNews,
    );
    expect(hourly).toBeDefined();
    expect(hourly[0].data.screen).toBe('NotificationSettings');
    // Second arg is the trigger.
    expect(hourly[1].type).toBe(TriggerType.INTERVAL);
  });
});

describe('initRecurringOnce — schedules only once', () => {
  it('is a no-op on the second run', async () => {
    await initRecurringOnce();
    const firstCount = create.mock.calls.length;
    expect(firstCount).toBeGreaterThan(0);
    create.mockClear();
    await initRecurringOnce();
    expect(create).not.toHaveBeenCalled();
  });
});

describe('scheduleOnboardingIfNeeded', () => {
  it('schedules onboarding for a fresh install', async () => {
    await scheduleOnboardingIfNeeded();
    const ids = create.mock.calls.map((c) => c[0].id);
    expect(ids).toContain(NOTIF_IDS.onboarding);
  });

  it('does nothing once the user has engaged', async () => {
    await setHasEngaged();
    await scheduleOnboardingIfNeeded();
    expect(create).not.toHaveBeenCalled();
  });
});
