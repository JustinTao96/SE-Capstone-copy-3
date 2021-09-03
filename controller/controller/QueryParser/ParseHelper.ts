import { IGroupedKey } from "./GroupedKeyInterface";
import KeyValidator from "./KeyValidator";

export default class ParseHelper {

    // turns a chunk ["Average," "ID" "and" "UUID"] into an array ["Average", "ID", "UUID"].
    public static GetChunk(currentIndex: number, key: string[]): string[] {

        // if there is only one value left in the key.
        if ((key.length - 1) === currentIndex) {
            return [key[currentIndex]];
        }

        // for each word in the input
        let i: number = currentIndex;
        const keysToShow: string[] = [];

        while (i < key.length) {
            const word: string = key[i];

            // check if the word ends with a comma.
            if (this.EndsWithComma(word) === true) {

                // if it ends with a comma, remove the comma.
                const newWord = word.substring(0, word.length - 1);

                // if the rest of the word is a valid key, add it to KeysToShow[]
                if (KeyValidator.IsMkey(newWord) || KeyValidator.IsSkey(newWord)) {
                    keysToShow.push(newWord);
                } else {
                    throw new Error("invalid MKEY or SKEY");
                }

                // iterate i
                i = i + 1;

            // if word does not end with a comma, begin the end sequence.
            } else {
                // check if the first word is a valid key
                if (KeyValidator.IsMkey(word) === true || KeyValidator.IsSkey(word) === true) {
                    keysToShow.push(word);
                } else {
                    throw new Error("second last key does not end with comma but is invalid");
                }

                // check if there are two more words -- "and" + "final KEY".
                if (i + 2 === key.length - 1) {
                    const secondWord = key[i + 1];
                    const thirdWord = key[i + 2];

                    // check if the next word is "and"
                    if (secondWord !== "and") {
                        throw new Error("expected 'and'");
                    }

                    // check if the second word is a valid KEY
                    if (KeyValidator.IsMkey(thirdWord) || KeyValidator.IsSkey(thirdWord)) {
                        keysToShow.push(thirdWord);
                    } else {
                        throw new Error("the word after 'and' is not a valid key" + ": " + thirdWord);
                    }

                } else if (i !== key.length - 1) {
                    // if the first KEY has something other than 2 words or empty after it
                    throw new Error("final sequence is not KEY + 'and' + KEY");
                }

                // if everything went well, the operation is over so we can break.
                i = key.length;
                return keysToShow;
            }
        }
    }

