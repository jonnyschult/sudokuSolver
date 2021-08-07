# Sudoku Solver

## Description

This application is designed to solve any valid sudoku puzzle. It also comes with a testing option to run the program against puzzles with known solutions and an option to solve Al Escargot, the hardest known sudoku puzzle. Explanation of logic and motivation is below.

README is still a work in progress.

Found an error, or had a puzzle which stumped the algorithm? Contact me at jonathon.schult@gmail.com

## Using App

### Starting App

- Install dependencies
  - `npm install` or `yarn install`
- Application is built in TypeScript, so we have to build the dist folder
  - `npm build` or `yarn build`
- Run the application
  - `npm start` or `yarn start`

This starts a series of CLI prompts.

### CLI options

- **Manually Enter Puzzle**
  - Allows user to enter a series of strings representing a sudoku puzzle row (indexed 0-8)
  - Valid strings allow for numbers 1-9 for known values and "." or 0 for unknown
  - Example rows:
    - 3.2...6..
    - 302000600
  - Once all 9 rows are entered, the user is asked to confirm the puzzle entered
    - If incorrect, user can select row (0-8) and re-enter value
  - Algorithm will then return one of three options
    - Solved puzzle if puzzle is solvable and valid
    - Message that puzzle is invalid
    - Message saying that puzzle is not uniquely determinable
