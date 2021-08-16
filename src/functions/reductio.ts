import { Puzzle, Section, Square } from "../types";
import inferenceDS from "./syllogizer";
import { deepClone } from ".";

const completeChecker: (puzzle: Puzzle) => boolean = (puzzle) => {
  let complete = true;
  for (const square of puzzle) {
    if (square[Object.keys(square)[0]].length > 1) {
      complete = false;
      break;
    }
  }
  return complete;
};

const validChecker: (puzzle: Puzzle) => boolean = (puzzle) => {
  let isValid = true;
  for (let i = 0; i < puzzle.length; i++) {
    const square = puzzle[i];
    if (square[Object.keys(square)[0]].length === 0) {
      isValid = false;
      break;
    }
    if (square[Object.keys(square)[0]].length === 1) {
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
      const determinedSquares = [...row, ...col, ...box].filter(
        (sectionSquare) =>
          sectionSquare[Object.keys(sectionSquare)[0]].length === 1 &&
          Object.keys(sectionSquare)[0] !== Object.keys(square)[0]
      );
      const unavailableValues = determinedSquares.map((determinedSquare) => {
        return determinedSquare[Object.keys(determinedSquare)[0]][0];
      });
      if (unavailableValues.includes(square[Object.keys(square)[0]][0])) {
        isValid = false;
        break;
      }
    }
  }
  return isValid;
};

const findAssumption: (puzzle: Puzzle) => [Square, number] = (puzzle) => {
  let shortestAssumption: Square = puzzle[0];
  let assumptionIndex = 0;
  for (const [index, square] of puzzle.entries()) {
    if (
      square[Object.keys(square)[0]].length > 1 &&
      square[Object.keys(square)[0]].length < 3
    ) {
      shortestAssumption = square;
      assumptionIndex = index;
      break;
    } else {
      if (
        square[Object.keys(square)[0]].length <
        shortestAssumption[Object.keys(shortestAssumption)[0]].length
      ) {
        shortestAssumption = square;
        assumptionIndex = index;
      }
    }
  }
  return [shortestAssumption, assumptionIndex];
};

const reductio: (
  puzzle: Puzzle,
  assumptions: Square[],
  puzzles: Puzzle[]
) => [Puzzle, boolean, string] = (puzzle, assumptions, puzzles) => {
  try {
    if (assumptions.length > 100) {
      return [puzzle, false, "Puzzle is not uniquely solvable."];
    }
    let isValid = validChecker(puzzle);
    const completed = completeChecker(puzzle);

    if (completed && isValid) {
      return [puzzle, isValid, "Solved!"];
    }
    if (isValid) {
      const [asmSquare, asmIndex] = findAssumption(puzzle);
      assumptions.push(asmSquare);
      let hypotheticalPuzzle = deepClone(puzzle);
      puzzles.push(hypotheticalPuzzle);
      hypotheticalPuzzle[asmIndex] = {
        [Object.keys(asmSquare)[0]]: [
          asmSquare[Object.keys(asmSquare)[0]][
            asmSquare[Object.keys(asmSquare)[0]].length - 1
          ],
        ],
      };
      hypotheticalPuzzle = inferenceDS(hypotheticalPuzzle);
      return reductio(hypotheticalPuzzle, assumptions, puzzles);
    } else {
      puzzles.pop();
      let currentAssumption = assumptions[assumptions.length - 1];
      let newAssumption: Square;
      if (currentAssumption[Object.keys(currentAssumption)[0]].length > 1) {
        newAssumption = {
          [Object.keys(currentAssumption)[0]]: currentAssumption[
            Object.keys(currentAssumption)[0]
          ].slice(0, -1),
        };
        assumptions.splice(-1, 1, newAssumption);
      } else {
        while (
          assumptions.length > 0 &&
          currentAssumption[Object.keys(currentAssumption)[0]].length === 1
        ) {
          puzzles.pop;
          assumptions.pop();
          currentAssumption = assumptions[assumptions.length - 1];
        }
        newAssumption = {
          [Object.keys(currentAssumption)[0]]: currentAssumption[
            Object.keys(currentAssumption)[0]
          ].slice(0, -1),
        };
        assumptions.splice(-1, 1, newAssumption);
      }
      let hypotheticalPuzzle = puzzles[puzzles.length - 1];
      const newAsmIndex =
        (+Object.keys(newAssumption)[0][1] - 1) * 9 +
        +Object.keys(newAssumption)[0][3] -
        1;
      hypotheticalPuzzle[newAsmIndex] = newAssumption;
      hypotheticalPuzzle = inferenceDS(hypotheticalPuzzle);
      return reductio(hypotheticalPuzzle, assumptions, puzzles);
    }
  } catch (error) {
    return [puzzle, false, "Puzzle is not valid."];
  }
};

export default reductio;
