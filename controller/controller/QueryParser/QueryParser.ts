import { AggregateDatasetKey } from "./AggregateDatasetKey";
import { AggregateDisplayKey } from "./AggregateDisplayKey";
import { AggregateFilterKey } from "./AggregateFilterKey";
import { AggregateOrderKey } from "./AggregateOrderKey";
import { DatasetKey } from "./DatasetKey";
import { DisplayKey } from "./DisplayKey";
import { FilterKey } from "./FilterKey";
import { OrderKey } from "./OrderKey";

export class QueryParser {
    // format of a query: DATASET + ', ' + FILTER + '; ' + DISPLAY(+ '; ' + ORDER)? + '.'
    // example of a query:
    // In courses dataset courses,
    // find entries whose Average is greater than 90 and Department is \"adhe\" or Average is equal to 95;
    // show Department, ID and Average.
    // sort in ascending order by Average

    protected query: string[];
    protected aggregate: boolean;

    private datasetKey: DatasetKey;
    private filterKey: FilterKey;
    private displayKey: DisplayKey;
    private orderKey: OrderKey;

    private aggregateDatasetKey: AggregateDatasetKey;
    private aggregateFilterKey: AggregateFilterKey;
    private aggregateDisplayKey: AggregateDisplayKey;
    private aggregateOrderKey: AggregateOrderKey;

    // if the query can be split into four chunks, try to construct each key. throw errors to Datasets.ts.PerformQuery
    constructor(query: string) {
        this.query = query.split(" ");

        if (this.isAggregate(this.query)) {
            try {
                this.aggregate = true;
                this.TestValidAggregateQuery(query);
                this.SplitAggregateQueries(query);
            } catch (error) {
                throw error;
            }

        } else {
            try {
                this.aggregate = false;
                this.TestValidQuery(query);
                this.SplitQueryIntoKeys(query);
            } catch (error) {
                throw error;
            }
        }

    }

    // Example of being able to use this. to access current class with arrow function =>
    public getQuery = () => {
        return this.query;
    }

    public getDatasetKey = (): DatasetKey => {
        if (this.aggregate === true) {
            return this.aggregateDatasetKey;
        } else {
            return this.datasetKey;
        }
    }

    // example of accessing the object at the outer scope of the thread with this.
    public getFilterKey = (): FilterKey | AggregateFilterKey => {
        if (this.aggregate === true) {
            return this.aggregateFilterKey;
        } else {
            return this.filterKey;
        }
    }

    public getDisplayKey = (): DisplayKey | AggregateDisplayKey => {
        if (this.aggregate === true) {
            return this.aggregateDisplayKey;
        } else {
            return this.displayKey;
        }
    }

    public getOrderKey = (): OrderKey | AggregateOrderKey => {
        if (this.aggregateOrderKey !== undefined || this.orderKey !== undefined) {

            if (this.aggregate === true) {
                return this.aggregateOrderKey;
            } else {
                return this.orderKey;
            }
        }
    }

    public isAggregate = (query: string[]): boolean => {
        if (query.length < 5) {
            throw new Error("Invalid Query");
        }

        if (query[4] === "grouped") {
            return true;

        } else {
            return false;
        }
    }

    public getAggregate = (): boolean => {
        return this.aggregate;
    }

    // checks if the Aggregate query is valid and splittable into 4 keys;
    public TestValidAggregateQuery = (query: string) => {
        let firstChunk: string[];
        let secondChunk: string[];

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

        // if there are less than 4 words in the secondChunk, throw an error
        if (secondChunk.length < 4) {
            throw new Error("invalid QUERY: ensure that DATASET and FILTER keys are correctly formatted");
        }
    }

