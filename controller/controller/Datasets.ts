import InsightFacade from "./InsightFacade";
import Log from "../Util";
import {
    IInsightFacade,
    InsightResponse,
    InsightDatasetKind,
    InsightResponseSuccessBody,
} from "./IInsightFacade";
import { InsightDataset } from "./IInsightFacade";
import { QueryParser } from "./QueryParser/QueryParser";
import { ParserResponse } from "./QueryParser/ParserResponse";
import { IZipContent, ICSV, IRoomContent } from "./IZipIDataInterface";
import JSZip = require("jszip");
import { resolve } from "dns";
import { rejects } from "assert";
import { file } from "jszip";
import fs = require("fs");
import { error } from "console";
import AddDatasetHelpers from "./AddDataset/AddDatasetHelpers";
import CSVLineValueFinder from "./Query/CSVLineValueFinder";

// there should only ever be one instance of the Datasets class
export class Datasets {
    // adds the dataset into both the data field in this class, and into the local machine's data folder.
    // will have to turn the input into a zip folder and return the correct InsightResponse.
    // could you include checks in the code to ensure that the string id does not include spaces (" "),
    // commas (","), or semicolons (";")?
    // TODO:  save the zip to the ./src/controller/data folder

    // dataSet is a dictionary with a key (id) of type String and value (content) of type String.
    private dataSet: { [id: string]: IZipContent };

    constructor() {
        this.dataSet = {};
    }

    public addDataset(id: string, content: string, kind: InsightDatasetKind): Promise<InsightResponse> {
        return new Promise((fulfill, reject) => {
            // if there are any errors with the id, reject.
            if (
                !AddDatasetHelpers.ValidID(id, kind) ||
                AddDatasetHelpers.DuplicateID(id, this.dataSet)
            ) {
                reject(
                    AddDatasetHelpers.CreateReject(
                        "Kind must = courses, id must not contain spaces commas or semicolons for valid dataset",
                    ),
                );
            }

            if (kind === InsightDatasetKind.Courses) {
                // try to process ZIP.
                try {
                    this.processZip(id, content, kind).then((result: number) => {
                        if (result === 204) {
                            return fulfill(
                                AddDatasetHelpers.CreateFulfill(
                                    "File was processed",
                                ),
                            );
                        } else if (result === 400) {
                            return reject(
                                AddDatasetHelpers.CreateReject(
                                    "Failed to process zip file",
                                ),
                            );
                        }
                    });

                    // if anything goes wrong with processZip, return the corresponding error message.
                } catch (err) {
                    reject(AddDatasetHelpers.CreateReject(err));
                }

            } else if (kind === InsightDatasetKind.Rooms) {
                // try to add the rooms dataset xml file.

                // 1. read the file from ./datasetName/index.xml

                // 2. the file will look something like this:
                // <buildings>
                //   <building code="ACU" name="Acute Care Unit" path="./campus/discover/buildings-and-classrooms/ACU">
                //   <location address="2211 Wesbrook Mall"/>
                //   </building>
                //
                //   tslint:disable-next-line:max-line-length
                //   <building code="ALRD" name="Allard Hall (LAW)" path="./campus/discover/buildings-and-classrooms/ALRD">
                //   <location address="1822 East Mall"/>
                //   </building>

                // 3. for each of the buildings within the <buildings> category, get the path= value.

                // 4. each path= corresponds to another file saved in the dataset that they want you to log.

                // 5. If you follow the path, you will find a file that looks like this:

                // This file represents a <building ...
                // with multiple            <rooms ... />

                // <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
                // <building id="SWNG" address="2175 West Mall V6T 1Z4" name="West Mall Swing Space">
                //   <rooms>
                //     <room number="105">
                //       <web link="http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-105"/>
                // <space seats="47" furniture="Classroom-Movable Tables + Chairs" type="Open Design General Purpose"/>
                //     </room>
                //
                //     <room number="106">
                //       <web link="http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-106"/>
                //       <space seats="27" furniture="Classroom-Movable Tables + Chairs" type="Small Group"/>
                //     </room>
                //
                //   </rooms>
                // </building>

                // within each of these files, each <rooms> ... </room> chunk represents one room we are adding
                // for each of these rooms, we need to create an object with the following fields:

                // rooms_fullname: string; Full building name (e.g., "Hugh Dempster Pavilion").
                // rooms_shortname: string; Short building name (e.g., "DMP").
                // rooms_number: string; The room number. Not always a number, so represented as a string.
                // rooms_name: string; The room id; should be rooms_shortname+"_"+rooms_number.
                // rooms_address: string; The building address. (e.g., "6245 Agronomy Road V6T 1Z4").
                // rooms_lat: number; The latitude of the building. Instructions for getting this field are below.
                // rooms_lon: number; The longitude of the building, as described under finding buildings' geolocation.
                // rooms_seats: number; The number of seats in the room.
                // rooms_type: string; The room type (e.g., "Small Group").
                // rooms_furniture: string; The room type (e.g., "Classroom-Movable Tables & Chairs").
                // tslint:disable-next-line:max-line-length
                // rooms_href: string; The link to full details online (e.g., "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-201").

                // 6. Create an object of type IRoomContents (see IZip data interface),
                // and fill each value of the IRoomContents with the corresponding value for a particular room.
                // for example, room 105 would look like:

                // const currentRoom: IRoomContent = {
                //     fullname: "West Mall Swing Space",
                //     shortname: "SWNG",
                //     number: "105",
                //     name: "SWNG_105",
                //     address: "2175 West Mall V6T 1Z4",
                //     lat: TBD,
                //     lon: TBD,
                //     seats: 47,
                //     type: "Open Design General Purpose",
                //     furniture: "Classroom-Movable Tables + Chairs",
                //     href: "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG_105",
                // }

                // for each building, for each room, create an IRoomContent and push it to an array[]
                // that array will later be the content value for our updated IZipContent.

                // Creating the IZipContent:
                // Content:
                // for each path=, you will get a building.
                // for each building, you will get a list of rooms.
                // for each room, store its contents into an IRoomContents, and push it to a field IRoomcontentsArray[]
                // when Defining the IZipContent, let its {content: IRoomcontentsArray[]}

                // File:
                // save the path to the first folder of the rooms dataset so we can find it with remove Dataset later.
                // (ex. ./src/controller/data/NewRoomsDataset)

                // Kind:
                // set the kind to InsightDatasetKind.Rooms

                // 6. finally, set the dataSet[id] = to the newly created IZipContent
            }
        });
    }

