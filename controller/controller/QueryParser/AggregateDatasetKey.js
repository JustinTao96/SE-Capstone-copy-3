"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DatasetKey_1 = require("./DatasetKey");
const ParseHelper_1 = require("./ParseHelper");
class AggregateDatasetKey extends DatasetKey_1.DatasetKey {
    constructor(key) {
        super(key);
        this.GetGroupedBy = () => {
            return this.groupedBy;
        };
        this.KeyIsNotLongEnough = (key) => {
            if (key.length < 7) {
                return true;
            }
            else {
                return false;
            }
        };
        this.groupedBy = [];
        if (this.KeyIsNotLongEnough(key)) {
            throw new Error("invalid Aggregate DatasetKey: length of key is less than 7");
        }
        if (key[4] !== "grouped" && key[5] !== "by") {
            throw new Error("invalid Aggregate DatasetKey: ensure that 'grouped by' is included");
        }
        this.groupedBy = ParseHelper_1.default.GetAggregateChunk(6, key);
    }
}
exports.AggregateDatasetKey = AggregateDatasetKey;
//# sourceMappingURL=AggregateDatasetKey.js.map