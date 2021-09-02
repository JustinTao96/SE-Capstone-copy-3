"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const KeyValidator_1 = require("./KeyValidator");
class ParseHelper {
    static GetChunk(currentIndex, key) {
        if ((key.length - 1) === currentIndex) {
            return [key[currentIndex]];
        }
        let i = currentIndex;
        const keysToShow = [];
        while (i < key.length) {
            const word = key[i];
            if (this.EndsWithComma(word) === true) {
                const newWord = word.substring(0, word.length - 1);
                if (KeyValidator_1.default.IsMkey(newWord) || KeyValidator_1.default.IsSkey(newWord)) {
                    keysToShow.push(newWord);
                }
                else {
                    throw new Error("invalid MKEY or SKEY");
                }
                i = i + 1;
            }
            else {
                if (KeyValidator_1.default.IsMkey(word) === true || KeyValidator_1.default.IsSkey(word) === true) {
                    keysToShow.push(word);
                }
                else {
                    throw new Error("second last key does not end with comma but is invalid");
                }
                if (i + 2 === key.length - 1) {
                    const secondWord = key[i + 1];
                    const thirdWord = key[i + 2];
                    if (secondWord !== "and") {
                        throw new Error("expected 'and'");
                    }
                    if (KeyValidator_1.default.IsMkey(thirdWord) || KeyValidator_1.default.IsSkey(thirdWord)) {
                        keysToShow.push(thirdWord);
                    }
                    else {
                        throw new Error("the word after 'and' is not a valid key" + ": " + thirdWord);
                    }
                }
                else if (i !== key.length - 1) {
                    throw new Error("final sequence is not KEY + 'and' + KEY");
                }
                i = key.length;
                return keysToShow;
            }
        }
    }
    static GetAggregateChunk(currentIndex, key) {
        if ((key.length - 1) === currentIndex) {
            return [key[currentIndex]];
        }
        let i = currentIndex;
        const keysToShow = [];
        while (i < key.length) {
            const word = key[i];
            if (this.EndsWithComma(word) === true) {
                const newWord = word.substring(0, word.length - 1);
                keysToShow.push(newWord);
                i = i + 1;
            }
            else {
                keysToShow.push(word);
                if (i + 2 === key.length - 1) {
                    const secondWord = key[i + 1];
                    const thirdWord = key[i + 2];
                    if (secondWord !== "and") {
                        throw new Error("expected 'and'");
                    }
                    if (this.EndsWithComma(thirdWord)) {
                        const thirdRemovedComma = thirdWord.slice(0, -1);
                        keysToShow.push(thirdRemovedComma);
                    }
                    else {
                        keysToShow.push(thirdWord);
                    }
                }
                i = key.length;
                return keysToShow;
            }
        }
    }
    static GetMeaningChunks(currentIndex, key) {
        let i = currentIndex;
        const keysToShow = [];
        while (i + 6 < key.length) {
            const word = key[i];
            const expectedIs = key[i + 1];
            const expectedThe = key[i + 2];
            const operation = key[i + 3];
            const expectedOf = key[i + 4];
            const groupedKey = key[i + 5];
            if (this.EndsWithComma(groupedKey) === true) {
                const newGroupedKey = groupedKey.substring(0, word.length - 1);
                try {
                    keysToShow.push(ParseHelper.GetGroupedKey(word, expectedIs, expectedThe, operation, expectedOf, newGroupedKey));
                }
                catch (err) {
                    throw new Error("Invalid Grouped Key: " + err);
                }
                i = i + 6;
            }
            else {
                try {
                    keysToShow.push(ParseHelper.GetGroupedKey(word, expectedIs, expectedThe, operation, expectedOf, groupedKey));
                }
                catch (err) {
                    throw new Error("Invalid Grouped Key: " + err);
                }
                i = i + 6;
                if (i + 7 === key.length) {
                    const expectedAnd = key[i];
                    const fword = key[i + 1];
                    const fexpectedIs = key[i + 2];
                    const fexpectedThe = key[i + 3];
                    const foperation = key[i + 4];
                    const fexpectedOf = key[i + 5];
                    const fgroupedKey = key[i + 6];
                    if (expectedAnd !== "and") {
                        throw new Error("expected 'and'");
                    }
                    try {
                        keysToShow.push(ParseHelper.GetGroupedKey(fword, fexpectedIs, fexpectedThe, foperation, fexpectedOf, fgroupedKey));
                    }
                    catch (err) {
                        throw new Error("Invalid Grouped Key: " + err);
                    }
                }
                i = key.length;
                return keysToShow;
            }
        }
    }
    static GetGroupedKey(word, expectedIs, expectedThe, operation, expectedOf, groupedKey) {
        if (typeof (word) !== "string") {
            throw new Error("word: " + word + " is not of type string!");
        }
        if (expectedIs !== "is") {
            throw new Error("expected an 'is' after the name of the grouped key");
        }
        if (expectedThe !== "the") {
            throw new Error("expected a 'the' after the 'is' of the grouped key");
        }
        if (KeyValidator_1.default.IsAggregator(operation) === false) {
            throw new Error("word: " + operation + " is not a valid aggregator.");
        }
        if (expectedOf !== "of") {
            throw new Error("expected an 'of' after the aggregator");
        }
        if (!KeyValidator_1.default.IsMkey(groupedKey)) {
            throw new Error("word: " + groupedKey + " is not an S_KEY or M_KEY!");
        }
        const key = {
            name: word,
            meaning: [operation, groupedKey],
        };
        return key;
    }
    static EndsWithComma(str) {
        const lastLetter = str.charAt(str.length - 1);
        if (lastLetter === ",") {
            return true;
        }
        else {
            return false;
        }
    }
}
exports.default = ParseHelper;
//# sourceMappingURL=ParseHelper.js.map