import { syllogizer, printTable, puzzleMaker, reductio } from ".";
import { input } from "../types";

const solver: (input: input) => void = async (input) => {
  const puzzle = puzzleMaker(input.puzzle);
  const syllogizedPuzzle = syllogizer(puzzle);
  const [solvedPuzzle, isValid, message] = reductio(
    syllogizedPuzzle,
    [],
    [syllogizedPuzzle]
  );

  if (isValid) {
    const printablePuzzle = solvedPuzzle
      .map((square) => square[Object.keys(square)[0]])
      .join("");
    printTable(printablePuzzle);
    console.log(
      "This algorithm uses disjunctive syllogism and indirect proof (reductio ad absurdum) to solve puzzles. To learn more, see the README at https://github.com/jonnyschult/sudokuSolver."
    );
  } else {
    console.log(
      message,
      "Try running program again and entering a different puzzle."
    );
  }
  if (input.program === "AlEscargot") {
    console.log(
      "For more on Al Escargot, see https://abcnews.go.com/blogs/headlines/2012/06/can-you-solve-the-hardest-ever-sudoku"
    );
  }
};

export default solver;
