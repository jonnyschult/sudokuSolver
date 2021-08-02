"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sectioner = (puzzle) => {
    const box1 = puzzle.filter((square) => /(a|b|c)+(1|2|3)/.test(Object.keys(square)[0]));
    const box2 = puzzle.filter((square) => /(a|b|c)+(4|5|6)/.test(Object.keys(square)[0]));
    const box3 = puzzle.filter((square) => /(a|b|c)+(7|8|9)/.test(Object.keys(square)[0]));
    const box4 = puzzle.filter((square) => /(d|e|f)+(1|2|3)/.test(Object.keys(square)[0]));
    const box5 = puzzle.filter((square) => /(d|e|f)+(4|5|6)/.test(Object.keys(square)[0]));
    const box6 = puzzle.filter((square) => /(d|e|f)+(7|8|9)/.test(Object.keys(square)[0]));
    const box7 = puzzle.filter((square) => /(g|h|i)+(1|2|3)/.test(Object.keys(square)[0]));
    const box8 = puzzle.filter((square) => /(g|h|i)+(4|5|6)/.test(Object.keys(square)[0]));
    const box9 = puzzle.filter((square) => /(g|h|i)+(7|8|9)/.test(Object.keys(square)[0]));
    const row1 = puzzle.filter((square) => /a+\d/.test(Object.keys(square)[0]));
    const row2 = puzzle.filter((square) => /b+\d/.test(Object.keys(square)[0]));
    const row3 = puzzle.filter((square) => /c+\d/.test(Object.keys(square)[0]));
    const row4 = puzzle.filter((square) => /d+\d/.test(Object.keys(square)[0]));
    const row5 = puzzle.filter((square) => /e+\d/.test(Object.keys(square)[0]));
    const row6 = puzzle.filter((square) => /f+\d/.test(Object.keys(square)[0]));
    const row7 = puzzle.filter((square) => /g+\d/.test(Object.keys(square)[0]));
    const row8 = puzzle.filter((square) => /h+\d/.test(Object.keys(square)[0]));
    const row9 = puzzle.filter((square) => /i+\d/.test(Object.keys(square)[0]));
    const col1 = puzzle.filter((square) => /[a-z]+1/.test(Object.keys(square)[0]));
    const col2 = puzzle.filter((square) => /[a-z]+2/.test(Object.keys(square)[0]));
    const col3 = puzzle.filter((square) => /[a-z]+3/.test(Object.keys(square)[0]));
    const col4 = puzzle.filter((square) => /[a-z]+4/.test(Object.keys(square)[0]));
    const col5 = puzzle.filter((square) => /[a-z]+5/.test(Object.keys(square)[0]));
    const col6 = puzzle.filter((square) => /[a-z]+6/.test(Object.keys(square)[0]));
    const col7 = puzzle.filter((square) => /[a-z]+7/.test(Object.keys(square)[0]));
    const col8 = puzzle.filter((square) => /[a-z]+8/.test(Object.keys(square)[0]));
    const col9 = puzzle.filter((square) => /[a-z]+9/.test(Object.keys(square)[0]));
    return {
        box1,
        box2,
        box3,
        box4,
        box5,
        box6,
        box7,
        box8,
        box9,
        row1,
        row2,
        row3,
        row4,
        row5,
        row6,
        row7,
        row8,
        row9,
        col1,
        col2,
        col3,
        col4,
        col5,
        col6,
        col7,
        col8,
        col9,
    };
};
exports.default = sectioner;
