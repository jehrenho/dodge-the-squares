import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import path from 'path';
import commonjs from "@rollup/plugin-commonjs";
import json from '@rollup/plugin-json';

export default {
  input: 'client/src/game/game.ts',  // front-end entry point
  output: {
    file: path.resolve('client/public/dist/game.js'), // bundled JS
    format: 'iife',      // good for browsers
    sourcemap: true
  },
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    typescript(),
    json()
  ]
};
