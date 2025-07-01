module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.js', 
    '!src/reportWebVitals.js', 
    '!src/setupTests.js', 
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/reportWebVitals.js',
    'src/setupTests.js',
  ],
  coverageReporters: ['lcov', 'text', 'clover'], 
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    'node_modules/(?!(swiper|ssr-window|dom7)/)',
  ],
};