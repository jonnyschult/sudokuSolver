import { Puzzle, Square } from "../types";
// import inputsTemplate from "../tests/puzzleObj";

type fnType = (givenSquares: Square[]) => Puzzle;

const puzzleMaker: fnType = (givenSquares: Square[]) => {
  let puzzle: Puzzle = [...givenSquares];
  const givenSquaresKeys = givenSquares.map((square) => Object.keys(square)[0]);

  let colArr: string[] = "abcdefghi".split("");
  let row: number = 0;
  let col: number = 1;
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

export default puzzleMaker;
