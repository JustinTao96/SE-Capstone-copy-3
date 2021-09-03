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
const fs = require("fs");
const CSVLineValueFinder_1 = require("../Query/CSVLineValueFinder");
class AddDatasetHelpers {
    static CreateZipContent(path, zip, datasetKind) {
        return __awaiter(this, void 0, void 0, function* () {
            const zipContent = [];
            const promises = [];
            zip.forEach((relativePath, file) => __awaiter(this, void 0, void 0, function* () {
                const promise = file.async("string");
                promises.push(promise);
                const zipc = {
                    file: relativePath,
                    content: yield promise,
                };
                zipContent.push(zipc);
            }));
            yield Promise.all(promises);
            if (zipContent.length === 0) {
                throw new Error("There are no readable csv files within this zip folder");
            }
            if (CSVLineValueFinder_1.default.GetRows(zipContent, false) === 0) {
                throw new Error("There is no data within the csv files");
            }
            return {
                file: path,
                content: zipContent,
                kind: datasetKind,
            };
        });
    }
    static SaveFileLocally(id, contents) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = `./src/controller/data/${id}.zip`;
            let code = 204;
            fs.writeFile(path, contents, { encoding: "base64" }, function (err) {
                if (err) {
                    code = 400;
                }
            });
            return code;
        });
    }
}
exports.default = AddDatasetHelpers;
AddDatasetHelpers.ValidID = (id, kind) => {
    if (!(kind === "courses") ||
        id.includes(" ") ||
        id.includes(",") ||
        id.includes(";") ||
        id.includes("_") ||
        id === null ||
        id === undefined) {
        return false;
    }
    else {
        return true;
    }
};
AddDatasetHelpers.ValidIDnoKind = (id) => {
    if (id.includes(" ") ||
        id.includes(",") ||
        id.includes(";") ||
        id.includes("_") ||
        id === null ||
        id === undefined) {
        return false;
    }
    else {
        return true;
    }
};
AddDatasetHelpers.DuplicateID = (id, dataSet) => {
    if (id in dataSet) {
        return true;
    }
    else {
        return false;
    }
};
AddDatasetHelpers.CreateReject = (message) => {
    const errorCode = 400;
    const errorBody = { error: message };
    const errorResponse = {
        code: errorCode,
        body: errorBody,
    };
    return errorResponse;
};
AddDatasetHelpers.CreateReject404 = (message) => {
    const errorCode = 404;
    const errorBody = { error: message };
    const errorResponse = {
        code: errorCode,
        body: errorBody,
    };
    return errorResponse;
};
AddDatasetHelpers.CreateFulfill = (message) => {
    const fulfillCode = 204;
    const fulfillBody = { error: message };
    const fulfillResponse = {
        code: fulfillCode,
        body: fulfillBody,
    };
    return fulfillResponse;
};
//# sourceMappingURL=AddDatasetHelpers.js.map