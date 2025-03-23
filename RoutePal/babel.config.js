module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@storage': './node_modules/@react-native-async-storage/async-storage',
        },
      },
    ],
  ],
};
