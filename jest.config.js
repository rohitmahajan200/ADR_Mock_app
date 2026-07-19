module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/jest.setup.js'],
  // The RN preset's default transform omits `.jsx`; specify transforms
  // explicitly so .jsx screens are compiled and image assets still stub out.
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    '^.+\\.(bmp|gif|jpg|jpeg|mp4|png|psd|svg|webp|ttf|otf|m4v|mov|mp3|wav|aac|aiff|caf)$':
      'react-native/jest/assetFileTransformer.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(' +
      '@react-native|react-native|' +
      '@react-navigation|' +
      '@notifee/react-native|' +
      '@react-native-async-storage|' +
      '@react-native-community|' +
      '@react-native-picker|' +
      'react-native-safe-area-context|' +
      'react-native-screens' +
      ')/)',
  ],
};
