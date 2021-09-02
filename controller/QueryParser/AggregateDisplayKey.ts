import { DisplayKey } from "./DisplayKey";
import { Key } from "./Key";
import KeyValidator from "./KeyValidator";
import { IGroupedKey } from "./GroupedKeyInterface";
import { group } from "console";
import { start } from "repl";
import ParseHelper from "./ParseHelper";

export class AggregateDisplayKey extends Key {
    // example AGG.Display key = "show Department and avgGrade, where avgGrade is the AVG of Average;"
    // example: [Department, {"avgGrade": ["where, avgGrade, is, the, AVG, of, Average"]} ]

    // show Department, sumPass, minGrade and avgGrade,
    // where avgGrade is the AVG of Average, minGrade is the MIN of Average and sumPass is the SUM of Pass;

    protected keysToShow: string[];
    protected MeaningsOfSpecialKeys: IGroupedKey[];

    constructor(key: string[])  {
        super(key);

        // finds the last word of the key
        let lastWord = key[key.length - 1];
        const lastLetter = lastWord.charAt(lastWord.length - 1);

        // if the last letter is a period, replace the last word with a version that has no period.
        if (lastLetter === ".") {
            lastWord = lastWord.slice(0, -1);
            key.pop();
            key.push(lastWord);
        }

        // initialize keysToShow and meaning of special keys
        this.keysToShow = [];
        this.MeaningsOfSpecialKeys = [];

        // confirm that the display is at least 2 words long:
        if (key.length < 2) {
            throw new Error("Invalid DISPLAY Key: must be at least two words long");
        }
        // confirm that the first word is "show"
        if (key[0] !== "show") {
            throw new Error("Invalid DISPLAY Key: unable to find 'show' at the beginning of the key");
        }

        // there are two parts to the aggregate display key:
        // 1. the list of names
        // 2. the list of meanings

        const indexOfWhere = key.indexOf("where");

        if (indexOfWhere === -1) {
            throw new Error("AggregateDisplayKey: Unable to detect 'where' Keyword for AGGREGATE query");
        }

        // separate out the list of names/meanings using indexOfWhere as the pivot.
        const listOfNames = key.slice(0 , indexOfWhere);
        const listOfMeanings = key.slice(indexOfWhere, key.length);

        // get the organized list of names
        this.keysToShow = ParseHelper.GetAggregateChunk(1, listOfNames);

        // get the organized list of meanings:
        this.MeaningsOfSpecialKeys = ParseHelper.GetMeaningChunks(1, listOfMeanings);

    }

    public GetKeysToShow = () => {
        return this.keysToShow;
    }

    public getMeaningsOfSpecialKeys = (): IGroupedKey[] => {
        return this.MeaningsOfSpecialKeys;
    }
}
