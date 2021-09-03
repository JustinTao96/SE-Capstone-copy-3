"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryParser {
    constructor(query) {
        this.getQuery = function () {
            return this.query;
        };
        this.getDatasetKey = function () {
            return this.datasetKey;
        };
        this.getFilterKey = function () {
            return this.filterKey;
        };
        this.getDisplayKey = function () {
            return this.displayKey;
        };
        this.getOrderKey = function () {
            return this.orderKey;
        };
        this.SplitQueryIntoKeys = function (query) {
            this.query = query.split(" ");
            const firstChunk = query.split(";");
            const secondChunk = firstChunk[0].split(",");
            this.datasetKey = secondChunk[0].split(" ");
            this.filterKey = secondChunk[1].split(" ");
            this.displayKey = firstChunk[1].split(" ");
            this.orderKey = firstChunk[2].split(" ");
            this.filterKey.shift();
            this.displayKey.shift();
            this.orderKey.shift();
        };
        this.SplitQueryIntoKeys(query);
    }
}
exports.QueryParser = QueryParser;
//# sourceMappingURL=QueryParser.js.map