        // turns a chunk ["Average," "ID" "and" "UUID"] into an array ["Average", "ID", "UUID"].
    public static GetAggregateChunk(currentIndex: number, key: string[]): string[] {

        // if there is only one value left in the key.
        if ((key.length - 1) === currentIndex) {
            return [key[currentIndex]];
        }

        // for each word in the input
        let i: number = currentIndex;
        const keysToShow: string[] = [];

        while (i < key.length) {
            const word: string = key[i];

            // check if the word ends with a comma.
            if (this.EndsWithComma(word) === true) {

                // if it ends with a comma, remove the comma.
                const newWord = word.substring(0, word.length - 1);

                // if the rest of the word is a valid key, add it to KeysToShow[]
                keysToShow.push(newWord);

                // iterate i
                i = i + 1;

            // if word does not end with a comma, begin the end sequence.
            } else {
                // check if the first word is a valid key
                keysToShow.push(word);

                // check if there are two more words -- "and" + "final KEY".
                if (i + 2 === key.length - 1) {
                    const secondWord = key[i + 1];
                    const thirdWord = key[i + 2];

                    // check if the next word is "and"
                    if (secondWord !== "and") {
                        throw new Error("expected 'and'");
                    }

                    // check if the second word is a valid KEY
                    // if it ends with a comma, remove the comma.
                    if (this.EndsWithComma(thirdWord)) {
                        const thirdRemovedComma = thirdWord.slice(0, - 1);
                        keysToShow.push(thirdRemovedComma);
                    } else {
                        keysToShow.push(thirdWord);
                    }

                }

                // if everything went well, the operation is over so we can break.
                i = key.length;
                return keysToShow;
            }
        }
    }

// Example meaning chunk:
// avgGrade is the AVG of Average, minGrade is the MIN of Average and sumPass is the SUM of Pass;

// each meaning is of length 6.
// first word of each meaning is always the name of the Igrouped key.
// index [3] and index [5] is the respective OPERATION + KEY of the Igrouped key meaning.
// index [0], [3], and [5] are the only ones that are of value. just check if all else matches syntax.
    public static GetMeaningChunks(currentIndex: number, key: string[]): IGroupedKey[] {

        // for each word in the input
        let i: number = currentIndex;
        const keysToShow: IGroupedKey[] = [];

        while (i + 6 < key.length) {
            const word: string = key[i];
            const expectedIs: string = key[i + 1];
            const expectedThe: string = key[i + 2];
            const operation: string = key[i + 3];
            const expectedOf: string = key[i + 4];
            const groupedKey: string = key[i + 5];

            // check if the word ends with a comma.
            if (this.EndsWithComma(groupedKey) === true) {

                // if it ends with a comma, remove the comma.
                const newGroupedKey = groupedKey.substring(0, word.length - 1);

                // if the rest of the sentence is a valid IGroupedKey, add it to KeysToShow[]
                try {
                    keysToShow.push(ParseHelper.GetGroupedKey(
                        word, expectedIs, expectedThe, operation, expectedOf, newGroupedKey));
                } catch (err) {
                    throw new Error("Invalid Grouped Key: " + err);
                }

                // iterate i
                i = i + 6;

            // if word does not end with a comma, begin the end sequence.
            } else {
                // check if the first GroupedKey is valid
                try {
                    keysToShow.push(ParseHelper.GetGroupedKey(
                        word, expectedIs, expectedThe, operation, expectedOf, groupedKey));
                } catch (err) {
                    throw new Error("Invalid Grouped Key: " + err);
                }

                // iterate i
                i = i + 6;

                // check if there are 7 more words -- "and" + "final KEY" (6).
                if (i + 7 === key.length) {
                    const expectedAnd = key[i];

                    const fword: string = key[i + 1];
                    const fexpectedIs: string = key[i + 2];
                    const fexpectedThe: string = key[i + 3];
                    const foperation: string = key[i + 4];
                    const fexpectedOf: string = key[i + 5];
                    const fgroupedKey: string = key[i + 6];

                    // check if the next word is "and"
                    if (expectedAnd !== "and") {
                        throw new Error("expected 'and'");
                    }

                    // check if the second sequence is a valid GroupedKEY
                    try {
                        keysToShow.push(ParseHelper.GetGroupedKey(
                            fword, fexpectedIs, fexpectedThe, foperation, fexpectedOf, fgroupedKey));
                    } catch (err) {
                        throw new Error("Invalid Grouped Key: " + err);
                    }
                }

                // if everything went well, the operation is over so we can break.
                i = key.length;
                return keysToShow;
            }
        }
    }

    // word is the operation of key - check if each sequence is correct
    public static GetGroupedKey(
        word: string, expectedIs: string, expectedThe: string,
        operation: string, expectedOf: string, groupedKey: string): IGroupedKey {

        if (typeof(word) !== "string") {
            throw new Error("word: " + word + " is not of type string!");
        }

        if (expectedIs !== "is") {
            throw new Error("expected an 'is' after the name of the grouped key");
        }

        if (expectedThe !== "the") {
            throw new Error("expected a 'the' after the 'is' of the grouped key");
        }

        if (KeyValidator.IsAggregator(operation) === false) {
            throw new Error("word: " + operation + " is not a valid aggregator.");
        }

        if (expectedOf !== "of") {
            throw new Error("expected an 'of' after the aggregator");
        }

        if (KeyValidator.IsSkey(groupedKey) && operation !== "COUNT") {
            throw new Error("S_KEYS can only be used as an AGG_DEF key if the AGGREGATOR is COUNT.");
        }

        if (!KeyValidator.IsMkey(groupedKey) && !KeyValidator.IsSkey(groupedKey)) {
            throw new Error("word: " + groupedKey + " is not an S_KEY or M_KEY!");
        }

        const key: IGroupedKey = {
            name: word,
            meaning: [operation, groupedKey],
        };

        return key;
    }

    public static EndsWithComma(str: string): boolean {
        const lastLetter = str.charAt(str.length - 1);

        if (lastLetter === ",") {
            return true;
        } else {
            return false;
        }
    }
}
