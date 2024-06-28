/** @type {import('tailwindcss').Config} */

const commonSpace = Array.from({ length: 32 }).reduce((map, _, index) => {
  map[index * 2] = `${index * 2}px`;
  return map;
}, {});

const commonLength = Array.from({ length: 500 }).reduce((map, _, index) => {
  map[index] = `${index}px`;
  return map;
}, {});

// const colors = ['blue-grey', 'grey', 'primary', 'error', 'success', 'warn'].reduce((map, curItem, index) => {
//   Array.from({ length: 11 }).forEach((t, i) => {
//     map[curItem + '-' + (i + 1)] = `var(--v-color-${curItem}-${i + 1})`;
//   });
//   return map;
// }, {});

module.exports = {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  corePlugins: {
    // Avoid conflicts with antd
    preflight: false,
  },
  plugins: [
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/aspect-ratio'),
    // require('@tailwindcss/forms'),
  ],
  theme: {
    spacing: {
      1: '1px',
    },
    extend: {
      borderRadius: commonSpace,
      padding: commonSpace,
      margin: commonSpace,
      fontSize: commonSpace,
      width: commonLength,
      height: commonLength,
      maxWidth: commonLength,
      maxHeight: commonLength,
      // colors: colors,
    },
  },
};
