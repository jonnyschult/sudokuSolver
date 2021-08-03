"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winnowerDS = (square, puzzle) => {
    let col = puzzle.filter((puzzleSqr) => +Object.keys(puzzleSqr)[0][3] === +Object.keys(square)[0][3]);
    let row = puzzle.filter((puzzleSqr) => +Object.keys(puzzleSqr)[0][1] === +Object.keys(square)[0][1]);
    let box = puzzle.filter((puzzleSqr) => +Object.keys(puzzleSqr)[0][5] === +Object.keys(square)[0][5]);
    console.log(box, row, col);
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
const syncer = () => { };
const inferenceDS = (puzzle) => {
    for (let i = 0; i < 1; i++) {
        const updatedPuzzle = winnowerDS(puzzle[i], puzzle);
        // const updatedSection = assertDS(winnowedSection);
        // sectionedPuzzle[section] = updatedSection;
        // console.log(`Box ${i + 1}:`, box);
    }
    return puzzle;
};
exports.default = inferenceDS;
