module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native|@react-navigation|@firebase|firebase|react-native-image-picker|react-native-safe-area-context|react-native-screens)/)',
  ],
  moduleNameMapper: {
    '^@react-native-async-storage/async-storage$':
      '<rootDir>/node_modules/@react-native-async-storage/async-storage/jest/async-storage-mock.js',
    '^@react-native-clipboard/clipboard$':
      '<rootDir>/node_modules/@react-native-clipboard/clipboard/jest/clipboard-mock.js',
    '^@react-native-community/geolocation$':
      '<rootDir>/__mocks__/geolocation.js',
  },
};
