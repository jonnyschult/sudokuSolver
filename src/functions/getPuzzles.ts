import fs from "fs";
import path from "path";

const getPuzzles: () => Promise<string[][]> = async () => {
  const data = fs.readFileSync(path.resolve("sudoku.csv"), "utf8");
  var dataArray = data.split(/\r?\n/);
  const puzzlesAndSolutions = dataArray.map((str) => str.split(","));
  return puzzlesAndSolutions;
};

export default getPuzzles;
