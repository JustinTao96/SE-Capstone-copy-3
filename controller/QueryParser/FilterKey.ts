import { Key } from "./Key";
import { OP } from "./OP";
import KeyValidator from "./KeyValidator";

export class FilterKey extends Key {
    /*  const expectedFilterKey: string[] = [
        "find", "entries", "whose", "Average", "is", "greater", "than", "90", "and",
        "Department", "is", "\"adhe\"", "or", "Average", "is", "equal", "to", "95"];
    */

    protected findAll: boolean;
    protected ops: OP[];

    constructor(key: string[])  {
        super(key);

        // initializing ops
        this.ops = [];
        let currentChunk: string[] = key;
        let parsedWords: number = 0;

        this.findAll = this.IsFindAll(currentChunk);

        if (this.findAll === false) {

            if (this.IsFindEntriesWhose(currentChunk) === false) {
                throw new Error("FILTER error: expected either 'find all entries' or 'find entries whose'");
            }
            currentChunk = currentChunk.slice(3, key.length);

            // will continue trying to get more ops until there are no more ops left.

            parsedWords = 3;
            const maxIndex: number = key.length;

            while (KeyValidator.IsMkey(currentChunk[0]) || KeyValidator.IsSkey(currentChunk[0])) {
                if (KeyValidator.IsMkey(currentChunk[0])) {
                    try {
                        const currentMOP: OP = this.getNextMOP(currentChunk);
                        this.ops.push(currentMOP);
                        currentChunk = currentChunk.slice(currentMOP.GetLength(), currentChunk.length);
                        parsedWords = parsedWords + currentMOP.GetLength();

                    } catch (error) {
                        throw error;
                    }

                } else if (KeyValidator.IsSkey(currentChunk[0])) {
                    try {
                        const currentSOP: OP = this.getNextSOP(currentChunk);
                        this.ops.push(currentSOP);
                        currentChunk = currentChunk.slice(currentSOP.GetLength(), currentChunk.length);
                        parsedWords = parsedWords + currentSOP.GetLength();

                    } catch (error) {
                        throw error;
                    }

                }
            }

            // checking to make sure that the entire key has been parsed:
            if (parsedWords !== maxIndex) {
                throw new Error (
                    "Invalid FILTER key: parsedWords is: " + parsedWords + " while maxIndex is: " + maxIndex);
            }
        }
    }

    public GetFindAll = (): boolean => {
        return this.findAll;
    }

    public GetOps = (): OP[] => {
        return this.ops;
    }

    // ["\"barker,", "john\"", "and"]
    private FindWholeComparison = (chunk: string[]): string[] => {
        let count: number = 0;
        const chunkLength = chunk.length;
        const wholeComparison: string[] = [];

        while (count < chunkLength) {
            let currentWord = chunk[count];

            // if \" is found at the start of the first string, remove the \":
            if (currentWord.charAt(0) === "\"" && count === 0) {
                currentWord = currentWord.substring(1);
            }

            // if there is a \" at the last char, you are at the end of the comparison
            if (currentWord.charAt(currentWord.length - 1) === "\"") {

                // remove the \" and add the last string to the wholeComparison;
                const lastString = currentWord.substring(0, currentWord.length - 1);
                wholeComparison.push(lastString);

                // the function should return the wholeComparison here;
                // throw new Error("findwholecomparison trying to return with: " + wholeComparison);
                return wholeComparison;

            // if you are not at the end of the comparison, add currentWord to wholeComparison.
            } else {
                wholeComparison.push(currentWord);
                count++;
            }
        }

        const failedComparison = ["failed comparison!"];
        return failedComparison;
    }

    private IsFindAll = (key: string[]): boolean => {
        if (key.length >= 3) {

            if (key[0] === "find" && key[1] === "all" && key[2] === "entries") {
                return true;
            }
        }
        return false;
    }

    private IsFindEntriesWhose = (key: string[]): boolean => {
        if (key.length > 3) {

            if (key[0] === "find" && key[1] === "entries" && key[2] === "whose") {
                return true;
            }
        }
        return false;
    }

    private isMOP = (key: string): boolean => {
        const M_OP: string[] = [
            "is", "not", "greater", "less", "than", "equal", "to"];

        return true;
    }

