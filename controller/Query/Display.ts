
// the response body is a dictionary.
// you push the dataset id as a prefix to the thing you are adding on.

import { DisplayKey } from "../QueryParser/DisplayKey";
import CSVLineValueFinder from "./CSVLineValueFinder";

// id = "courses"
export function getResponseBody(
    id: string, displayKey: DisplayKey, filteredArr: string[][]): Array<{[key: string]: any}> {

const keysToDisplay: string[] = displayKey.GetKeysToShow();

// in order to add one key : value onto responseBody, do it like so:
// responseBody[`${id}_avg`] = 90;

// console.log(responseBody);

const responseBody: Array<{[key: string]: any}> = [];

filteredArr.forEach(function (line: string[]) {
    // for each line
    const responseObject: {[key: string]: any} = {};

    keysToDisplay.forEach(function (key: string) {
        const objectKey: string = getObjectKey(id, key); // id: "courses", key: "Average"
        const objectValue = getObjectValue(key, line); // key: "Average"

        responseObject[objectKey] = objectValue;
    });

    responseBody.push(responseObject);
});

return responseBody;

}

const getObjectKey = function (id: string, key: string): string {
    // returns the string ${id}_key
    // i.e: courses_dept.

    // step 1: translate they key into the corresponding _key
    const unscoreKey: string = findCorrespondingKey(key);
    const combined = id.concat(unscoreKey);

    return combined;
};

const getObjectValue = function (key: string, line: string[]): any {
    // if the key is "Average", return the NUMBER 90.
    // if the key is "UUID", return the STRING 90
    switch (key) {
        case "Title": {
            return CSVLineValueFinder.getTitle(line);
        }
        case "UUID": {
            return CSVLineValueFinder.getId(line);
        }
        case "Instructor": {
            return CSVLineValueFinder.getProfessor(line);
        }
        case "Audit": {
            return Number(CSVLineValueFinder.getAudit(line));
        }
        case "Year": {
            return CSVLineValueFinder.getYear(line);
        }
        case "ID": {
            return CSVLineValueFinder.getCourse(line);
        }
        case "Pass": {
            return Number(CSVLineValueFinder.getPass(line));
        }
        case "Fail": {
            return Number(CSVLineValueFinder.getFail(line));
        }
        case "Average": {
            return Number(CSVLineValueFinder.getAvg(line));
        }
        case "Department": {
            return CSVLineValueFinder.getSubject(line);
        }
        case "Section": {
            return CSVLineValueFinder.getSection(line);
        }
    }
};

const findCorrespondingKey = function (key: string): string {
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
