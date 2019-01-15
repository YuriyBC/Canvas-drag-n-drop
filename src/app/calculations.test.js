const calculations = require('./calculations');

test('detectAvailableConnection returns boolean', () => {
    expect(calculations.detectAvailableConnection()).toBeFalsy();
    expect(calculations.detectAvailableConnection(null, {})).toBeFalsy();
    expect(calculations.detectAvailableConnection(0, null, undefined)).toBeFalsy();
    expect(calculations.detectAvailableConnection(450, {}, 1000)).toBeFalsy();
    expect(calculations.detectAvailableConnection({}, {}, {})).toBeFalsy();
});

test('isDraggingAllowed returns boolean', () => {
    expect(calculations.isDraggingAllowed()).toBeFalsy();
    expect(calculations.isDraggingAllowed(null, null, null, null, null)).toBeFalsy();
    expect(calculations.isDraggingAllowed({}, {}, {})).toBeFalsy();
    expect(calculations.isDraggingAllowed({}, {}, {})).toBeFalsy();
});

test('calculateConnectionPosition returns object', () => {
    const falseObject = {
        direction: null,
        height: null,
        width: null,
        x: null,
        y: null,
    };
    expect(calculations.calculateConnectionPosition()).toEqual(falseObject);
    expect(calculations.calculateConnectionPosition(null, null)).toEqual(falseObject);
    expect(calculations.calculateConnectionPosition({}, {})).toEqual(falseObject);
});
