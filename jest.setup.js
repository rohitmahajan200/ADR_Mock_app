/* Jest mocks for native modules so components/services can be tested in Node. */

// Notifee — official jest mock (all methods stubbed).
jest.mock('@notifee/react-native', () =>
  require('@notifee/react-native/jest-mock'),
);

// AsyncStorage — in-memory jest mock.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Safe-area context — keep the real named exports (React Navigation imports
// SafeAreaInsetsContext by name) but stub the native-backed inset hook.
jest.mock('react-native-safe-area-context', () => {
  const actual = jest.requireActual('react-native-safe-area-context');
  const insets = { top: 0, left: 0, right: 0, bottom: 0 };
  const frame = { x: 0, y: 0, width: 320, height: 640 };
  return {
    ...actual,
    initialWindowMetrics: { insets, frame },
    useSafeAreaInsets: () => insets,
    useSafeAreaFrame: () => frame,
  };
});

// Filesystem + PDF viewer — stubbed so the PDF flow imports cleanly in Node.
jest.mock('react-native-fs', () => ({
  CachesDirectoryPath: '/caches',
  DocumentDirectoryPath: '/docs',
  MainBundlePath: '/bundle',
  exists: jest.fn(async () => false),
  unlink: jest.fn(async () => {}),
  copyFileAssets: jest.fn(async () => {}),
  copyFile: jest.fn(async () => {}),
}));

jest.mock('react-native-file-viewer', () => ({ open: jest.fn(async () => {}) }));
