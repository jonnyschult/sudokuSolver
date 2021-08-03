"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winnowerDS = (section) => {
    let assumedVals = [];
    for (const square of section) {
        if (square[Object.keys(square)[0]].length === 1) {
            assumedVals.push(...square[Object.keys(square)[0]]);
        }
    }
    const inferredSection = section.map((square) => {
        if (square[Object.keys(square)[0]].length > 1) {
            const updatedVals = square[Object.keys(square)[0]].filter((num) => !assumedVals.includes(num));
            square[Object.keys(square)[0]] = updatedVals;
        }
        return square;
    });
    return inferredSection;
};
const assertDS = (winSect) => {
    const possibleVals = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    possibleVals.forEach((value) => {
        let numOfPossPlaces = 0;
        let possiblePlace = "";
        let indexValue = 0;
        for (const [i, square] of winSect.entries()) {
            if (square[Object.keys(square)[0]].includes(value) &&
                square[Object.keys(square)[0]].length === 1) {
                break;
            }
            if (square[Object.keys(square)[0]].includes(value)) {
                numOfPossPlaces++;
                possiblePlace = Object.keys(square)[0];
                indexValue = i;
            }
            if (numOfPossPlaces > 1) {
                break;
            }
            if (i === 8 && numOfPossPlaces === 1) {
                winSect[indexValue] = { [possiblePlace]: [value] };
            }
        }
    });
    return winSect;
};
const inferenceDS = (sectionedPuzzle) => {
    for (const section in sectionedPuzzle) {
        const winnowedSection = winnowerDS(sectionedPuzzle[section]);
        const updatedSection = assertDS(winnowedSection);
        sectionedPuzzle[section] = updatedSection;
    }
    return sectionedPuzzle;
};
exports.default = inferenceDS;
