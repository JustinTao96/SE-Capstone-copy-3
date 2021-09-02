import { Key } from "./Key";
import { InsightDatasetKind } from "../IInsightFacade";
export class DatasetKey extends Key {
    // const expectedDatasetKey: string[] = ["In", "courses", "dataset", "courses"];

    protected kind: InsightDatasetKind;
    protected id: string;

    constructor(key: string[])  {
        super(key);

        const keywords = this.KEYWORD;
        const M_OP = this.M_OP;
        const S_OP = this.S_OP;

        try {
            this.CheckValidKey(key, keywords, M_OP, S_OP);
        } catch (err) {
            throw err;
        }

        this.SetKind();
        this.SetID(key);
    }

    public getKind = () => {
        return this.kind;
    }

    public getID = () => {
        return this.id;
    }

    protected CheckValidKey = (key: string[], keywords: string[], M_OP: string[], S_OP: string[]) => {
        // these tests need to be performed in order to avoid out of range index.
        // making sure length of array is 4
        if (key.length < 4) {
            throw new Error("invalid DATASET key: should contain 4 or more");
        }

        // checking if all static words match template.
        if (key[0] !== "In") {
            throw new Error("invalid DATASET key: 'In' keyword not found");
        }
        if (key[2] !== "dataset") {
            throw new Error("invalid DATASET key: 'dataset' keyword not found");
        }

        // checking if KIND is valid
        if (key[1] !== InsightDatasetKind.Courses && key[1] !== InsightDatasetKind.Rooms) {
            throw new Error("invalid DATASET key: 'KIND' keyword not equal to 'courses' or 'rooms'");
        }

        // checking if INPUT key is valid
        if (key[3].includes("_")) {
            throw new Error("invalid DATASET key: 'INPUT' keyword must not contain underscores");
        }

        if (key[3].includes(" ")) {
            throw new Error("invalid DATASET key: 'INPUT' keyword must not contain spaces");
        }

        // making sure INPUT key does not contain any of the operations or keywords
        keywords.forEach((keyword) => {
            if (key[3] === keyword) {
                throw new Error("invalid DATASET key: 'INPUT' keyword cannot be equal to:" + keyword);
            }
        });

        M_OP.forEach((op) => {
            if (key[3] === op) {
                throw new Error("invalid DATASET key: 'INPUT' keyword cannot be equal to:" + op);
            }
        });

        S_OP.forEach((op) => {
            if (key[3] === op) {
                throw new Error("invalid DATASET key: 'INPUT' keyword cannot be equal to:" + op);
            }
        });
    }

    private SetKind = () => {
        const kindString: string = this.words[1];
        if (kindString === "courses") {
            this.kind = InsightDatasetKind.Courses;

        } else if (kindString === "rooms") {
            this.kind = InsightDatasetKind.Rooms;
        }
    }

    // sets the last word in the array as the id fileName
    private SetID = (key: string[]) => {
        let currentID = this.words[3];

        // if the last letter of the ID has a comma, remove it
        if (currentID.charAt(currentID.length - 1) === ",") {
            currentID = currentID.substring(0, currentID.length - 1);

            // update this.words with the new ID;
            this.words.pop();
            this.words.push(currentID);

        // hack to check if the parent is an aggregate Key:
        } else if (key.length > 4) {
            this.id = currentID;

        } else {
            throw new Error("Invalid DATASAET key: the INPUT key should end with a comma. current: " + currentID);
        }
        this.id = currentID;
    }
}
