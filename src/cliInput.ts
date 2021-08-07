import prompts from "prompts";
import { printTable } from "./functions";
import { input } from "./types";

const cliInput: () => Promise<input> = async () => {
  try {
    const program: { [key: string]: string } = await prompts({
      type: "select",
      name: "value",
      message:
        "Would you like to enter a puzzle, test the program, or solve the worlds hardest sudoku?",
      choices: [
        {
          title: "Manually enter puzzle",
          description: "Manually enter a puzzle to be solved",
          value: "manual",
        },
        {
          title: "Test",
          description:
            "Randomly select up too 1000 puzzles, out of 500,000, to test this program. Computed solutions are compared to known solutions.",
          value: "test",
        },
        {
          title: "Solve Al Escargot",
          description: "Al Escargot is the hardest known puzzle.",
          value: "AlEscargot",
        },
      ],
      initial: 0,
    });

    if (program.value === "test") {
      const numOfTests: { [key: string]: number } = await prompts({
        type: "number",
        name: `amount`,
        message: "How many tests (1-1,000) would you like to run? ",
        validate: (num) =>
          num < 1 || num > 1000 ? `${num} is not between 1 and 1,000.` : true,
      });
      return {
        puzzle: "na",
        program: "test",
        numOfTests: numOfTests.amount,
      };
    }

    if (program.value === "AlEscargot") {
      const alEscargot =
        "8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4..";
      printTable(alEscargot);
      console.log(
        "The world's hardest sudoku was invented by mathematician Dr. Arto Inkala. According to him, it would take humans 'days' to solve this puzzle by logic alone."
      );
      return {
        puzzle: alEscargot,
        program: "AlEscargot",
        numOfTests: 0,
      };
    } else {
      const userInputs: string[] = [];
      const regEx = new RegExp(/^[0-9.]+$/);

      console.log(
        "Please input your puzzle one row at a time (zero indexed 0-8). Place '.' or 0 for any unknown squares. If you mess up, don't worry. You can change the rows later. Please only enter numbers or '.'."
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
      }

      printTable(userInputs.flat().join(""));

      const userConfirm: { [key: string]: boolean } = await prompts({
        type: "confirm",
        name: `confirm`,
        message: "Is the above puzzle correct? ",
        initial: true,
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
              ? "You must only include numbers or '.'"
              : true,
        });

        userInputs[rowInput.index] = newRow.row;
        printTable(userInputs.flat().join(""));

        const reConfirm: { [key: string]: boolean } = await prompts({
          type: "confirm",
          name: `confirm`,
          message: "Is the above puzzle correct? ",
          initial: true,
        });
        needsUpdated = !reConfirm.confirm;
      }
      const puzzleString = userInputs.flat().join("");
      return {
        puzzle: puzzleString,
        program: "manual",
        numOfTests: 0,
      };
    }
  } catch (error) {
    console.log("Aborted");
    return { puzzle: "na", program: "error", numOfTests: 0, error: error };
  }
};

export default cliInput;
