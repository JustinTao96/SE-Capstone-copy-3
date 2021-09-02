"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Key_1 = require("./Key");
const IInsightFacade_1 = require("../IInsightFacade");
class DatasetKey extends Key_1.Key {
    constructor(key) {
        super(key);
        this.getKind = () => {
            return this.kind;
        };
        this.getID = () => {
            return this.id;
        };
        this.CheckValidKey = (key, keywords, M_OP, S_OP) => {
            if (key.length < 4) {
                throw new Error("invalid DATASET key: should contain 4 or more");
            }
            if (key[0] !== "In") {
                throw new Error("invalid DATASET key: 'In' keyword not found");
            }
            if (key[2] !== "dataset") {
                throw new Error("invalid DATASET key: 'dataset' keyword not found");
            }
            if (key[1] !== IInsightFacade_1.InsightDatasetKind.Courses && key[1] !== IInsightFacade_1.InsightDatasetKind.Rooms) {
                throw new Error("invalid DATASET key: 'KIND' keyword not equal to 'courses' or 'rooms'");
            }
            if (key[3].includes("_")) {
                throw new Error("invalid DATASET key: 'INPUT' keyword must not contain underscores");
            }
            if (key[3].includes(" ")) {
                throw new Error("invalid DATASET key: 'INPUT' keyword must not contain spaces");
            }
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
        };
        this.SetKind = () => {
            const kindString = this.words[1];
            if (kindString === "courses") {
                this.kind = IInsightFacade_1.InsightDatasetKind.Courses;
            }
            else if (kindString === "rooms") {
                this.kind = IInsightFacade_1.InsightDatasetKind.Rooms;
            }
        };
        this.SetID = (key) => {
            let currentID = this.words[3];
            if (currentID.charAt(currentID.length - 1) === ",") {
                currentID = currentID.substring(0, currentID.length - 1);
                this.words.pop();
                this.words.push(currentID);
            }
            else if (key.length > 4) {
                this.id = currentID;
            }
            else {
                throw new Error("Invalid DATASAET key: the INPUT key should end with a comma. current: " + currentID);
            }
            this.id = currentID;
        };
        const keywords = this.KEYWORD;
        const M_OP = this.M_OP;
        const S_OP = this.S_OP;
        try {
            this.CheckValidKey(key, keywords, M_OP, S_OP);
        }
        catch (err) {
            throw err;
        }
        this.SetKind();
        this.SetID(key);
    }
}
exports.DatasetKey = DatasetKey;
//# sourceMappingURL=DatasetKey.js.map