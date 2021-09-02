import KeyValidator from "./KeyValidator";
export class Key {

    // defining restricted words:
    protected KEYWORD: string[] = KeyValidator.KEYWORD;
    protected M_OP: string[] = KeyValidator.M_OP;
    protected S_OP: string[] = KeyValidator.S_OP;

    protected words: string[];

    protected highestIndex: number;
    protected currentIndex: number;

    protected previousWord: string;
    protected currentWord: string;

    constructor (key: string[]) {
        this.words = key;

        this.currentIndex = 0;
        this.highestIndex = (this.words.length - 1);
    }

    public getWords() {
        return this.words;
    }

    // sets the current word to be the next word in the array.
    // sets the previous word.
    protected NextWord = () => {
        if (this.currentIndex < this.highestIndex) {
            this.previousWord = this.currentWord;
            this.currentWord = null;
        } else {
            this.previousWord = this.currentWord;
            this.currentIndex++;
            this.currentWord = this.words[this.currentIndex];
        }
    }
}
