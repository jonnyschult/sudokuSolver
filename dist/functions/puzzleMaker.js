"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puzzleMaker = (givenSquares) => {
    let puzzle = [...givenSquares];
    const givenSquaresKeys = givenSquares.map((square) => Object.keys(square)[0]);
    let colArr = "abcdefghi".split("");
    let row = 0;
    let col = 1;
    for (let i = 0; i < 81; i++) {
        if (!givenSquaresKeys.includes(`${colArr[row]}${col}`)) {
            puzzle.push({
                [`${colArr[row]}${col}`]: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            });
        }
        col++;
        if (col > 9) {
            col = 1;
            row++;
        }
    }
    return puzzle;
};
exports.default = puzzleMaker;
