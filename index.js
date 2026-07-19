/**
 * @format
 */

import { AppRegistry } from 'react-native';
import notifee, { EventType } from '@notifee/react-native';
import App from './App';
import { name as appName } from './app.json';

// Handle notification taps that occur while the app is in the background /
// quit. Deep-link routing itself happens on next foreground via
// getInitialNotification in App.tsx; this handler must exist so Notifee does
// not warn, and is where any background work (e.g. analytics) would go.
notifee.onBackgroundEvent(async ({ type }) => {
  // No-op: routing happens on next foreground via getInitialNotification in
  // App.tsx. A registered handler is still required so Notifee does not warn.
  if (type === EventType.PRESS) {
    // intentionally empty
  }
});

AppRegistry.registerComponent(appName, () => App);
