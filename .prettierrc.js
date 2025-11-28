/** @type {import("prettier").Config} */
module.exports = {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 80,
  tabWidth: 2,
  endOfLine: 'auto',
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindFunctions: ['clsx', 'tw'],
};
