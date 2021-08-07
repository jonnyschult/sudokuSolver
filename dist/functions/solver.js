"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const solver = async (input) => {
    const puzzle = _1.puzzleMaker(input.puzzle);
    const syllogizedPuzzle = _1.syllogizer(puzzle);
    const [solvedPuzzle, isValid, message] = _1.reductio(syllogizedPuzzle, [], [syllogizedPuzzle]);
    if (isValid) {
        const printablePuzzle = solvedPuzzle
            .map((square) => square[Object.keys(square)[0]])
            .join("");
        _1.printTable(printablePuzzle);
        console.log("This algorithm uses disjunctive syllogism and indirect proof (reductio ad absurdum) to solve puzzles. To learn more, see the README at https://github.com/jonnyschult/sudokuSolver.");
    }
    else {
        console.log(message, "Try running program again and entering a different puzzle.");
    }
    if (input.program === "AlEscargot") {
        console.log("For more on Al Escargot, see https://abcnews.go.com/blogs/headlines/2012/06/can-you-solve-the-hardest-ever-sudoku");
    }
};
exports.default = solver;
