import { Puzzle, Section, Square } from "../types";

const prunerDS: (
  square: Square,
  row: Section,
  col: Section,
  box: Section
) => [Square, boolean] = (square, row, col, box) => {
  let wasUpdated = false;
  const determinedSquares = [...row, ...col, ...box].filter(
    (sectionSquare) =>
      sectionSquare[Object.keys(sectionSquare)[0]].length === 1 &&
      Object.keys(sectionSquare)[0] !== Object.keys(square)[0]
  );
  const unavailableValues = determinedSquares.map((determinedSquare) => {
    return determinedSquare[Object.keys(determinedSquare)[0]][0];
  });
  const updatedSquareValues = square[Object.keys(square)[0]].filter(
    (number) => {
      if (unavailableValues.includes(number)) {
        wasUpdated = true;
        return false;
      } else return true;
    }
  );
  square[Object.keys(square)[0]] = updatedSquareValues;
  return [square, wasUpdated];
};

const asserterDS: (
  square: Square,
  row: Section,
  col: Section,
  box: Section
) => [Square, boolean] = (square, row, col, box) => {
  let updated = false;
  let rowVals = row
    .filter((rowSquare) => Object.keys(rowSquare)[0] !== Object.keys(square)[0])
    .map((rowSquare) => rowSquare[Object.keys(rowSquare)[0]])
    .flat();
  let colVals = col
    .filter((colSquare) => Object.keys(colSquare)[0] !== Object.keys(square)[0])
    .map((colSquare) => colSquare[Object.keys(colSquare)[0]])
    .flat();
  let boxVals = box
    .filter((boxSquare) => Object.keys(boxSquare)[0] !== Object.keys(square)[0])
    .map((boxSquare) => boxSquare[Object.keys(boxSquare)[0]])
    .flat();

  for (let num of square[Object.keys(square)[0]]) {
    if (
      !rowVals.includes(num) ||
      !colVals.includes(num) ||
      !boxVals.includes(num)
    ) {
      square[Object.keys(square)[0]] = [num];
      updated = true;
      break;
    }
  }
  return [square, updated];
};

const inferenceDS: (puzzle: Puzzle) => Puzzle = (puzzle) => {
  let puzzleUpdated = false;
  let firstPass = true;

  while (puzzleUpdated || firstPass) {
    let updatedThisLoop = false;

    for (let i = 0; i < puzzle.length; i++) {
      const square = puzzle[i];
      let row: Section = puzzle.filter(
        (puzzleSqr) =>
          +Object.keys(puzzleSqr)[0][1] === +Object.keys(square)[0][1]
      );
      let col: Section = puzzle.filter(
        (puzzleSqr) =>
          +Object.keys(puzzleSqr)[0][3] === +Object.keys(square)[0][3]
      );
      let box: Section = puzzle.filter(
        (puzzleSqr) =>
          +Object.keys(puzzleSqr)[0][5] === +Object.keys(square)[0][5]
      );
      if (square[Object.keys(square)[0]].length > 1) {
        const [assertedSquare, assertUpdated] = asserterDS(
          square,
          row,
          col,
          box
        );
        if (assertUpdated) {
          updatedThisLoop = true;
          puzzle[i] = assertedSquare;
        } else {
          const [prunedSquare, pruneUpdated] = prunerDS(
            assertedSquare,
            row,
            col,
            box
          );
          if (pruneUpdated) {
            updatedThisLoop = true;
            puzzle[i] = prunedSquare;
          }
        }
      }
    }

    puzzleUpdated = updatedThisLoop;
    firstPass = false;
  }
  return puzzle;
};

export default inferenceDS;
