import { syllogizer, puzzleMaker, getPuzzles, reductio, printTable } from ".";

const runTests: (numOfTests: number) => void = async (numOfTests) => {
  console.log("Test starting");
  let validTests = true;
  const testPuzzlesInfo = await getPuzzles(numOfTests);
  console.log("Checking puzzles solutions against computed solutions");
  for (let [i, puzzleInfo] of testPuzzlesInfo.entries()) {
    const testPuzzle: string = puzzleInfo[0];
    const givenSolution = puzzleInfo[1];
    const puzzle = puzzleMaker(testPuzzle);
    const puzzleNumber = puzzleInfo[2];
    const syllogizedPuzzle = syllogizer(puzzle);
    const [solvedPuzzle, boolean] = reductio(
      syllogizedPuzzle,
      [],
      [syllogizedPuzzle]
    );
    const solvedPuzzleString = solvedPuzzle
      .map((square) => square[Object.keys(square)[0]])
      .join("");

    if (solvedPuzzleString !== givenSolution) {
      console.log(`Puzzle number ${puzzleNumber} failed tests.`);
      printTable(solvedPuzzleString);
      printTable(givenSolution);
      validTests = false;
      break;
    }
    console.log(`\nPuzzle number ${puzzleNumber}\n Computed solution:`);
    printTable(solvedPuzzleString);
    console.log(" Given solution:");
    printTable(givenSolution);
  }
  if (validTests) {
    console.log(
      `Test Completed. ${numOfTests}/${numOfTests} tests passed. Puzzles and solutions given by KyuByong Park at https://www.kaggle.com/bryanpark/sudoku.\nThis algorithm uses disjunctive syllogism and indirect proof (reductio ad absurdum) to solve puzzles. To learn more, see the README at https://github.com/jonnyschult/sudokuSolver.`
    );
  }
};

export default runTests;
