"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Key_1 = require("./Key");
const ParseHelper_1 = require("./ParseHelper");
class AggregateDisplayKey extends Key_1.Key {
    constructor(key) {
        super(key);
        this.GetKeysToShow = () => {
            return this.keysToShow;
        };
        this.getMeaningsOfSpecialKeys = () => {
            return this.MeaningsOfSpecialKeys;
        };
        let lastWord = key[key.length - 1];
        const lastLetter = lastWord.charAt(lastWord.length - 1);
        if (lastLetter === ".") {
            lastWord = lastWord.slice(0, -1);
            key.pop();
            key.push(lastWord);
        }
        this.keysToShow = [];
        this.MeaningsOfSpecialKeys = [];
        if (key.length < 2) {
            throw new Error("Invalid DISPLAY Key: must be at least two words long");
        }
        if (key[0] !== "show") {
            throw new Error("Invalid DISPLAY Key: unable to find 'show' at the beginning of the key");
        }
        const indexOfWhere = key.indexOf("where");
        if (indexOfWhere === -1) {
            throw new Error("AggregateDisplayKey: Unable to detect 'where' Keyword for AGGREGATE query");
        }
        const listOfNames = key.slice(0, indexOfWhere);
        const listOfMeanings = key.slice(indexOfWhere, key.length);
        this.keysToShow = ParseHelper_1.default.GetAggregateChunk(1, listOfNames);
        this.MeaningsOfSpecialKeys = ParseHelper_1.default.GetMeaningChunks(1, listOfMeanings);
    }
}
exports.AggregateDisplayKey = AggregateDisplayKey;
//# sourceMappingURL=AggregateDisplayKey.js.map