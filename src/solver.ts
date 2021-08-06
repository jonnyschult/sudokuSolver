import { inferenceDS, puzzleMaker, deepClone, getPuzzles } from "./functions";
import inferenceReductio from "./functions/inferenceReductio";
import cliInput from "./cliInput";

const solver = async () => {
  const [puzzleString, test] = await cliInput();
  if (test) {
    const testPuzzles = await getPuzzles();
    console.log("Test starting");
    for (let [i, puzzleInfo] of testPuzzles.entries()) {
      if (i % 1000 === 0) {
        console.log(`%{i / 10000}%`);
      }
      const testPuzzle = puzzleInfo[0];
      const solution = puzzleInfo[1];
      const puzzle = puzzleMaker(testPuzzle);
      const syllogizedPuzzle = inferenceDS(puzzle);
      const [answeredPuzzle, boolean] = inferenceReductio(
        syllogizedPuzzle,
        [],
        [syllogizedPuzzle]
      );
      const answerArr = answeredPuzzle.map(
        (square) => square[Object.keys(square)[0]][0]
      );
      const computedAnswer = answerArr.join("");
      if (computedAnswer !== solution) {
        console.log("Test failed", computedAnswer, solution);
      }
    }
    console.log("Test Completed. No error found");
  } else {
    const puzzle = puzzleMaker(puzzleString);
    const syllogizedPuzzle = inferenceDS(puzzle);
    const [answeredPuzzle, boolean] = inferenceReductio(
      syllogizedPuzzle,
      [],
      [syllogizedPuzzle]
    );

    if (boolean) {
      let tablePrint: number[][] = [[], [], [], [], [], [], [], [], []];
      answeredPuzzle.forEach((square) => {
        const answer: number = square[Object.keys(square)[0]][0];
        console.log(Object.keys(square)[0], Object.keys(square)[0][1]);
        tablePrint[+Object.keys(square)[0][1] - 1].push(answer);
      });
      console.table(tablePrint);
    }
  }
};

solver();
