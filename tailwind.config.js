const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      keyframes: {
        barPulse: {
          '0%, 80%, 100%': { transform: 'scaleY(0.4)' },
          '40%': { transform: 'scaleY(1)' },
        },
      },
      animation: {
        bar1: 'barPulse 1s infinite',
        bar2: 'barPulse 1s infinite 0.2s',
        bar3: 'barPulse 1s infinite 0.4s',
      },
    },
  },
  plugins: [require('daisyui')],
};
