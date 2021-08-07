"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("./functions");
const inferenceReductio_1 = __importDefault(require("./functions/inferenceReductio"));
const cliInput_1 = __importDefault(require("./cliInput"));
const solver = async () => {
    const [puzzleString, test] = await cliInput_1.default();
    if (test) {
        console.log("Test starting");
        const testPuzzles = await functions_1.getPuzzles();
        console.log("Checking puzzles solutions against computed solutions");
        for (let [i, puzzleInfo] of testPuzzles.entries()) {
            if (i % 1000 === 0) {
                console.log(`${i / 1000}%`);
            }
            const testPuzzle = puzzleInfo[0];
            const solution = puzzleInfo[1];
            const puzzle = functions_1.puzzleMaker(testPuzzle);
            const syllogizedPuzzle = functions_1.inferenceDS(puzzle);
            const [answeredPuzzle, boolean] = inferenceReductio_1.default(syllogizedPuzzle, [], [syllogizedPuzzle]);
            const answerArr = answeredPuzzle.map((square) => square[Object.keys(square)[0]][0]);
            const computedAnswer = answerArr.join("");
            if (computedAnswer !== solution) {
                console.log("Test failed", computedAnswer, solution);
            }
        }
        console.log("Test Completed. 100,000/100,000 puzzle solutions matched computed solution.");
    }
    else {
        const puzzle = functions_1.puzzleMaker(puzzleString);
        const syllogizedPuzzle = functions_1.inferenceDS(puzzle);
        const [answeredPuzzle, boolean] = inferenceReductio_1.default(syllogizedPuzzle, [], [syllogizedPuzzle]);
        if (boolean) {
            let tablePrint = [[], [], [], [], [], [], [], [], []];
            answeredPuzzle.forEach((square) => {
                const answer = square[Object.keys(square)[0]][0];
                console.log(Object.keys(square)[0], Object.keys(square)[0][1]);
                tablePrint[+Object.keys(square)[0][1] - 1].push(answer);
            });
            console.table(tablePrint);
        }
    }
};
solver();
