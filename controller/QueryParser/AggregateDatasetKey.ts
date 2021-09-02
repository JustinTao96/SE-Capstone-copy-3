import { DatasetKey } from "./DatasetKey";
import { Key } from "./Key";
import KeyValidator from "./KeyValidator";
import ParseHelper from "./ParseHelper";

export class AggregateDatasetKey extends DatasetKey {
    // example Agg.Datasetkey = "In courses dataset courses grouped by Department, Average and UUID"
    // example groupedBy: ["wassup", "Average", "UUID"]

    protected groupedBy: string[];
    constructor(key: string[])  {
        super(key);
        this.groupedBy = [];

        if (this.KeyIsNotLongEnough(key)) {
            throw new Error("invalid Aggregate DatasetKey: length of key is less than 7");
        }

        if (key[4] !== "grouped" && key[5] !== "by") {
            throw new Error("invalid Aggregate DatasetKey: ensure that 'grouped by' is included");
        }

        this.groupedBy = ParseHelper.GetAggregateChunk(6, key);
    }

    public GetGroupedBy = (): string[] => {
        return this.groupedBy;
    }

    private KeyIsNotLongEnough = (key: string[]): boolean => {
        if (key.length < 7) {
            return true;
        } else {
            return false;
        }
    }
}
