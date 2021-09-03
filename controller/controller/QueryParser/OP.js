"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OP {
    constructor(key, op, comparison, length, nextOP) {
        this.GetKey = () => {
            return this.key;
        };
        this.GetOp = () => {
            return this.op;
        };
        this.GetComparison = () => {
            if (this.isSOP === true) {
                const comp = this.comparison;
                return comp;
            }
            else {
                const comp = this.comparison;
                return comp;
            }
        };
        this.GetLength = () => {
            return this.length;
        };
        this.GetNextOP = () => {
            return this.nextOP;
        };
        this.GetIsSOP = () => {
            return this.isSOP;
        };
        this.key = key;
        this.op = op;
        this.comparison = comparison;
        this.length = length;
        this.nextOP = nextOP;
        if (typeof comparison === "string" || comparison instanceof String) {
            this.isSOP = true;
        }
        else {
            this.isSOP = false;
        }
    }
}
exports.OP = OP;
//# sourceMappingURL=OP.js.map