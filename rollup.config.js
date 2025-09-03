import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import path from 'path';

export default {
  input: 'client/src/game/game.ts',  // front-end entry point
  output: {
    file: path.resolve('client/public/dist/game.js'), // bundled JS
    format: 'iife',      // good for browsers
    sourcemap: true
  },
  plugins: [
    resolve(),
    typescript({ tsconfig: './tsconfig.json' })
  ]
};
