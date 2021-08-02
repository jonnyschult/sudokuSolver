"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("./functions");
const inputs_1 = __importDefault(require("./inputs"));
const puzzle = functions_1.puzzleMaker(inputs_1.default);
const sectionPuzzle = functions_1.sectioner(puzzle);
const inferredPuzzle = functions_1.disInf(sectionPuzzle);
