import fs from "fs";
import path from "path";

const getPuzzles: (numOfTests: number) => Promise<[string, string, number][]> =
  async (numOfTests) => {
    const data = fs.readFileSync(path.resolve("testSudokus.csv"), "utf8");
    var dataArray = data.split(/\r?\n/);
    const allPuzzlesAndSolutions = dataArray.map((str) => str.split(","));
    let testPuzzlesInfo = [];
    for (let i = 0; i < numOfTests; i++) {
      const randomIndex = Math.floor(Math.random() * 500001);
      let testPuzzleInfo: [string, string, number] = [
        allPuzzlesAndSolutions[i][0],
        allPuzzlesAndSolutions[i][1],
        randomIndex,
      ];
      testPuzzlesInfo.push(testPuzzleInfo);
    }
    return testPuzzlesInfo;
  };

export default getPuzzles;
