const utils = require('./utils');

// utils.js
test('adds 1, 99, getRandomNumberBetween return > 0 and < 100', () => {
    expect(utils.getRandomNumberBetweenMinMax(1, 99)).toBeGreaterThan(0);
    expect(utils.getRandomNumberBetweenMinMax(1, 99)).toBeLessThan(100);
});


test('getRandomColor return string with 7 length', () => {
    expect(utils.getRandomColor().length).toBe(7);
});
