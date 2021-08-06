import prompts from "prompts";
import { puzzleMaker } from "./functions";
import { Square } from "./types";

const cliInput: () => Promise<[string, boolean]> = async () => {
  const userInputs: string[] = [];
  const rows: any[] = [];
  const regEx = new RegExp(/^[1-9.]+$/);
  try {
    const program: { [key: string]: boolean } = await prompts({
      type: "select",
      name: "value",
      message: "Would you like to enter a puzzle, or test the program?",
      choices: [
        {
          title: "test",
          description:
            "Check results of this program against 1,000,000 sudoku puzzles and their solutions",
          value: true,
        },
        {
          title: "enter puzzle",
          description: "Manually enter a puzzle to be solved",
          value: false,
        },
      ],
      initial: 1,
    });
    if (program.value) {
      return ["", true];
    }

    console.log(
      "Please input your puzzle one row at a time (zero indexed 0-8). Place '.' for any unknown squares If you mess up, don't worry. You can change the rows later. Please only enter numbers."
    );
    for (let i = 0; i < 9; i++) {
      const input: { [key: string]: string } = await prompts({
        type: "text",
        name: `row${i}`,
        message: `Row ${i}: `,
        validate: (row) =>
          row.length !== 9
            ? `You have ${row.length} entries. Must have nine numbers`
            : !regEx.test(row)
            ? "You must only include numbers or '.'"
            : true,
      });
      userInputs.push(input[Object.keys(input)[0]]);

      let col = input[Object.keys(input)[0]].split("").map((inputVal) => {
        if (inputVal === ".") {
          return " ";
        }
        return +inputVal;
      });

      rows.push(col);
    }

    console.table(rows);

    const userConfirm: { [key: string]: boolean } = await prompts({
      type: "confirm",
      name: `confirm`,
      message: "Is the above puzzle correct? ",
    });

    let needsUpdated = !userConfirm.confirm;
    while (needsUpdated) {
      const rowInput: { [key: string]: number } = await prompts({
        type: "number",
        name: "index",
        message: "Which row (index 0-8) would you like to updated? ",
        validate: (row) =>
          row >= 0 && row <= 8 ? true : "Please select a number between 0-8.",
      });
      const newRow: { [key: string]: string } = await prompts({
        type: "text",
        name: "row",
        message: `Please provide input for row ${rowInput.index}`,
        validate: (row) =>
          row.length !== 9
            ? `${row.length} Entries is too short. Must have nine numbers`
            : !regEx.test(row)
            ? "You must only include numbers"
            : true,
      });

      rows[rowInput.index] = newRow[Object.keys(newRow)[0]].split("");
      console.table(rows);
      const reConfirm: { [key: string]: boolean } = await prompts({
        type: "confirm",
        name: `confirm`,
        message: "Is the above puzzle correct? ",
      });
      needsUpdated = !reConfirm.confirm;
    }
    const puzzleString = userInputs.flat().join("");
    return [puzzleString, false];
  } catch (error) {
    console.log("Aborted");
    return ["", false];
  }
};

export default cliInput;
