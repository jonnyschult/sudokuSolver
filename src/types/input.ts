type input = {
  puzzle: string;
  program: "manual" | "test" | "AlEscargot" | "error";
  numOfTests: number;
  error?: any;
};
export default input;
