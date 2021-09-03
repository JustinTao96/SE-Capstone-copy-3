"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CSVLineValueFinder_1 = require("./CSVLineValueFinder");
function getResponseBody(id, displayKey, filteredArr) {
    const keysToDisplay = displayKey.GetKeysToShow();
    const responseBody = [];
    filteredArr.forEach(function (line) {
        const responseObject = {};
        keysToDisplay.forEach(function (key) {
            const objectKey = getObjectKey(id, key);
            const objectValue = getObjectValue(key, line);
            responseObject[objectKey] = objectValue;
        });
        responseBody.push(responseObject);
    });
    return responseBody;
}
exports.getResponseBody = getResponseBody;
const getObjectKey = function (id, key) {
    const unscoreKey = findCorrespondingKey(key);
    const combined = id.concat(unscoreKey);
    return combined;
};
const getObjectValue = function (key, line) {
    switch (key) {
        case "Title": {
            return CSVLineValueFinder_1.default.getTitle(line);
        }
        case "UUID": {
            return CSVLineValueFinder_1.default.getId(line);
        }
        case "Instructor": {
            return CSVLineValueFinder_1.default.getProfessor(line);
        }
        case "Audit": {
            return Number(CSVLineValueFinder_1.default.getAudit(line));
        }
        case "Year": {
            return CSVLineValueFinder_1.default.getYear(line);
        }
        case "ID": {
            return CSVLineValueFinder_1.default.getCourse(line);
        }
        case "Pass": {
            return Number(CSVLineValueFinder_1.default.getPass(line));
        }
        case "Fail": {
            return Number(CSVLineValueFinder_1.default.getFail(line));
        }
        case "Average": {
            return Number(CSVLineValueFinder_1.default.getAvg(line));
        }
        case "Department": {
            return CSVLineValueFinder_1.default.getSubject(line);
        }
        case "Section": {
            return CSVLineValueFinder_1.default.getSection(line);
        }
    }
};
const findCorrespondingKey = function (key) {
    switch (key) {
        case "Title": {
            return "_title";
        }
        case "UUID": {
            return "_uuid";
        }
        case "Instructor": {
            return "_instructor";
        }
        case "Audit": {
            return "_audit";
        }
        case "Year": {
            return "_year";
        }
        case "ID": {
            return "_id";
        }
        case "Pass": {
            return "_pass";
        }
        case "Fail": {
            return "_fail";
        }
        case "Average": {
            return "_avg";
        }
        case "Department": {
            return "_dept";
        }
        case "Section": {
            return "_section";
        }
    }
};
//# sourceMappingURL=Display.js.map