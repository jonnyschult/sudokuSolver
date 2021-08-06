import { Puzzle, Square } from "../types";
import inputs from "../inputs";

type fnType = (puzzleString: string) => Puzzle;

const puzzleMaker: fnType = (puzzleString) => {
  let puzzle: Puzzle = [];
  let row: number = 1;
  let col: number = 1;
  let box: number = 1;
  for (let i = 0; i < 81; i++) {
    if (puzzleString[i] === "." || puzzleString[i] === "0") {
      puzzle.push({
        [`r${row}c${col}b${box}`]: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      });
    } else {
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
      } else if (box === 6 && row < 7) {
        box = 4;
      } else if (box === 9 && row <= 9) {
        box = 7;
      } else box++;
    }
  }
  const sortedPuzzle = puzzle.sort((squareA, squareB) => {
    if (Object.keys(squareA) < Object.keys(squareB)) {
      return -1;
    } else return 1;
  });
  return sortedPuzzle;
};

export default puzzleMaker;