    private isSOP = (key: string): boolean => {
        const S_OP: string[] = [
            "is", "not", "includes", "does", "include",
            "begins", "does", "begin", "ends", "does", "end", "with"];

        return true;
    }

    private getNextMOP = (chunk: string[]): OP => {
        // minimum length of a mop is 5: average is greater than 90.
        // maximum length of a mop is 7: pass is not less than 85 and.
        const expectedFilterKey: string[] = [
            "Average", "is", "greater", "than", "90", "and",
            "Department", "is", "\"adhe\"", "or", "Average", "is", "equal", "to", "95"];

        const key: string = chunk[0];
        let i: number = 1;
        const op: string[] = [];
        let comparison: number;
        let nextOP: string = "";
        let length: number = 5;

        if (chunk.length < 5) {
            throw new Error("Invalid M_OP. Please ensure that all key words are included");
        }

        // check for "is"
        if (chunk[i] === "is") {
           i++; //  i = 2
        } else {
            throw new Error("Invalid M_OP. Could not detect 'is' key");
        }

        // check if next word is "not".
        if (chunk[i] === "not") {
            op.push(chunk[i]);
            length = length + 1;
            i++; // i = 2 or 3
        }

        // Checking for greater than, less than, or equal to:
        // if the next string is "greater" or "less", ensure string after is "than".
        if (chunk[i] === "greater" || chunk[i] === "less" ) {
            op.push(chunk[i]);
            i++; // i = 3 or 4

            if (chunk[i] !== "than") {
                throw new Error("Invalid M_OP. could not detect 'than' after 'greater' or 'less'");
            } else {
                i++; // i = 4 or 5
            }

            // if the next string is "equal", ensure string after is "to".
        } else if (chunk[i] === "equal") {
            op.push(chunk[i]);
            i++; // i = 3 or 4

            if (chunk[i] !== "to") {
                throw new Error("Invalid M_OP. could not detect 'to' after 'equal'");
            } else {
                i++; // i = 4 or 5
            }
            // if the next string is not greater, less, or equal, throw error.
        } else {
            throw new Error("Invalid M_OP. 'is' must be followed by 'greater', 'less', or 'equal'");
        }

        // ensure that next string is a number
        comparison = Number(chunk[i]);
        if ( isNaN(+comparison)) {
            throw new Error("Invalid M_OP. ensure that the M_CRITERIA includes a number");
        }

        // check if there is anything after the number
        const maxIndex = chunk.length - 1;
        if (maxIndex > i) {
            i++; // i = 5 or 6
            length = length + 1;

            // check if there is an "and" or an "or" after the number
            if (chunk[i] === "and") {
                nextOP = "and";
            } else if (chunk[i] === "or") {
                nextOP = "or";
            } else {
                throw new Error ("Invalid M_OP. ensure that filter operations are separated by 'and' or 'or'");
            }
        }
        return new OP(key, op, comparison, length, nextOP);
    }

