import { Key } from "./Key";
import KeyValidator from "./KeyValidator";
import ParseHelper from "./ParseHelper";

export class DisplayKey extends Key {
    // const expectedDisplayKey: string[] = ["show", "Department,", "ID", "and", "Average"];

    // example: [Department, ID, Average]
    protected keysToShow: string[];

    constructor(key: string[])  {

        // finds the last word of the key
        let lastWord = key[key.length - 1];
        const lastLetter = lastWord.charAt(lastWord.length - 1);

        // if the last letter is a period, replace the last word with a version that has no period.
        if (lastLetter === ".") {
            lastWord = lastWord.slice(0, -1);
            key.pop();
            key.push(lastWord);
        }
        super(key);

        // initialize keysToShow
        this.keysToShow = [];

        // confirm that the display is at least 2 words long:
        if (key.length < 2) {
            throw new Error("Invalid DISPLAY Key: must be at least two words long");
        }
        // confirm that the first word is "show"
        if (key[0] !== "show") {
            throw new Error("Invalid DISPLAY Key: unable to find 'show' at the beginning of the key");
        }

        // for each word in the input
        let i: number = 1;
        while (i < key.length) {
            const word: string = key[i];

            // check if the word ends with a comma.
            if (ParseHelper.EndsWithComma(word) === true) {

                // if it ends with a comma, remove the comma.
                const newWord = word.substring(0, word.length - 1);

                // if the rest of the word is a valid key, add it to KeysToShow[]
                if (KeyValidator.IsMkey(newWord) || KeyValidator.IsSkey(newWord)) {
                    this.keysToShow.push(newWord);
                } else {
                    throw new Error("Invalid DISPLAY Key: invalid MKEY or SKEY");
                }

                // iterate i
                i = i + 1;

            // if word does not end with a comma, begin the end sequence.
            } else {
                // check if the first word is a valid key
                if (KeyValidator.IsMkey(word) === true || KeyValidator.IsSkey(word) === true) {
                    this.keysToShow.push(word);
                } else {
                    throw new Error("Invalid DISPLAY Key: second last key does not end with comma but is invalid");
                }

                // check if there are two more words -- "and" + "final KEY".
                if (i + 2 === key.length - 1) {
                    const secondWord = key[i + 1];
                    const thirdWord = key[i + 2];

                    // check if the next word is "and"
                    if (secondWord !== "and") {
                        throw new Error("Invalid DISPLAY Key: expected 'and'");
                    }

                    // check if the second word is a valid KEY
                    if (KeyValidator.IsMkey(thirdWord) || KeyValidator.IsSkey(thirdWord)) {
                        this.keysToShow.push(thirdWord);
                    } else {
                        throw new Error("Invalid DISPLAY Key: invalid MKEY or SKEY");
                    }

                } else if (i !== key.length - 1) {
                    // if the first KEY has something other than 2 words or empty after it
                    throw new Error("Invalid DISPLAY Key: final sequence is not KEY + 'and' + KEY");
                }

                // if everything went well, the operation is over so we can break.
                i = key.length;
                break;
            }
        }
    }

    public GetKeysToShow() {
        return this.keysToShow;
    }
}