- **Test**
  - Allows user to enter a number of test puzzles to run between 1-1,000 out of a pool of 350,000
  - Returns puzzles numbers, computed solution and given solution and tests passed
    - If a test fails, the program ends and the puzzle that causes the failure is console logged
  - Test puzzles come from [KyuByong Park on Kaggle](https://www.kaggle.com/bryanpark/sudoku)
    - I Reduced the csv file from 1,000,000 puzzles to 350,000 for GitHub limitation reasons
- **Solve Al Escargot**
  - Solves the Al Escargot puzzle, which is the hardest known puzzle
  - Returns solved puzzle and some info about Al Escargot

## Motivation

Earlier this year, I had a stint of interest in sudoku puzzles. While solving them, I recognized an inference pattern known as disjunctive syllogism. However, when I moved on to expert level puzzles, it seemed that disjunctive syllogism was no longer sufficient to infer the solutions of the puzzles. After performing all the possible disjunctive syllogisms on the puzzles, there remained options. The next step was to assume the value of a square and then perform more disjunctive syllogisms, and making more assumptions if needed. If this pattern leads to a contradiction, you can infer that the assumed value cannot be correct and eliminate it. This process is known as indirect proof or reductio ad absurdum. Indirect proof and disjunctive syllogism would seem to form the logical basis for sudoku puzzles. That is, all sudoku puzzles should be solvable by indirect proof and disjunctive syllogism. I wanted to test this algorithmically, so I decided to build this program.

## Logic of the Algorithm

### Logically Significant Concepts

**Square**
The square is the atomic element of a sudoku puzzle and holds the value which solves the puzzle. Any undetermined square holds 9 possible values: 1, 2, 3, 4, 5, 6, 7, 8, and 9. In terms of logical connections, we can think of this as a disjunction. Let "v" represent the or connective. So, we can think of each square that isn't already determined as

- Square: 1 v 2 v 3 v 4 v 5 v 6 v 7 v 8 v 9

**Section**
A section represents a logically interconnected group of squares. There are three types of sections, rows, columns and boxes. Each type has nine instances, rows 1-9, columns 1-9, and boxes 1-9. A completed section is a collection of distinct values 1-9. So, we can think of a section as

- Sections: 1 & 2 & 3 & 4 & 5 & 6 & 7 & 8 & 9

**Puzzle**
A puzzle is the total collection of sections and squares. 27 sections and 81 squares. Obviously that means that a puzzle will have 9 of each value 1-9.

### Rules of Inference

If you're familiar with rules of inference, or disjunctive syllogism and indirect proof, skip this section.

**Disjunctive Syllogism**
Disjunctive syllogism is an inference rule. In the philosophy of logic, an inference rule allows you to infer a conclusion from a statement or series of statements. For example, assume the following statement is true:

- A: Roses are red AND violets are blue.

From the inference rule of simplicity, and self evidently, we can see that we can infer

- Therefore B: Roses are red

If A and B, A follows. Inference rules are logically proven to be truth preserving. That means, given true premises, using the rules of inference one can infer a true conclusion. Disjunctive syllogism is an inference rule and it allows one to infer a conclusion from a series of disjuncts, or "or" statements. For example, assume the following statement is true:

- A: The greatest marathoner is Eliud Kipchoge or Kenenisa Bekele

Assume the following is true

- B: The greatest marathoner is not Kenenisa Bekele

With disjunctive syllogism, we can infer:

- Therefore C: The greatest marathoner is Eliud Kipchoge

The truth of C is certain if A and B are true.

**Indirect Proof**
Indirect proof is a method of inference which relies on making an assumption, deriving a contradiction, then asserting the negation of that assumption. It is taken as primitive that a contradiction cannot be true. Thus, if an assumption necessarily leads to a contradiction, then that assumption must be false. Given the conceptual limitations of sudoku, this method can be clearly applied.

### Logic of the Functions

The syllogizer and reductio functions are the essential logical functions of this algorithm and embody the abstract ideas which motivated this project. The syllogizer can be broken down into two functions which make it work, the prunerDS and asserterDS functions.

**syllogizer**  
Both the asserterDS and prunerDS are disjunctive syllogizers, but work from different conceptual focal points. The prunerDS function takes a square, finds its associated sections' known values and then prunes what possibilities remain. We know that a section is composed of squares whose values are the numbers 1-9, each number only being used once. So, for each known value in square, Every other square in that section cannot hold that value.
For example, lets consider square r1c1b1, that is the square which is at the intersection of the first row, column, and box. And lets say the puzzle we pass to the function doesn't have an assigned value for this square. So we can think of the square as this:

- square r1c1b1 = 1 v 2 v 3 v 4 v 5 v 6 v 7 v 8 v 9

Naturally then, the associated sections are row one, column one and box one. Now, lets say row one has know values of 7 and 9, column one has 9, 3, and 5 and box one has 4. The sections for r1c1b1 contain known values of 7,9,3,5,4. Since each section cannot contain more than one unique value, we can infer that square one is:

- square r1c1b1 = 1 v 2 v 6 v 8

Sometimes the sections may hold enough information to prune this down to one solution. In this case, that is not true, but eliminating five values is a big improvement. So, prunerDS takes the square as fundamental and compares it with all associated sections and their known values.  
The asserterDS function, by comparison, takes an section as fundamental and then uses the possible values of the squares as a means to make an inference. For example, lets say we are looking at row one and it's associated squares look as follows:

- square r1c1b1 = 1
- square r1c2b1 = 3 v 5
- square r1c3b1 = 7
- square r1c4b2 = 9
- square r1c5b2 = 3 v 5
- square r1c6b2 = 2
- square r1c7b3 = 6
- square r1c8b3 = 4
- square r1c9b3 = 3 v 5 v 8

We can look at each square in the first 8 columns and realize that they all imply ~8 (not 8). We know that 8 must go in one of the nine places. Thus, by disjunctive syllogism we can see that 8 must go in r1c9b3. Everywhere else is saying "not here". To paraphrase Sherlock Holmes, _eliminate the impossible and what remains must be truth_.  
The syllogizer function tracks whether any changes were made to the puzzle when these functions are called on each square. Once it loops through the whole puzzle without making any changes, we know that the function has done all the work it can do and it returns the thoroughly syllogized puzzle.

**reductio**  
For easy, medium and at least some hard puzzles (rankings from sudoku.com), doing disjunctive syllogism enough times is sufficient to solve the puzzle. For harder, expert level puzzles, however, more is needed. The reductio function performs a sort of indirect proof on the squares of the puzzles to generate more known values.

The function starts by ensuring that the puzzle is valid, by which I mean that the puzzle does not currently hold an impossible state, or glossing, a contradiction, such as a row having two or more of the same number. If the puzzle is valid and incomplete, that is, has more than one possible answer on at least one square, then reductio proceeds to make an assumption. The assumption is a heuristic. It aims to make the best assumption possible given the hunch that the square with the least number of possible answers will be the best place to make an assumption. This isn't logically guaranteed, but it is a good rule of thumb.

Once the assumption is made, the algorithm assigns it to a deep copy of the puzzle called hypotheticalPuzzle. The deep copy is necessary because it is bad practice to mutate the initial puzzle and the puzzle value at every level of the call stack, which is what would happen if you altered the puzzle, which is an array and thus a reference type. The hypotheticalPuzzle is then passed to the syllogizer. Once it's been syllogized, we make a recursive call to reductio, passing the hypotheticalPuzzle as the puzzle parameter, along with an array for tracking the assumption squares initial state and an array tracking the puzzle state.

The recursive call then starts once again with checking the validity of the puzzle and then whether it is complete. If it is valid and complete the function returns the puzzle and a boolean saying that it is valid. At each function call that returned hypotheticalPuzzle is then assigned as the value of the puzzle, and returned. If it is invalid, then the function removes the bad hypotheticalPuzzle from the puzzles tracking array, the bad assumption is updated, either by moving to the next value for that square, or if that one has already been shown to lead to a contradiction, then by moving back to where a new, untried assumption is possible, removing each hypotheticalPuzzle associated with that assumption along the way. Finally, with the new assumption, it creates a new hypotheticalPuzzle and calls syllogizer and makes another recursive call.

To make this a bit more explicit, heres an example. Suppose the puzzle has been syllogized and is now being passed to reductio. A square is found as a good place to start the assumption.

- ^ = assumed value for the square to be given to the hypotheticalPuzzle
- \* = tried, invalid valid (value that lead to an invalid hypotheticalPuzzle)
- HP = hypotheticalPuzzle.
- -> = recursive call to reductio

r2c3b1 = [2, 7^] HP1 -> Valid r7c4b8 = [3, 4^] HP2 -> valid r6c9b6 = [8, 9^] HP3 -> valid r4c4b5 = [3, 5^] HP4 -> invalid

r2c3b1 = [2, 7^] HP1 -> Valid r7c4b8 = [3, 4^] HP2 -> valid r6c9b6 = [8, 9^] HP3 -> valid r4c4b5 = [3^, 5*] HP5 -> invalid

r2c3b1 = [2, 7^] HP1 -> Valid r7c4b8 = [3, 4^] HP2 -> valid r6c9b6 = [8^, 9*] HP6 -> invalid

r2c3b1 = [2, 7^] HP1 -> Valid r7c4b8 = [3^, 4*] HP7 -> valid r6c9b6 = [8, 9^] HP8 -> valid ...etc

This will continue on until one of three things happen. First, the recursive call could make its way back to the initial assumption, showing that both assumptions were wrong. If this were the case, then we know the puzzle is invalid. This is because if both values cannot help but lead to a contradiction, i.e. a section with more than one of any number between 1-9, such as row one containing two 1s in it, then this square cannot contain any value. If we assume all possible values and they all lead to a contradiction, there is no possible value. If there is no possible value for a square, the puzzle is invalid. Second, this process could continue on until all squares are assumed, without contradiction, but the puzzle is thus not well-formed, that is, it is not uniquely solvable. Caveat, there is another, disappointing heuristic here. When the assumption array gets too large, the program returns that the puzzle is not well formed. The value of assumptions necessary to trigger this return is substantially higher than the number of assumptions needed to solve the hardest puzzle, but there is not logical or mathematical proof here. Third, it runs until it finds a solution, returning the solved puzzle, which is what it is designed to do.

This algorithm can solve any sudoku currently known, based on 350,000 tests. Hypothetically, given what I know, a sudoku could require a number of assumptions large enough to exceed the call stack limit. I doubt this, and I would guess that no valid, well formed sudoku could require that many assumptions, but I cannot prove this. Someone probably could show this to be the case, but I did not in this algorithm. While this program can solve a sudoku, and tell you that it is not valid, it cannot tell you that it is well formed. It could solve a puzzle which has more than one answer. I believe this would be easily enough solvable. It would require making a minimal inference in reductio, as oppose to running until finding a solution. So, have reductio only assert values when all other alternatives have shown to be a contradiction. It would then not be able to fill in every square for a non-well-formed puzzle, because not enough assumption would lead to a contradiction. Thus the algorithm would run until there were no more assumptions to try. This, however, is beyond the scope of my initial project.

## Auxiliary Info

This program only utilizes one library, which is prompts, to make the user interface cleaner. It's a nice library. You can check them out [here](https://www.npmjs.com/package/prompts). There are more functions than just the sudoku-logic functions detailed above, but they merely make the program run smoother, perform specific tasks to complete the particular CLI commands, etc.

## Conclusion

I had no prior experience with sudoku before deciding to build this app. It was a lot of fun to build and the literature on sudoku is interesting. Only after having built the algorithm just to solve a puzzle did the desire to make it able to test whether or not a puzzle is well-formed come upon to me, mainly because I just hadn't thought of it. Perhaps this extension will happen in the future. There is a lot more to learn about sudoku, and some of it may be necessary to make this a richer, handier app.
