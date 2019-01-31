import {
    detectAvailableConnection,
    isDraggingAllowed,
    calculateConnectionPosition,
} from './calculations';


test('detectAvailableConnection returns boolean', () => {
    expect(detectAvailableConnection()).toBeFalsy();
    expect(detectAvailableConnection(null, {})).toBeFalsy();
    expect(detectAvailableConnection(0, null, undefined)).toBeFalsy();
    expect(detectAvailableConnection(450, {}, 1000)).toBeFalsy();
    expect(detectAvailableConnection({}, {}, {})).toBeFalsy();
});

test('isDraggingAllowed returns boolean', () => {
    expect(isDraggingAllowed()).toBeFalsy();
    expect(isDraggingAllowed(null, null, null, null, null)).toBeFalsy();
    expect(isDraggingAllowed({}, {}, {})).toBeFalsy();
    expect(isDraggingAllowed({}, {}, {})).toBeFalsy();
});

test('calculateConnectionPosition returns object', () => {
    const falseObject = {
        direction: null,
        height: null,
        width: null,
        x: null,
        y: null,
    };
    expect(calculateConnectionPosition()).toEqual(falseObject);
    expect(calculateConnectionPosition(null, null)).toEqual(falseObject);
    expect(calculateConnectionPosition({}, {})).toEqual(falseObject);
});
