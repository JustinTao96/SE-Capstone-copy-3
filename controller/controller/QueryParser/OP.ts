import { Key } from "./Key";

export class OP {
    // Example MOP = "Average", "is", "not", "greater", "than", "90", "and"
    // example: Key: "Average", op: ["not", "greater"], comparison: 90, length: 6, nextOP: "and"

    // Example SOP = "Department", "is", "not" "\"adhe\"", "or";
    // example: Key: "Department", op: ["is" "not"], comparison: ""adhe"", length: 5, nextOP: "or"

    // nextOP is = "" if there is no next op.
    protected key: string;
    protected op: string[];
    protected comparison: any;
    protected length: number;
    protected nextOP: string;

    protected isSOP: boolean;

    constructor(key: string, op: string[], comparison: any, length: number, nextOP: string) {
        this.key = key;
        this.op = op;
        this.comparison = comparison;
        this.length = length;
        this.nextOP = nextOP;

        if (typeof comparison === "string" || comparison instanceof String) {
            this.isSOP = true;
        } else {
            this.isSOP = false;
        }
    }

    public GetKey = (): string => {
        return this.key;
    }

    public GetOp = (): string[] => {
        return this.op;
    }

    public GetComparison = () => {

        if (this.isSOP === true) {
            const comp: string = this.comparison;
            return comp;

        } else {
            const comp: number = this.comparison;
            return comp;
        }
    }

    public GetLength = () => {
        return this.length;
    }

    public GetNextOP = () => {
        return this.nextOP;
    }

    public GetIsSOP = (): boolean => {
        return this.isSOP;
    }
}
