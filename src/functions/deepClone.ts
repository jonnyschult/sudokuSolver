import { Puzzle } from "../types";

const deepClone = (puzzle: Puzzle) => {
  let clone: Puzzle = [];
  puzzle.forEach((square) => {
    const values = [...square[Object.keys(square)[0]]];
    const newObj = { [Object.keys(square)[0]]: values };
    clone.push(newObj);
  });
  return clone;
};

export default deepClone;
