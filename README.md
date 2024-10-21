# Sudoku Solver

## Description

This application is designed to solve any valid sudoku puzzle. It also comes with a testing option, which runs the program against puzzles with known solutions, and an option to solve Al Escargot, the hardest known sudoku puzzle. Explanation of logic and motivation is below.

Found an error or had a puzzle which stumped the algorithm? Contact me at jonny.nb.schult@gmail.com

## Using App

### Starting App

- Install dependencies
  - `npm install` or `yarn install`
- Application is built in TypeScript, so user has to build the dist folder
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
    - If incorrect, user can select a row (0-8) and re-enter value
  - Algorithm will then return one of three options
    - Solved puzzle if puzzle is solvable and valid
    - Message that puzzle is invalid
    - Message saying that puzzle is not well-formed (Not uniquely solvable)
- **Test**
  - Allows user to enter a number (1-1,000) which then randomly selects that number of puzzles from pool of 350,000
  - Returns puzzles numbers, computed solution and given solution and the number of tests passed
    - If a test fails, the program ends and the puzzle that causes the failure is console logged
  - Test puzzles come from [KyuByong Park on Kaggle](https://www.kaggle.com/bryanpark/sudoku)
    - I Reduced the csv file from 1,000,000 puzzles to 350,000 for GitHub limitation reasons
- **Solve Al Escargot**
  - Solves the Al Escargot puzzle, which is the hardest known puzzle
  - Returns solved puzzle and some info about Al Escargot

## Motivation

Earlier this year, I had a stint of interest in sudoku puzzles. While solving them, I recognized an inference pattern known as disjunctive syllogism. However, when working on harder or expert level puzzles, it seemed that disjunctive syllogism was no longer sufficient to infer the solutions of the puzzles. After performing all the possible disjunctive syllogisms on the puzzles, there remained options. The next step was to assume the value of a square and then perform the ensuing disjunctive syllogisms, making more assumptions as needed. If this pattern leads to a contradiction, you can infer that the assumed value cannot be correct and eliminate it. Glossing a bit, this process relies on indirect proof, also known as reductio ad absurdum. Indirect proof and disjunctive syllogism would seem to form the logical basis for sudoku puzzles. That is, all sudoku puzzles should be solvable by indirect proof and disjunctive syllogism. I wanted to test this algorithmically, so I decided to build this program. (note: this is not to say that disjunctive syllogism + indirect proof is the best or even only strategy to solve a sudoku. I merely mean to claim that it is a logically sufficient strategy to solve any sudoku.)

## Logic of the Algorithm

Below I give a gloss of the logic of the puzzle-solving method this program uses. It doesn't get super technical, and some assumptions are made for the sake of simplicity. Logic often requires a lot of explicit argumentation which I am forgoing.

### Logically Significant Concepts
#### Square
The square is the atomic element of a sudoku puzzle and holds the value which solves the puzzle. Any undetermined square holds 9 possible values: 1, 2, 3, 4, 5, 6, 7, 8, and 9. In terms of logical connections, we can think of this as a disjunction. Let "v" represent the "or" connective. So, we can think of each square that isn't already determined as

- Square: (1 v 2 v 3 v 4 v 5 v 6 v 7 v 8 v 9)

It is important to note that if we know a square is (3 v 4 v 9), this implies the square is (~1 & ~2 & ~5 & ~6 & ~7 & \~8), where "\~" denotes a negation, i.e. "~8" means not eight. This is equivalent to ~(1 v 2 v 5 v 6 v 7 v 8) by DeMorgans inference law. Essentially, a square is or isn't a specified value. If all we know is that a square is (1 v 2 v 3 v 4 v 5 v 6 v 7 v 9), then we know that the square is ~8.

#### Section
A section represents a logically interconnected group of squares. There are three types of sections: rows, columns and boxes. Each type has nine instances: rows 1-9, columns 1-9, and boxes 1-9. A completed section is a collection of distinct values 1-9. So, we can think of a section as

- Sections: (1 v 2 v 3 v 4 v 5 v 6 v 7 v 8 v 9) & (1 v 2 v 3 v 4 v 5 v 6 v 7 v 8 v 9). . .

Since a section can only hold unique values, we can know that if eight squares all hold ~8 as a value, then the remaining square must hold 8; 8 must go somewhere. So if the section looks like (square one: ~8, square two: ~8, square three: ~8, square four: ~8, square five: ~8,square six: ~8, square seven: ~8,square square eight: ~8), then we know that square nine: 8 is true. The uniqueness constraint on a section also implies that for any section, a number of squares could hold a value n, but not more than one. For instance, square one could be 8 and square two could be 8, but not both.

#### Puzzle
A puzzle is the total collection of sections and squares. It has 27 sections and 81 squares. It must hold 9 instances for each of the numbers 1-9.

### Rules of Inference

If you're familiar with rules of inference, or disjunctive syllogism and indirect proof, skip this section.

#### Disjunctive Syllogism
Disjunctive syllogism is an inference rule. In the philosophy of logic, an inference rule allows you to infer a conclusion from a statement or series of statements. For example, assume the following statement is true:

- A: Roses are red AND violets are blue.

From the inference rule of simplicity, and self evidently, we can infer:

- Therefore B: Roses are red

If A and B are true, A follows. Inference rules are logically proven to be truth preserving. That means, given true premises, using an inference rule will guarantee a true conclusion or inference. Disjunctive syllogism is an inference rule and it allows one to infer a conclusion from a series of disjuncts, or "or" statements. For example, assume the following statement is true:

- A: The greatest marathoner is Eliud Kipchoge or Kenenisa Bekele

Assume the following is true:

- B: The greatest marathoner is not Kenenisa Bekele

With disjunctive syllogism, we can infer:

- Therefore C: The greatest marathoner is Eliud Kipchoge

The truth of C is certain if A and B are true.

#### Indirect Proof
Indirect proof is an inference rule which requires an assumption. If an assumption necessarily leads to a contradiction, then that assumption must be false. Given the conceptual limitations of sudoku, this method can be clearly applied when a section holds more than one instance of any value 1-9.

### Logic of the Functions

The syllogizer and reductio functions are the essential logical functions of this algorithm and embody the abstract ideas which motivated this project. The syllogizer can be broken down into two functions which make it work, the prunerDS and asserterDS functions.

#### syllogizer
Both the asserterDS and prunerDS perform disjunctive syllogism on logically important parts of the puzzle. They work from different conceptual focal points. The prunerDS function takes a square, finds its associated sections' known values and then prunes what possibilities remain. We know that a section is composed of squares whose values are the numbers 1-9, each number only being used once. So, for each square with a known value, every other square in that section cannot hold that value.

For example, lets consider square r1c1b1, that is the square at the intersection of the first row (r1), column (c1), and box (b1). Lets say the puzzle we pass to the function doesn't have an assigned value for this square. So we can think of the square as this:

- square r1c1b1 = (1 v 2 v 3 v 4 v 5 v 6 v 7 v 8 v 9)

Naturally then, the associated sections are row one, column one and box one. Now, lets say row one has known values of 7 and 9, column one has 9, 3, and 5, and box one has 4. The sections for r1c1b1 contain known values of 7,9,3,5,4. Since each section cannot contain more than one unique value, we can infer that:

- square r1c1b1 = 1 v 2 v 6 v 8

Sometimes the sections may hold enough information to prune this down to one solution. So, prunerDS takes the square as fundamental and compares it with all associated sections and their known values. Pruning the options for each square makes asserterDS possible.

The asserterDS function, by comparison, takes an section as fundamental and then uses the possible values of the squares as a means to make an inference. For example, lets say we are looking at row one after it has gone through prunerDS and it's associated squares now look as follows:

- square r1c1b1 = 1
- square r1c2b1 = 9
- square r1c3b1 = 7
- square r1c4b2 = 3 v 5
- square r1c5b2 = 3 v 5
- square r1c6b2 = 2
- square r1c7b3 = 6
- square r1c8b3 = 4
- square r1c9b3 = 3 v 5 v 8

We can look at each square in the first 8 columns and realize that they all imply ~8. Perhaps prunerDS was sufficient to give us a single value for each square except r1c4b2, r1c5b2, and r1c9b3. And lets say that eight is a known value somewhere in b2, thus eliminating 8 as a possible value for r1c4b2 and r1c5b2. We know that 8 must go in one of the nine places. Thus, by disjunctive syllogism, we can see that 8 must go in r1c9b3. Each square without 8 as a possible or actual value essentially holds ~8. For example, this would mean that r1c1b1 is equivalent to:

- square r1c1b1 = 1 = (~2 & ~3 & ~4 & ~5 & ~6 & ~7 & ~8 & ~9) = ~(2 v 3 v 4 v 5 v 6 v 7 v 8 v 9)

Since each square implicitly holds ~ 8 except square r1c9b3, it must contain 8 by disjunctive syllogism. To paraphrase Sherlock Holmes, _eliminate the impossible and what remains must be truth_.

The syllogizer function tracks whether any changes were made to the puzzle when these functions are called on each square. Once it loops through the whole puzzle without making any changes, we know that the function has done all the work it can do and it returns the thoroughly syllogized puzzle. This is one place where the logical connection of the whole puzzle is essential, since each section could impact another section, we need to know if any part of the puzzle was changed.

#### reductio
For easy, medium and at least some hard puzzles (per the easybrain app), doing disjunctive syllogism enough times is sufficient to solve the puzzle. For harder, expert level puzzles, however, more is needed. The reductio function performs a sort of indirect proof on the squares of the puzzles to generate more known values.

Reductio takes three arguments, a puzzle, an assumptions array, and an array of hypothetical puzzle states. The function starts by ensuring that the puzzle passed to it is valid, by which I mean that the puzzle is not currently in an impossible state, or glossing, a contradiction, such as a row having two or more of the same number. If the puzzle is valid and incomplete, that is, has more than one possible answer on at least one square, then reductio proceeds to make an assumption. The assumption is a heuristic. It aims to make the best assumption possible given the hunch that the square with the least number of possible answers will be the best place to make an assumption. This isn't logically guaranteed, but it is a good starting point.

Once the assumption is made, the algorithm assigns it to a deep copy of the puzzle called hypotheticalPuzzle. That is, a deep copy of the puzzle is made, an assumption square is found, assigned an assumed value, and the hypothetical puzzle updates its instance of that square to the assumption. The hypotheticalPuzzle is then passed to the syllogizers. Once it's been syllogized, we make a recursive call to reductio, passing the hypotheticalPuzzle as the puzzle parameter, along with an array for tracking the assumption squares initial state and an array tracking the puzzle state. The hypotheticalPuzzle represents the scope of the assumption. It is a hypothetical scenario which can be terminated if the reductio sees it is in an impossible state. Given the recursive nature of reductio, hypotheticalPuzzles generate other hypotheticalPuzzles, thus ending up with nested scopes.

- Side note: The deep copy is necessary because if we were to simply update the puzzle passed as the argument to the function, it would change the value for the puzzle argument for every call of the recursive function. The puzzle is an array of squares, and an array is a reference type, thus it is stored in the heap, and the references all refer to that same address, thus changing the puzzle would change it in the heap and all references would then refer to that updated puzzle. The deep copy is essential because the array holds square objects, which are also reference types.

The recursive call then starts once again by checking the validity of the puzzle and whether it is complete. Three possible tracks are then available:

- If it is valid and complete, the function returns the puzzle and a boolean saying that it is valid. At each recursive call, when the function is returned, if the boolean is true, the hypotheticalPuzzle is assigned as the value of the puzzle, and returned. This culminates with the solved puzzle being returned through the stack.
- If the puzzle is valid but not complete, reductio generates another assumption and hypothetical puzzle, calls syllogizer again, and makes a recursive call.
- If it is invalid, then the function removes the bad hypotheticalPuzzle from the puzzles tracking array, thus removing one assumption scope from the reductio, the bad assumption is updated, either by moving to the next value for that square, or if all possible values for that square have already been shown to lead to a contradiction, then by moving back to where a new, untried assumption is possible, removing each hypotheticalPuzzle associated with that assumption along the way. Finally, with the new assumption, it creates a new hypotheticalPuzzle and calls syllogizer and makes another recursive call.

To make this a bit more explicit, here's an example. Suppose the puzzle has been syllogized and is now being passed to reductio. A square is found as a good place to start the assumption.

- ^ = assumed value for the square to be given to the hypotheticalPuzzle
- \* = tried, invalid value (a value that lead to an invalid hypotheticalPuzzle)
- HPn = hypotheticalPuzzle. N being the nth hypothetical puzzle generated.
- -> = recursive call to reductio

r2c3b1 = [2, **7^**] **HP1** -> VALID r7c4b8 = [3, **4^**] **HP2** -> VALID r6c9b6 = [8, **9^**] **HP3** -> VALID r4c4b5 = [3, **5^**] **HP4** -> invalid
- Mark r4c4b5's possible value 5 as invalid because it led to a contradiction and switch to checking its possible value 3.

r2c3b1 = [2, 7^] HP1 -> VALID r7c4b8 = [3, 4^] HP2 -> VALID r6c9b6 = [8, 9^] HP3 -> VALID r4c4b5 = [**3^**, 5*] **HP5** -> invalid
- 3 also leads to a contradiction and is thus invalid. Since both of these values are invalid, the assumption for this scope must be invalid. Remove scope, mark 9 as an invalid value for r6c9b6 and try another assumption, in this case 8.

r2c3b1 = [2, 7^] HP1 -> VALID r7c4b8 = [3, 4^] HP2 -> VALID r6c9b6 = [**8^**, 9*] **HP6** -> invalid
- Assuming 8 also leads to a contradiction, so 8 is an invalid value. Remove scope, remove 4 and try again.

r2c3b1 = [2, 7^] HP1 -> VALID r7c4b8 = [**3^**, 4*] **HP7** -> VALID r6c9b6 = [8, **9^**] **HP8** -> valid ...etc

This will continue until one of three things happen. First, the recursive call could make its way back to the initial assumption, showing that all values assumed were wrong. If this were the case, then we know the puzzle is invalid. This is because if all values cannot help but lead to a contradiction, i.e. a section with more than one of any number between 1-9, such as row one containing two 1s in it, then this square cannot contain any value. If we assume all possible values and they all lead to a contradiction, there is no possible value. If there is no possible value for a square, the puzzle is invalid. Second, this process could continue on until all squares are assumed, without contradiction, but the puzzle is thus not well-formed, that is, it is not uniquely solvable. Third, it runs until it finds a solution, returning the solved puzzle, which is what it is designed to do.

- Caveat, for the second option, there is another, disappointing, heuristic used. When the assumption array gets too large, the program returns that the puzzle is not well formed. The value of assumptions necessary to trigger this return is substantially higher than the number of assumptions needed to solve the hardest puzzle, but there is no logical or mathematical proof here.

## Auxiliary Info

This program only utilizes the prompts library as a dependency to make the user interface cleaner. It's a nice library. You can check them out [here](https://www.npmjs.com/package/prompts). There are more functions than just the sudoku-logic functions detailed above, but they merely make the program run smoother, perform specific tasks to complete the particular CLI commands, etc.

## Conclusion

This algorithm successfully solved 350,000 test puzzles and the hardest known sudoku. This provides inductively-based evidence that the logical principles structuring this algorithm are sufficient to solve any sudoku. Hypothetically, given what I know, a sudoku could require a number of assumptions large enough to exceed the call stack limit. I doubt this, and I would guess that no valid, well formed sudoku could require that many assumptions, but I cannot prove this. Someone probably could show this to be the case, but I did not in this algorithm. While this program can solve a sudoku and tell you that it is not valid, it cannot tell you that it is well formed, which is beyond the scope of the initial project.

Sudoku has turned out to be a richer and more interesting concept than I had initially anticipated. It was a lot of fun to build this app, and learning as I went along has been rewarding.
