import { disInf, puzzleMaker, sectioner } from "./functions";
import inputs from "./inputs";
import { SectionedPuzzle, Square } from "./types";

const puzzle = puzzleMaker(inputs);
const sectionPuzzle = sectioner(puzzle);
const inferredPuzzle = disInf(sectionPuzzle);
