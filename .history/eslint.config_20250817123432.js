// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    // Ignore build output and editor history snapshots that should not be linted
    ignores: ['dist/*', '.history/**'],
    rules: {
      // Allow R3F JSX intrinsic props (position, args, etc.) which default React plugin flags
      'react/no-unknown-property': 'off',
    },
  },
]);
