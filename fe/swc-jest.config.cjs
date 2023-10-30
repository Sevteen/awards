// swc-jest.config.cjs
const { createTransformer } = require('@swc/jest');

module.exports = createTransformer({
  // Konfigurasi SWC di sini
  module: {
    type: 'commonjs',
  },
  jsc: {
    externalHelpers: false,
    parser: {
      syntax: 'typescript',
      tsx: true,
      decorators: true,
    },
  },
});
