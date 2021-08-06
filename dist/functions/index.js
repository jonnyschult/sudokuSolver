"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPuzzles = exports.deepClone = exports.puzzleMaker = exports.inferenceDS = void 0;
const inferenceDS_1 = __importDefault(require("./inferenceDS"));
exports.inferenceDS = inferenceDS_1.default;
const puzzleMaker_1 = __importDefault(require("./puzzleMaker"));
exports.puzzleMaker = puzzleMaker_1.default;
const deepClone_1 = __importDefault(require("./deepClone"));
exports.deepClone = deepClone_1.default;
const getPuzzles_1 = __importDefault(require("./getPuzzles"));
exports.getPuzzles = getPuzzles_1.default;