    public processZip = (id: string, content: string, kind: InsightDatasetKind): Promise<number> => {
        const path: string = `./src/controller/data/${id}.zip`;

        return new Promise((fulfill, reject) => {
            try {
                // wait for jzip to finish reading the contents
                const zipFile = new JSZip();
                zipFile
                    .loadAsync(content, { base64: true })
                    .then(async (zip: JSZip) => {
                        // once the JSZip is done processing, persist dataset to memory.
                        this.dataSet[id] =
                            await AddDatasetHelpers.CreateZipContent(
                                path,
                                zipFile,
                                kind,
                            );

                        // if persisting data to memory is successful, try saving data locally
                        await AddDatasetHelpers.SaveFileLocally(id, content);

                        // if persisted to memory and saved locally without any errors, fulfill with code 204.
                        fulfill(204);
                    })
                    // any errors in the .then will be caught here.
                    .catch(() => {
                        reject(400);
                    });

                // if any error was caught above, it will be returned here as an insightResponse
            } catch (err) {
                return reject(400);
            }
        });
    }

    // removes the dataset from both the data field in this class, and removes the zip file from
    // the local machine. returns an InsightResponse.
    public removeDataset(id: string): Promise<InsightResponse> {
        return new Promise((fulfill, reject) => {
            const idExists: boolean = this.dataSet.hasOwnProperty(id);
            if (idExists && AddDatasetHelpers.ValidIDnoKind(id)) {
                delete this.dataSet[id];
                fs.unlink(
                    "./src/controller/data/" + id + ".zip",
                    function (err) {
                        if (err) {
                            throw err;
                        }
                    },
                );
                fulfill(
                    AddDatasetHelpers.CreateFulfill(
                        "File was removed from disk and memory",
                    ),
                );
                return;
            } else {
                reject(
                    AddDatasetHelpers.CreateReject404(
                        "Failed to delete zip file and cache",
                    ),
                );
                return;
            }
        });
    }
    // Needs to be able to parse and read the query,
    // then open the appropriate dataset stored in data,
    // then operate on the content, and return the correct InsightResponse.
    // In an async function, return is promise.resolve, throw is promise.reject.
    public async performQuery(query: string): Promise<InsightResponse> {
        let parser: QueryParser;

        // checks to see if the query string is valid.
        try {
            parser = new QueryParser(query);
        } catch (err) {
            const errorBody = { error: err };
            const errorCode = 400;
            const errorResponse: InsightResponse = {
                code: errorCode,
                body: errorBody,
            };
            throw errorResponse;
        }

        // at this point, parser should hold information about all the keys.
        // I will now create a new object called ParserResponse;
        // Parser response should read the parser values, and create an insight response.
        const parserResponse: ParserResponse = new ParserResponse();
        let response: InsightResponse;

        try {
            response = await parserResponse.GetResponse(parser, this.dataSet);
        } catch (err) {
            const errorBody = { error: err };
            const errorCode = 400;
            const errorResponse: InsightResponse = {
                code: errorCode,
                body: errorBody,
            };
            throw errorResponse;
        }

        return response;
        // Placeholder Response below:
        // const successBody: InsightResponseSuccessBody = {result: "not yet implemented"};
        // return Promise.resolve({code: 200, body: successBody});
    }

    // Should read the data dictionary and use it to return an InsightResponse.
    public async listDatasets(): Promise<InsightResponse> {
        // return Promise.reject({ code: -1, body: null });

        const DatasetInfo: InsightDataset[] = [];
        const responseCode: number = 200;

        for (const name in this.dataSet) {

            const content: ICSV[] = this.dataSet[name].content as ICSV[];
            const rows = CSVLineValueFinder.GetRows(content, true);

            const expectedDataset: InsightDataset = {
                id: name,
                kind: this.dataSet[name].kind,
                numRows: rows,
            };

            DatasetInfo.push(expectedDataset);
        }

        const responseBody: InsightResponseSuccessBody = {result: DatasetInfo};
        const response: InsightResponse = {code: responseCode, body: responseBody};
        return response;
    }

    // getter for our data dictionary.
    public getData() {
        return this.dataSet;
    }
}
