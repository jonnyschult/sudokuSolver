import { Section, SectionedPuzzle, Square } from "../types";

const disjSyllogizer = (section: Square[]) => {
  let assumedVals: number[] = [];
  for (const square of section) {
    if (square[Object.keys(square)[0]].length === 1) {
      assumedVals.push(...square[Object.keys(square)[0]]);
    }
  }

  const inferredSection = section.map((square) => {
    if (square[Object.keys(square)[0]].length > 1) {
      const updatedVals = square[Object.keys(square)[0]].filter(
        (num: number) => !assumedVals.includes(num)
      );
      square[Object.keys(square)[0]] = updatedVals;
    }
    return square;
  });

  return inferredSection;
};

const synchronizer = (
  syllogizedSect: Section,
  currentSecPuzl: SectionedPuzzle
) => {
  const updatedSquares = syllogizedSect.map((square) => Object.keys(square)[0]);
  for (const section in currentSecPuzl) {
    const syncedSect: Section = currentSecPuzl[section].map((square) => {
      if (updatedSquares.includes(Object.keys(square)[0])) {
        const returnVal = syllogizedSect.filter(
          (sylSquare) => Object.keys(sylSquare)[0] === Object.keys(square)[0]
        )[0];
        return returnVal;
      } else {
        return square;
      }
    });
    currentSecPuzl[section] = syncedSect;
  }
  return currentSecPuzl;
};

const disInf = (sectionedPuzzle: SectionedPuzzle) => {
  for (let i = 1; i < 100; i++) {
    for (const section in sectionedPuzzle) {
      const updatedSection = disjSyllogizer(sectionedPuzzle[section]);
      sectionedPuzzle[section] = updatedSection;
      const syncedPuzzle = synchronizer(updatedSection, sectionedPuzzle);
      sectionedPuzzle = syncedPuzzle;
    }
  }
  for (const section in sectionedPuzzle) {
    console.log(sectionedPuzzle[section]);
  }
};

export default disInf;