    private getNextSOP = (chunk: string[]): OP => {
        const expectedFilterKey: string[] = [
            "Department", "is", "\"adhe\"", "or", "Average", "is", "equal", "to", "95"];

        const nextWordExists = (index: number, chunkLength: number) => {
            if (index < chunkLength) {
                return true;
            } else {
                return false;
            }
        };

        let key: string;
        let i: number = 0;
        const op: string[] = [];
        let comparison: string = "";
        let nextOP: string = "";
        let length: number;

        // the first value of the chunk has to be the key (already been checked)
        key = chunk[i]; // setting the value of the KEY
        i++; // i = 1;

        // ensure that the chunk length is 2 or more
        if (nextWordExists(i, chunk.length)) {

            switch (chunk[i]) {

                case "is": {
                    op.push(chunk[i]); // adding "is" to op;
                    i++; // i = 2;

                    if (nextWordExists(i, chunk.length)) {

                        if (chunk[i] === "not") {
                            op.push(chunk[i]); // adding "not" to op;
                            i++; // i = 3;
                        }
                    }
                    break;
                }

                case "includes": {
                    op.push(chunk[i]); // adding "includes" to op;
                    i++; // i = 2;
                    break;
                }

                case "begins": {
                    op.push(chunk[i]); // adding "begins" to op;
                    i++; // i = 2;

                    if (nextWordExists(i, chunk.length)) {

                        if (chunk[i] === "with") {
                            op.push(chunk[i]); // adding "with" to op;
                            i++; // i = 3;

                        } else {
                            throw new Error("Invalid S_OP. found 'begins' but not 'with'");
                        }
                    }
                    break;
                }

                case "ends": {
                    op.push(chunk[i]); // adding "ends" to op;
                    i++; // i = 2;

                    if (nextWordExists(i, chunk.length)) {

                        if (chunk[i] === "with") {
                            op.push(chunk[i]); // adding "with" to op;
                            i++; // i = 3;

                        } else {
                            throw new Error("Invalid S_OP. found 'ends' but not 'with'");
                        }
                    }
                    break;
                }

                case "does": {
                    op.push(chunk[i]); // adding "does" to op;
                    i++; // i = 2;

                    if (nextWordExists(i, chunk.length)) {

                        if (chunk[i] === "not") {
                            op.push(chunk[i]); // adding "not" to op'
                            i++; // i = 3;

                            // ensure that the next word is either "begin" "end" or "include".
                            if (nextWordExists(i, chunk.length)) {

                                if (chunk[i] === "include") {
                                    op.push(chunk[i]); // adding "include" to op.
                                    i++; // i = 4

                                } else if (chunk[i] === "begin" || chunk[i] === "end") {
                                    op.push(chunk[i]); // adding "begin", "end", or "include" to op.
                                    i++; // i = 4

                                    if (nextWordExists(i, chunk.length)) {
                                        if (chunk[i] === "with") {
                                            op.push(chunk[i]); // adding "with" to op'
                                            i++; // i = 5;
                                        }
                                    }
                                } else {
                                    throw new Error("invalid S_OP. 'does not' is not followed by a valid keyword");
                                }
                            } else {
                                throw new Error("invalid S_OP. filter terminates after 'does not'");
                            }
                        } else {
                            throw new Error("Invalid S_OP. 'does' is not immediately followed by 'not'");
                        }
                    } else {
                        throw new Error("Invalid S_OP. filter key terminates after 'does'");
                    }
                    break;
                }

                default: {
                   throw new Error("Invalid S_OP. ensure that a valid S_OP is being used (case sensitive)");
                }
             }

            // at this point, i should be the index of the comparison string.
            if (nextWordExists(i, chunk.length)) {
                const expectedString = Number(chunk[i]);

                if ( isNaN(+expectedString)) {
                    // BUG FIX STARTING HERE
                    // at this point, i is the index of the first comparison string

                    // it will return an array that stores the entire name
                    const restOfChunk = chunk.slice(i, chunk.length);
                    const comparisonPieces: string[] = this.FindWholeComparison(restOfChunk);
                    const comparisonSize = comparisonPieces.length;

                    // add each comparisonPiece into the comparisons string.
                    comparisonPieces.forEach((piece) => {
                        const newStr: string = (piece + " ");
                        comparison = comparison.concat(newStr.toString());
                    });
                    // removing the extra white space from the end of comparison
                    comparison = comparison.slice(0, -1);

                    // BUG FIX ENDS HERE:
                    i = i + comparisonSize; // i is now the next word after the comparison

                    if (nextWordExists(i, chunk.length)) {
                        // check to see if the next value is "and" or "or"
                        if (chunk[i] === "and" || chunk[i] === "or") {
                            nextOP = chunk[i]; // setting the nextOP value
                            i++; // i is now anywhere from 4-6

                        } else {
                            throw new Error(
                                "Invalid S_CRITERIA. invalid contents found after the comparison string"
                                + " " + this.getWords() +
                                " current comparison is: " + comparison
                                + " current index is: " + i
                                + " max index is: " + key.length);
                        }
                    }

                } else {
                    throw new Error("Invalid S_CRITERIA. value after the S_OP is a number instead of string.");
                }

            } else {
                throw new Error("Invalid S_CRITERIA. unable to find a string after the S_OP");
            }

        } else {
            throw new Error("Invalid S_CRITERIA. unable to find the S_OP after the S_KEY");
        }

        length = i; // setting the value of length to be the index
        return new OP(key, op, comparison, length, nextOP);
    }
}
