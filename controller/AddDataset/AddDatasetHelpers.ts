import {
    InsightDatasetKind,
    InsightResponse,
    InsightResponseErrorBody,
} from "../IInsightFacade";
import { IZipContent, ICSV } from "../IZipIDataInterface";
import JSZip = require("jszip");
import fs = require("fs");
import Log from "../../Util";
import CSVLineValueFinder from "../Query/CSVLineValueFinder";

export default class AddDatasetHelpers {
    // checks if the input ID is valid and follows all constraints.
    public static ValidID = (id: string, kind: InsightDatasetKind): boolean => {
        if (
            !(kind === "courses") ||
            id.includes(" ") ||
            id.includes(",") ||
            id.includes(";") ||
            id.includes("_") ||
            id === null ||
            id === undefined
        ) {
            return false;
        } else {
            return true;
        }
    }

    // used for removeDataset same as ValidID but with no kind
    public static ValidIDnoKind = (id: string): boolean => {
        if (
            id.includes(" ") ||
            id.includes(",") ||
            id.includes(";") ||
            id.includes("_") ||
            id === null ||
            id === undefined
        ) {
            return false;
        } else {
            return true;
        }
    }

    // check if the input ID already exists within the input dataset
    public static DuplicateID = (
        id: string,
        dataSet: { [id: string]: IZipContent },
    ): boolean => {
        if (id in dataSet) {
            return true;
        } else {
            return false;
        }
    }

    // creates an insight Error Response with the corresponding code and body
    public static CreateReject = (message: string): InsightResponse => {
        const errorCode = 400;
        const errorBody: InsightResponseErrorBody = { error: message };
        const errorResponse: InsightResponse = {
            code: errorCode,
            body: errorBody,
        };

        return errorResponse;
    }

    // used for reject code 404
    public static CreateReject404 = (message: string): InsightResponse => {
        const errorCode = 404;
        const errorBody: InsightResponseErrorBody = { error: message };
        const errorResponse: InsightResponse = {
            code: errorCode,
            body: errorBody,
        };

        return errorResponse;
    }

    // creates an insight Success Response with the corresponding code and body
    public static CreateFulfill = (message: string): InsightResponse => {
        const fulfillCode = 204;
        const fulfillBody: InsightResponseErrorBody = { error: message };
        const fulfillResponse: InsightResponse = {
            code: fulfillCode,
            body: fulfillBody,
        };

        return fulfillResponse;
    }

    // returns the ISCV which acts as the contents of our dataSet dictionary
    public static async CreateZipContent(
        path: string,
        zip: JSZip,
        datasetKind: InsightDatasetKind,
    ): Promise<IZipContent> {
        // Part 2: using js zip to store contents into an object
        const zipContent: ICSV[] = [];
        const promises: Array<Promise<string>> = [];

        // Creating an array of ICSV's
        zip.forEach(async (relativePath, file) => {
            // tell the promises array that you plan on feeding it each csv's data as a string
            const promise = file.async("string");
            promises.push(promise);

            // add an object that has the file path and the string contents of the csv to zipContent.
            const zipc: ICSV = {
                file: relativePath,
                content: await promise,
            };

            zipContent.push(zipc);
        });

        // wait for all promises inside the promises array to finish loading
        // i.e wait for file.async to turn all the csv data into strings.
        await Promise.all(promises);

        // returns the zipContent to be added to dataSet
        if (zipContent.length === 0) {
            throw new Error(
                "There are no readable csv files within this zip folder",
            );
        }

        // checks if the total number of rows including the headers are 0. if so, reject
        if (CSVLineValueFinder.GetRows(zipContent, false) === 0) {
            throw new Error ("There is no data within the csv files");
        }

        // if there are no errors, return a new IZipContent

        return {
            file: path,
            content: zipContent,
            kind: datasetKind,
        };
    }

    public static async SaveFileLocally(
        id: string,
        contents: string,
    ): Promise<number> {
        // Part 1: turning the contents back into a zip file
        const path: string = `./src/controller/data/${id}.zip`;
        let code = 204;

        // use filesystem.writeFile to turn the contents into a zip file stored in 'path'.
        fs.writeFile(path, contents, { encoding: "base64" }, function (err) {
            if (err) {
                code = 400;
            }
        });

        return code;
    }
}