    // splits the Aggregate queries into keys and tries to construct them.
    public SplitAggregateQueries = (query: string) => {

        // FIRST CHUNK:
        // 0 DATASET + FILTER
        // 1 DISPLAY
        // 2 ORDER

        // SECOND CHUNK:
        // 0 DATASET
        // 1 FILTER

        const firstChunk: string[] = query.split(";");

        // since the length of the dataset is always 4 words, split firstChunk0 by spaces;
        const secondChunk: string[] = firstChunk[0].split(" ");

        // if there are less than 10 words in the secondChunk, throw an error
        if (secondChunk.length < 10) {
            throw new Error("invalid QUERY: are you missing any keys?");
        }

        const indexOfFind = secondChunk.indexOf("find");

        if (indexOfFind === -1) {
            throw new Error("QueryParser: Unable to detect 'find' Keyword for AGGREGATE query");
        }

        // if there are more than 4 words in the secondChunk, assign the first four words to datasetKey.
        const datasetKeyValues = secondChunk.slice(0 , indexOfFind);
        // assign everything after the first four words to filterkey.
        const filterKeyValues = secondChunk.slice(indexOfFind, secondChunk.length);

        const finalKey: string = firstChunk[firstChunk.length - 1];
        const displayKeyValues = firstChunk[1].split(" ");

        displayKeyValues.shift();

        try {
            this.aggregateDatasetKey = new AggregateDatasetKey(datasetKeyValues);
        } catch (error) {
            throw error;
        }

        try {
            this.aggregateFilterKey = new AggregateFilterKey(filterKeyValues);
        } catch (error) {
            throw error;
        }

        try {
            this.aggregateDisplayKey = new AggregateDisplayKey(displayKeyValues);
        } catch (error) {
            throw error;
        }

        // If there is an order keyword, remove the space at the end and try to create the OrderKey.
        if (firstChunk.length === 3) {
            const removePeriodValues = finalKey.split(".");
            const orderKeyValues = removePeriodValues[0].split(" ");
            orderKeyValues.shift();

            try {
                this.aggregateOrderKey = new AggregateOrderKey(orderKeyValues);
            } catch (error) {
                throw error;
            }
        }
    }

    // checks if the query is valid and splittable into 4 keys;
    public TestValidQuery = (query: string) => {
        let firstChunk: string[];
        let secondChunk: string[];

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

        // if there are less than 4 words in the secondChunk, throw an error
        if (secondChunk.length < 4) {
            throw new Error("invalid QUERY: ensure that DATASET and FILTER keys are correctly formatted");
        }
    }

    // splits the queries into keys and tries to construct them.
    public SplitQueryIntoKeys = (query: string) => {

        // FIRST CHUNK:
        // 0 DATASET + FILTER
        // 1 DISPLAY
        // 2 ORDER

        // SECOND CHUNK:
        // 0 DATASET
        // 1 FILTER

        // turn all "Full Name" into FullName (no spaces)
        const fullNameQuery = query.replace(/Full Name/gi, "FullName");

        // turn all "'Short Name" into "ShortName" (no spaces)
        const fullShortNameQuery = fullNameQuery.replace(/Short Name/gi, "ShortName");

        const firstChunk: string[] = fullShortNameQuery.split(";");

        // since the length of the dataset is always 4 words, split firstChunk0 by spaces;
        const secondChunk: string[] = firstChunk[0].split(" ");

        // if there are less than 4 words in the secondChunk, throw an error
        if (secondChunk.length < 4) {
            throw new Error("invalid QUERY: are you missing any keys?");
        }

        // if there are more than 4 words in the secondChunk, assign the first four words to datasetKey.
        const datasetKeyValues = secondChunk.slice(0 , 4);
        // assign everything after the first four words to filterkey.
        const filterKeyValues = secondChunk.slice(4, secondChunk.length);

        const finalKey: string = firstChunk[firstChunk.length - 1];
        const displayKeyValues = firstChunk[1].split(" ");

        displayKeyValues.shift();

        try {
            this.datasetKey = new DatasetKey(datasetKeyValues);
        } catch (error) {
            throw error;
        }

        try {
            this.filterKey = new FilterKey(filterKeyValues);
        } catch (error) {
            throw error;
        }

        try {
            this.displayKey = new DisplayKey(displayKeyValues);
        } catch (error) {
            throw error;
        }

        // If there is an order keyword, remove the space at the end and try to create the OrderKey.
        if (firstChunk.length === 3) {
            const removePeriodValues = finalKey.split(".");
            const orderKeyValues = removePeriodValues[0].split(" ");
            orderKeyValues.shift();

            try {
                this.orderKey = new OrderKey(orderKeyValues);
            } catch (error) {
                throw error;
            }
        }
    }
}
