import { inferenceDS, puzzleMaker } from "./functions";
import inferenceReductio from "./functions/inferenceReduction";
import inputs from "./inputs";

const puzzle = puzzleMaker(inputs);
const syllogizedPuzzle = inferenceDS(puzzle);
const answeredPuzzle = inferenceReductio(syllogizedPuzzle);
