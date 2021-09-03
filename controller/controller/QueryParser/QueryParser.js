"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AggregateDatasetKey_1 = require("./AggregateDatasetKey");
const AggregateDisplayKey_1 = require("./AggregateDisplayKey");
const AggregateFilterKey_1 = require("./AggregateFilterKey");
const AggregateOrderKey_1 = require("./AggregateOrderKey");
const DatasetKey_1 = require("./DatasetKey");
const DisplayKey_1 = require("./DisplayKey");
const FilterKey_1 = require("./FilterKey");
const OrderKey_1 = require("./OrderKey");
class QueryParser {
    constructor(query) {
        this.getQuery = () => {
            return this.query;
        };
        this.getDatasetKey = () => {
            if (this.aggregate === true) {
                return this.aggregateDatasetKey;
            }
            else {
                return this.datasetKey;
            }
        };
        this.getFilterKey = () => {
            if (this.aggregate === true) {
                return this.aggregateFilterKey;
            }
            else {
                return this.filterKey;
            }
        };
        this.getDisplayKey = () => {
            if (this.aggregate === true) {
                return this.aggregateDisplayKey;
            }
            else {
                return this.displayKey;
            }
        };
        this.getOrderKey = () => {
            if (this.aggregateOrderKey !== undefined || this.orderKey !== undefined) {
                if (this.aggregate === true) {
                    return this.aggregateOrderKey;
                }
                else {
                    return this.orderKey;
                }
            }
        };
        this.isAggregate = (query) => {
            if (query.length < 5) {
                throw new Error("Invalid Query");
            }
            if (query[4] === "grouped") {
                return true;
            }
            else {
                return false;
            }
        };
        this.getAggregate = () => {
            return this.aggregate;
        };
        this.TestValidAggregateQuery = (query) => {
            let firstChunk;
            let secondChunk;
            if (query === "") {
                throw new Error("invalid query: query is blank");
            }
            if (query === null) {
                throw new Error("invalid query: query is null");
            }
            if (query === undefined) {
                throw new Error("invalid query: query is undefined");
            }
            firstChunk = query.split(";");
            secondChunk = firstChunk[0].split(" ");
            if (firstChunk.length !== 3 && firstChunk.length !== 2) {
                throw new Error("invalid query syntax: ensure that ';' is only used in the correct locations");
            }
            if (secondChunk.length < 4) {
                throw new Error("invalid QUERY: ensure that DATASET and FILTER keys are correctly formatted");
            }
        };
        this.SplitAggregateQueries = (query) => {
            const firstChunk = query.split(";");
            const secondChunk = firstChunk[0].split(" ");
            if (secondChunk.length < 10) {
                throw new Error("invalid QUERY: are you missing any keys?");
            }
            const indexOfFind = secondChunk.indexOf("find");
            if (indexOfFind === -1) {
                throw new Error("QueryParser: Unable to detect 'find' Keyword for AGGREGATE query");
            }
            const datasetKeyValues = secondChunk.slice(0, indexOfFind);
            const filterKeyValues = secondChunk.slice(indexOfFind, secondChunk.length);
            const finalKey = firstChunk[firstChunk.length - 1];
            const displayKeyValues = firstChunk[1].split(" ");
            displayKeyValues.shift();
            try {
                this.aggregateDatasetKey = new AggregateDatasetKey_1.AggregateDatasetKey(datasetKeyValues);
            }
            catch (error) {
                throw error;
            }
            try {
                this.aggregateFilterKey = new AggregateFilterKey_1.AggregateFilterKey(filterKeyValues);
            }
            catch (error) {
                throw error;
            }
            try {
                this.aggregateDisplayKey = new AggregateDisplayKey_1.AggregateDisplayKey(displayKeyValues);
            }
            catch (error) {
                throw error;
            }
            if (firstChunk.length === 3) {
                const removePeriodValues = finalKey.split(".");
                const orderKeyValues = removePeriodValues[0].split(" ");
                orderKeyValues.shift();
                try {
                    this.aggregateOrderKey = new AggregateOrderKey_1.AggregateOrderKey(orderKeyValues);
                }
                catch (error) {
                    throw error;
                }
            }
        };
        this.TestValidQuery = (query) => {
            let firstChunk;
            let secondChunk;
            if (query === "") {
                throw new Error("invalid query: query is blank");
            }
            if (query === null) {
                throw new Error("invalid query: query is null");
            }
            if (query === undefined) {
                throw new Error("invalid query: query is undefined");
            }
            firstChunk = query.split(";");
            secondChunk = firstChunk[0].split(" ");
            if (firstChunk.length !== 3 && firstChunk.length !== 2) {
                throw new Error("invalid query syntax: ensure that ';' is only used in the correct locations");
            }
            if (secondChunk.length < 4) {
                throw new Error("invalid QUERY: ensure that DATASET and FILTER keys are correctly formatted");
            }
        };
        this.SplitQueryIntoKeys = (query) => {
            const fullNameQuery = query.replace(/Full Name/gi, "FullName");
            const fullShortNameQuery = fullNameQuery.replace(/Short Name/gi, "ShortName");
            const firstChunk = fullShortNameQuery.split(";");
            const secondChunk = firstChunk[0].split(" ");
            if (secondChunk.length < 4) {
                throw new Error("invalid QUERY: are you missing any keys?");
            }
            const datasetKeyValues = secondChunk.slice(0, 4);
            const filterKeyValues = secondChunk.slice(4, secondChunk.length);
            const finalKey = firstChunk[firstChunk.length - 1];
            const displayKeyValues = firstChunk[1].split(" ");
            displayKeyValues.shift();
            try {
                this.datasetKey = new DatasetKey_1.DatasetKey(datasetKeyValues);
            }
            catch (error) {
                throw error;
            }
            try {
                this.filterKey = new FilterKey_1.FilterKey(filterKeyValues);
            }
            catch (error) {
                throw error;
            }
            try {
                this.displayKey = new DisplayKey_1.DisplayKey(displayKeyValues);
            }
            catch (error) {
                throw error;
            }
            if (firstChunk.length === 3) {
                const removePeriodValues = finalKey.split(".");
                const orderKeyValues = removePeriodValues[0].split(" ");
                orderKeyValues.shift();
                try {
                    this.orderKey = new OrderKey_1.OrderKey(orderKeyValues);
                }
                catch (error) {
                    throw error;
                }
            }
        };
        this.query = query.split(" ");
        if (this.isAggregate(this.query)) {
            try {
                this.aggregate = true;
                this.TestValidAggregateQuery(query);
                this.SplitAggregateQueries(query);
            }
            catch (error) {
                throw error;
            }
        }
        else {
            try {
                this.aggregate = false;
                this.TestValidQuery(query);
                this.SplitQueryIntoKeys(query);
            }
            catch (error) {
                throw error;
            }
        }
    }
}
exports.QueryParser = QueryParser;
//# sourceMappingURL=QueryParser.js.map