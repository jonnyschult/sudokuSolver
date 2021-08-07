const makePrintable = (puzzle: string) => {
  let tableArr: any[] = [];
  for (let i = 0; i < 9; i++) {
    let rowString = puzzle.slice(i * 9, i * 9 + 9);
    let rawRow = rowString.split("");
    let formattedRow = rawRow.map((strVal) => {
      if (strVal === "." || strVal === "0") {
        return 0;
      }
      return +strVal;
    });
    tableArr.push(formattedRow);
  }
  console.table(tableArr);
};

export default makePrintable;
