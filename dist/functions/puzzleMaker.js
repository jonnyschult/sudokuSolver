"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puzzleMaker = (puzzleString) => {
    let puzzle = [];
    let row = 1;
    let col = 1;
    let box = 1;
    for (let i = 0; i < 81; i++) {
        if (puzzleString[i] === "." || puzzleString[i] === "0") {
            puzzle.push({
                [`r${row}c${col}b${box}`]: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            });
        }
        else {
            puzzle.push({
                [`r${row}c${col}b${box}`]: [+puzzleString[i]],
            });
        }
        col++;
        if (col > 9) {
            col = 1;
            row++;
        }
        if ((i + 1) % 3 === 0) {
            if (box === 3 && row < 4) {
                box = 1;
            }
            else if (box === 6 && row < 7) {
                box = 4;
            }
            else if (box === 9 && row <= 9) {
                box = 7;
            }
            else
                box++;
        }
    }
    const sortedPuzzle = puzzle.sort((squareA, squareB) => {
        if (Object.keys(squareA) < Object.keys(squareB)) {
            return -1;
        }
        else
            return 1;
    });
    return sortedPuzzle;
};
exports.default = puzzleMaker;
