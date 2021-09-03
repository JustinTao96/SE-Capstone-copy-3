"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Key_1 = require("./Key");
const ParseHelper_1 = require("./ParseHelper");
class OrderKey extends Key_1.Key {
    constructor(key) {
        super(key);
        this.getSortKey = () => {
            return this.sortKey;
        };
        this.getOperator = () => {
            return this.operator;
        };
        this.sortKey = [];
        if (key.length < 6) {
            throw new Error("Invalid ORDER Key: order keys must be 6 words long");
        }
        if (key[0] !== "sort" || key[1] !== "in") {
            throw new Error("Invalid ORDER Key: order keys must begin with 'sort in'");
        }
        if (key[2] !== "ascending" && key[2] !== "descending") {
            throw new Error("Invalid ORDER Key: order keys must have a valid operator after 'sort in'");
        }
        else {
            this.operator = key[2];
        }
        if (key[3] !== "order" || key[4] !== "by") {
            throw new Error("Invalid ORDER Key: order keys must include 'order in' after the operator");
        }
        try {
            this.sortKey = ParseHelper_1.default.GetChunk(5, key);
        }
        catch (err) {
            throw new Error("Invalid ORDER key: " + err);
        }
    }
}
exports.OrderKey = OrderKey;
//# sourceMappingURL=OrderKey.js.map