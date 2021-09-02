"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const IInsightFacade_1 = require("./IInsightFacade");
const QueryParser_1 = require("./QueryParser/QueryParser");
const ParserResponse_1 = require("./QueryParser/ParserResponse");
const JSZip = require("jszip");
const fs = require("fs");
const AddDatasetHelpers_1 = require("./AddDataset/AddDatasetHelpers");
const CSVLineValueFinder_1 = require("./Query/CSVLineValueFinder");
class Datasets {
    constructor() {
        this.processZip = (id, content, kind) => {
            const path = `./src/controller/data/${id}.zip`;
            return new Promise((fulfill, reject) => {
                try {
                    const zipFile = new JSZip();
                    zipFile
                        .loadAsync(content, { base64: true })
                        .then((zip) => __awaiter(this, void 0, void 0, function* () {
                        this.dataSet[id] =
                            yield AddDatasetHelpers_1.default.CreateZipContent(path, zipFile, kind);
                        yield AddDatasetHelpers_1.default.SaveFileLocally(id, content);
                        fulfill(204);
                    }))
                        .catch(() => {
                        reject(400);
                    });
                }
                catch (err) {
                    return reject(400);
                }
            });
        };
        this.dataSet = {};
    }
    addDataset(id, content, kind) {
        return new Promise((fulfill, reject) => {
            if (!AddDatasetHelpers_1.default.ValidID(id, kind) ||
                AddDatasetHelpers_1.default.DuplicateID(id, this.dataSet)) {
                reject(AddDatasetHelpers_1.default.CreateReject("Kind must = courses, id must not contain spaces commas or semicolons for valid dataset"));
            }
            if (kind === IInsightFacade_1.InsightDatasetKind.Courses) {
                try {
                    this.processZip(id, content, kind).then((result) => {
                        if (result === 204) {
                            return fulfill(AddDatasetHelpers_1.default.CreateFulfill("File was processed"));
                        }
                        else if (result === 400) {
                            return reject(AddDatasetHelpers_1.default.CreateReject("Failed to process zip file"));
                        }
                    });
                }
                catch (err) {
                    reject(AddDatasetHelpers_1.default.CreateReject(err));
                }
            }
            else if (kind === IInsightFacade_1.InsightDatasetKind.Rooms) {
            }
        });
    }
    removeDataset(id) {
        return new Promise((fulfill, reject) => {
            const idExists = this.dataSet.hasOwnProperty(id);
            if (idExists && AddDatasetHelpers_1.default.ValidIDnoKind(id)) {
                delete this.dataSet[id];
                fs.unlink("./src/controller/data/" + id + ".zip", function (err) {
                    if (err) {
                        throw err;
                    }
                });
                fulfill(AddDatasetHelpers_1.default.CreateFulfill("File was removed from disk and memory"));
                return;
            }
            else {
                reject(AddDatasetHelpers_1.default.CreateReject404("Failed to delete zip file and cache"));
                return;
            }
        });
    }
    performQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let parser;
            try {
                parser = new QueryParser_1.QueryParser(query);
            }
            catch (err) {
                const errorBody = { error: err };
                const errorCode = 400;
                const errorResponse = {
                    code: errorCode,
                    body: errorBody,
                };
                throw errorResponse;
            }
            const parserResponse = new ParserResponse_1.ParserResponse();
            let response;
            try {
                response = yield parserResponse.GetResponse(parser, this.dataSet);
            }
            catch (err) {
                const errorBody = { error: err };
                const errorCode = 400;
                const errorResponse = {
                    code: errorCode,
                    body: errorBody,
                };
                throw errorResponse;
            }
            return response;
        });
    }
    listDatasets() {
        return __awaiter(this, void 0, void 0, function* () {
            const DatasetInfo = [];
            const responseCode = 200;
            for (const name in this.dataSet) {
                const content = this.dataSet[name].content;
                const rows = CSVLineValueFinder_1.default.GetRows(content, true);
                const expectedDataset = {
                    id: name,
                    kind: this.dataSet[name].kind,
                    numRows: rows,
                };
                DatasetInfo.push(expectedDataset);
            }
            const responseBody = { result: DatasetInfo };
            const response = { code: responseCode, body: responseBody };
            return response;
        });
    }
    getData() {
        return this.dataSet;
    }
}
exports.Datasets = Datasets;
//# sourceMappingURL=Datasets.js.map