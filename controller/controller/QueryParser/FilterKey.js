"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Key_1 = require("./Key");
const OP_1 = require("./OP");
const KeyValidator_1 = require("./KeyValidator");
class FilterKey extends Key_1.Key {
    constructor(key) {
        super(key);
        this.GetFindAll = () => {
            return this.findAll;
        };
        this.GetOps = () => {
            return this.ops;
        };
        this.FindWholeComparison = (chunk) => {
            let count = 0;
            const chunkLength = chunk.length;
            const wholeComparison = [];
            while (count < chunkLength) {
                let currentWord = chunk[count];
                if (currentWord.charAt(0) === "\"" && count === 0) {
                    currentWord = currentWord.substring(1);
                }
                if (currentWord.charAt(currentWord.length - 1) === "\"") {
                    const lastString = currentWord.substring(0, currentWord.length - 1);
                    wholeComparison.push(lastString);
                    return wholeComparison;
                }
                else {
                    wholeComparison.push(currentWord);
                    count++;
                }
            }
            const failedComparison = ["failed comparison!"];
            return failedComparison;
        };
        this.IsFindAll = (key) => {
            if (key.length >= 3) {
                if (key[0] === "find" && key[1] === "all" && key[2] === "entries") {
                    return true;
                }
            }
            return false;
        };
        this.IsFindEntriesWhose = (key) => {
            if (key.length > 3) {
                if (key[0] === "find" && key[1] === "entries" && key[2] === "whose") {
                    return true;
                }
            }
            return false;
        };
        this.isMOP = (key) => {
            const M_OP = [
                "is", "not", "greater", "less", "than", "equal", "to"
            ];
            return true;
        };
        this.isSOP = (key) => {
            const S_OP = [
                "is", "not", "includes", "does", "include",
                "begins", "does", "begin", "ends", "does", "end", "with"
            ];
            return true;
        };
        this.getNextMOP = (chunk) => {
            const expectedFilterKey = [
                "Average", "is", "greater", "than", "90", "and",
                "Department", "is", "\"adhe\"", "or", "Average", "is", "equal", "to", "95"
            ];
            const key = chunk[0];
            let i = 1;
            const op = [];
            let comparison;
            let nextOP = "";
            let length = 5;
            if (chunk.length < 5) {
                throw new Error("Invalid M_OP. Please ensure that all key words are included");
            }
            if (chunk[i] === "is") {
                i++;
            }
            else {
                throw new Error("Invalid M_OP. Could not detect 'is' key");
            }
            if (chunk[i] === "not") {
                op.push(chunk[i]);
                length = length + 1;
                i++;
            }
            if (chunk[i] === "greater" || chunk[i] === "less") {
                op.push(chunk[i]);
                i++;
                if (chunk[i] !== "than") {
                    throw new Error("Invalid M_OP. could not detect 'than' after 'greater' or 'less'");
                }
                else {
                    i++;
                }
            }
            else if (chunk[i] === "equal") {
                op.push(chunk[i]);
                i++;
                if (chunk[i] !== "to") {
                    throw new Error("Invalid M_OP. could not detect 'to' after 'equal'");
                }
                else {
                    i++;
                }
            }
            else {
                throw new Error("Invalid M_OP. 'is' must be followed by 'greater', 'less', or 'equal'");
            }
            comparison = Number(chunk[i]);
            if (isNaN(+comparison)) {
                throw new Error("Invalid M_OP. ensure that the M_CRITERIA includes a number");
            }
            const maxIndex = chunk.length - 1;
            if (maxIndex > i) {
                i++;
                length = length + 1;
                if (chunk[i] === "and") {
                    nextOP = "and";
                }
                else if (chunk[i] === "or") {
                    nextOP = "or";
                }
                else {
                    throw new Error("Invalid M_OP. ensure that filter operations are separated by 'and' or 'or'");
                }
            }
            return new OP_1.OP(key, op, comparison, length, nextOP);
        };
        this.getNextSOP = (chunk) => {
            const expectedFilterKey = [
                "Department", "is", "\"adhe\"", "or", "Average", "is", "equal", "to", "95"
            ];
            const nextWordExists = (index, chunkLength) => {
                if (index < chunkLength) {
                    return true;
                }
                else {
                    return false;
                }
            };
            let key;
            let i = 0;
            const op = [];
            let comparison = "";
            let nextOP = "";
            let length;
            key = chunk[i];
            i++;
            if (nextWordExists(i, chunk.length)) {
                switch (chunk[i]) {
                    case "is": {
                        op.push(chunk[i]);
                        i++;
                        if (nextWordExists(i, chunk.length)) {
                            if (chunk[i] === "not") {
                                op.push(chunk[i]);
                                i++;
                            }
                        }
                        break;
                    }
                    case "includes": {
                        op.push(chunk[i]);
                        i++;
                        break;
                    }
                    case "begins": {
                        op.push(chunk[i]);
                        i++;
                        if (nextWordExists(i, chunk.length)) {
                            if (chunk[i] === "with") {
                                op.push(chunk[i]);
                                i++;
                            }
                            else {
                                throw new Error("Invalid S_OP. found 'begins' but not 'with'");
                            }
                        }
                        break;
                    }
                    case "ends": {
                        op.push(chunk[i]);
                        i++;
                        if (nextWordExists(i, chunk.length)) {
                            if (chunk[i] === "with") {
                                op.push(chunk[i]);
                                i++;
                            }
                            else {
                                throw new Error("Invalid S_OP. found 'ends' but not 'with'");
                            }
                        }
                        break;
                    }
                    case "does": {
                        op.push(chunk[i]);
                        i++;
                        if (nextWordExists(i, chunk.length)) {
                            if (chunk[i] === "not") {
                                op.push(chunk[i]);
                                i++;
                                if (nextWordExists(i, chunk.length)) {
                                    if (chunk[i] === "include") {
                                        op.push(chunk[i]);
                                        i++;
                                    }
                                    else if (chunk[i] === "begin" || chunk[i] === "end") {
                                        op.push(chunk[i]);
                                        i++;
                                        if (nextWordExists(i, chunk.length)) {
                                            if (chunk[i] === "with") {
                                                op.push(chunk[i]);
                                                i++;
                                            }
                                        }
                                    }
                                    else {
                                        throw new Error("invalid S_OP. 'does not' is not followed by a valid keyword");
                                    }
                                }
                                else {
                                    throw new Error("invalid S_OP. filter terminates after 'does not'");
                                }
                            }
                            else {
                                throw new Error("Invalid S_OP. 'does' is not immediately followed by 'not'");
                            }
                        }
                        else {
                            throw new Error("Invalid S_OP. filter key terminates after 'does'");
                        }
                        break;
                    }
                    default: {
                        throw new Error("Invalid S_OP. ensure that a valid S_OP is being used (case sensitive)");
                    }
                }
                if (nextWordExists(i, chunk.length)) {
                    const expectedString = Number(chunk[i]);
                    if (isNaN(+expectedString)) {
                        const restOfChunk = chunk.slice(i, chunk.length);
                        const comparisonPieces = this.FindWholeComparison(restOfChunk);
                        const comparisonSize = comparisonPieces.length;
                        comparisonPieces.forEach((piece) => {
                            const newStr = (piece + " ");
                            comparison = comparison.concat(newStr.toString());
                        });
                        comparison = comparison.slice(0, -1);
                        i = i + comparisonSize;
                        if (nextWordExists(i, chunk.length)) {
                            if (chunk[i] === "and" || chunk[i] === "or") {
                                nextOP = chunk[i];
                                i++;
                            }
                            else {
                                throw new Error("Invalid S_CRITERIA. invalid contents found after the comparison string"
                                    + " " + this.getWords() +
                                    " current comparison is: " + comparison
                                    + " current index is: " + i
                                    + " max index is: " + key.length);
                            }
                        }
                    }
                    else {
                        throw new Error("Invalid S_CRITERIA. value after the S_OP is a number instead of string.");
                    }
                }
                else {
                    throw new Error("Invalid S_CRITERIA. unable to find a string after the S_OP");
                }
            }
            else {
                throw new Error("Invalid S_CRITERIA. unable to find the S_OP after the S_KEY");
            }
            length = i;
            return new OP_1.OP(key, op, comparison, length, nextOP);
        };
        this.ops = [];
        let currentChunk = key;
        let parsedWords = 0;
        this.findAll = this.IsFindAll(currentChunk);
        if (this.findAll === false) {
            if (this.IsFindEntriesWhose(currentChunk) === false) {
                throw new Error("FILTER error: expected either 'find all entries' or 'find entries whose'");
            }
            currentChunk = currentChunk.slice(3, key.length);
            parsedWords = 3;
            const maxIndex = key.length;
            while (KeyValidator_1.default.IsMkey(currentChunk[0]) || KeyValidator_1.default.IsSkey(currentChunk[0])) {
                if (KeyValidator_1.default.IsMkey(currentChunk[0])) {
                    try {
                        const currentMOP = this.getNextMOP(currentChunk);
                        this.ops.push(currentMOP);
                        currentChunk = currentChunk.slice(currentMOP.GetLength(), currentChunk.length);
                        parsedWords = parsedWords + currentMOP.GetLength();
                    }
                    catch (error) {
                        throw error;
                    }
                }
                else if (KeyValidator_1.default.IsSkey(currentChunk[0])) {
                    try {
                        const currentSOP = this.getNextSOP(currentChunk);
                        this.ops.push(currentSOP);
                        currentChunk = currentChunk.slice(currentSOP.GetLength(), currentChunk.length);
                        parsedWords = parsedWords + currentSOP.GetLength();
                    }
                    catch (error) {
                        throw error;
                    }
                }
            }
            if (parsedWords !== maxIndex) {
                throw new Error("Invalid FILTER key: parsedWords is: " + parsedWords + " while maxIndex is: " + maxIndex);
            }
        }
    }
}
exports.FilterKey = FilterKey;
//# sourceMappingURL=FilterKey.js.map