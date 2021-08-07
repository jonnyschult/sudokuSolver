import { runTests, solver } from "./functions";
import inferenceReductio from "./functions/reductio";
import cliInput from "./cliInput";

const app = async () => {
  const input = await cliInput();
  if (input.program === "test") {
    runTests(input.numOfTests);
  } else {
    solver(input);
  }
};

app();
