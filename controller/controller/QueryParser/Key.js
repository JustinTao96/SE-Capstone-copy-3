"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const KeyValidator_1 = require("./KeyValidator");
class Key {
    constructor(key) {
        this.KEYWORD = KeyValidator_1.default.KEYWORD;
        this.M_OP = KeyValidator_1.default.M_OP;
        this.S_OP = KeyValidator_1.default.S_OP;
        this.NextWord = () => {
            if (this.currentIndex < this.highestIndex) {
                this.previousWord = this.currentWord;
                this.currentWord = null;
            }
            else {
                this.previousWord = this.currentWord;
                this.currentIndex++;
                this.currentWord = this.words[this.currentIndex];
            }
        };
        this.words = key;
        this.currentIndex = 0;
        this.highestIndex = (this.words.length - 1);
    }
    getWords() {
        return this.words;
    }
}
exports.Key = Key;
//# sourceMappingURL=Key.js.map