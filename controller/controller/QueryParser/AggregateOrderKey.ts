import { Key } from "./Key";
import KeyValidator from "./KeyValidator";
import { OrderKey } from "./OrderKey";
import ParseHelper from "./ParseHelper";

// basically copied pasted instead of abstracted to save time.
export class AggregateOrderKey extends Key {
    // example Agg.Order key: "sort in decending order by avgGrade, Average and Department"
    // NOTE: regular order key needs to be reworked to allow ascending/decending order, and multiple KEYS.
    protected sortKey: string[];
    protected operator: string;

    constructor(key: string[])  {
        super(key);
        this.sortKey = [];

        // ensure that the input string is at least 6 words long
        if (key.length < 6) {
            throw new Error("Invalid AGGREGATE ORDER Key: order keys must be over 6 words long");
        }

        // ensure that the first and second words are 'sort in'
        if (key[0] !== "sort" || key[1] !== "in") {
            throw new Error("Invalid AGGREGATE ORDER Key: order keys must begin with 'sort in'");
        }

        // ensure that the third word is a valid operator and assign it to operator
        if (key[2] !== "ascending" && key[2] !== "descending") {
            throw new Error("Invalid AGGREGATE ORDER Key: order keys must have a valid operator after 'sort in'");
        } else {
            this.operator = key[2];
        }

        // ensure that the fourth and fifth words are "order" "in"
        if (key[3] !== "order" || key[4] !== "by") {
            throw new Error("Invalid AGGREGATE ORDER Key: order keys must include 'order in' after the operator");
        }

        // THIS PART NEEDS TO BE REWORKED TO TAKE IN A CHUNK
        // everything from here on is going to be a part of the chunk, so check its validity and try adding it.
        try {
            this.sortKey = ParseHelper.GetAggregateChunk(5, key);
        } catch (err) {
            throw new Error("Invalid AGGREGATE ORDER key: " + err);
        }
    }

    public getSortKey = () => {
        return this.sortKey;
    }

    public getOperator = () => {
        return this.operator;
    }
}
