import { defineConfig } from 'rollipop';

export default defineConfig({
  plugins: [
    {
      name: 'node-repro',
      config(config) {
        // Run the bundle in Node without React Native's native initialization.
        config.prelude = [];
        config.polyfills = [];
      },
    },
  ],
});
