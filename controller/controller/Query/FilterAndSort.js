"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IInsightFacade_1 = require("../IInsightFacade");
const KeyValidator_1 = require("../QueryParser/KeyValidator");
const CSVLineValueFinder_1 = require("./CSVLineValueFinder");
function FilterCSV(splitArray, parser) {
    const kind = parser.getDatasetKey().getKind();
    let filteredArr = [];
    if (kind === IInsightFacade_1.InsightDatasetKind.Courses) {
        filteredArr = FilterCourses(parser, splitArray);
    }
    else if (kind === IInsightFacade_1.InsightDatasetKind.Rooms) {
        filteredArr = FilterRooms(parser, splitArray);
    }
    return filteredArr;
}
exports.FilterCSV = FilterCSV;
const FilterRooms = function (parser, Rooms) {
    const FilteredArr = [];
    const findall = parser.getFilterKey().GetFindAll();
    const filterKey = parser.getFilterKey();
    const isAggregate = parser.getAggregate();
    const kind = IInsightFacade_1.InsightDatasetKind.Rooms;
    let orderKey;
    if (isAggregate === false) {
        orderKey = parser.getOrderKey();
    }
    Rooms.forEach(function (Room) {
        const matched = MatchesFilter(Room, filterKey, kind);
        if (matched || findall === true) {
            if (isAggregate === false && orderKey !== undefined && orderKey.getSortKey().length === 1) {
                const orderBy = orderKey.getSortKey()[0];
                const orderIndex = CSVLineValueFinder_1.default.getIndexOfKeyInLine(orderBy);
                FilteredArr.splice(getSortedIndex(FilteredArr, Room[orderIndex], orderIndex), 0, Room);
            }
            else {
                FilteredArr.push(Room);
            }
        }
    });
    return FilteredArr;
};
const FilterCourses = function (parser, CSVs) {
    const FilteredArr = [];
    const findall = parser.getFilterKey().GetFindAll();
    const filterKey = parser.getFilterKey();
    const isAggregate = parser.getAggregate();
    const kind = IInsightFacade_1.InsightDatasetKind.Courses;
    let orderKey;
    if (isAggregate === false) {
        orderKey = parser.getOrderKey();
    }
    CSVs.forEach(function (CSVfile) {
        CSVfile.shift();
        CSVfile.forEach(function (line) {
            if (line.replace(/\s/g, "").length > 0) {
                const splitLine = line.split("|");
                const matched = MatchesFilter(splitLine, filterKey, kind);
                if (matched || findall === true) {
                    if (isAggregate === false && orderKey !== undefined && orderKey.getSortKey().length === 1) {
                        const orderBy = orderKey.getSortKey()[0];
                        const orderIndex = CSVLineValueFinder_1.default.getIndexOfKeyInLine(orderBy);
                        FilteredArr.splice(getSortedIndex(FilteredArr, splitLine[orderIndex], orderIndex), 0, splitLine);
                    }
                    else {
                        FilteredArr.push(splitLine);
                    }
                }
            }
        });
    });
    return FilteredArr;
};
const getSortedIndex = function (array, value, orderIndex) {
    let low = 0;
    let high = array.length;
    while (low < high) {
        const mid = Math.floor((low + high) / 2);
        if (array[mid][orderIndex] < value) {
            low = mid + 1;
        }
        else {
            high = mid;
        }
    }
    return low;
};
const MatchesFilter = function (splitLine, filterKey, kind) {
    const ops = filterKey.GetOps();
    const OPResults = [];
    if (kind === IInsightFacade_1.InsightDatasetKind.Courses) {
        ops.forEach(function (op) {
            if (op.GetIsSOP() === true) {
                const passesSOP = CheckIfSOPMatches(splitLine, op, kind);
                OPResults.push(passesSOP);
            }
            else {
                const passesMOP = CheckIfMOPMatches(splitLine, op, kind);
                OPResults.push(passesMOP);
            }
            if (op.GetNextOP() === "or") {
                OPResults.push(op.GetNextOP());
            }
        });
    }
    return CheckIfWholeLineMatches(OPResults);
};
const CheckIfSOPMatches = function (line, op, kind) {
    if (kind === IInsightFacade_1.InsightDatasetKind.Courses) {
        if (KeyValidator_1.default.IsSkeyRooms(op.GetKey())) {
            throw new Error("Filter/Sort: Invalid S_KEY: Current KIND is COURSES but found ROOM key: " + op.GetKey());
        }
    }
    else if (kind === IInsightFacade_1.InsightDatasetKind.Rooms) {
        if (KeyValidator_1.default.IsSkeyCourses(op.GetKey())) {
            throw new Error("Filter/Sort: Invalid S_KEY: Current KIND is ROOMS but found COURSES key: " + op.GetKey());
        }
    }
    const keyValue = CSVLineValueFinder_1.default.getSkeyValue(op.GetKey(), line);
    const comparisonValue = op.GetComparison();
    const operation = op.GetOp().join(" ");
    switch (operation) {
        case "is": {
            if (keyValue === comparisonValue) {
                return true;
            }
            else {
                return false;
            }
        }
        case "is not": {
            if (keyValue !== comparisonValue) {
                return true;
            }
            else {
                return false;
            }
        }
        case "includes": {
            if (keyValue.includes(comparisonValue)) {
                return true;
            }
            else {
                return false;
            }
        }
        case "does not include": {
            if (keyValue.includes(comparisonValue)) {
                return false;
            }
            else {
                return true;
            }
        }
        case "begins with": {
            if (keyValue.startsWith(comparisonValue) === true) {
                return true;
            }
            else {
                return false;
            }
        }
        case "does not begin with": {
            if (keyValue.startsWith(comparisonValue) !== true) {
                return true;
            }
            else {
                return false;
            }
        }
        case "ends with": {
            if (keyValue.endsWith(comparisonValue) === true) {
                return true;
            }
            else {
                return false;
            }
        }
        case "does not end with": {
            if (keyValue.endsWith(comparisonValue) !== true) {
                return true;
            }
            else {
                return false;
            }
        }
        default: {
            return false;
        }
    }
};
const CheckIfMOPMatches = function (line, op, kind) {
    if (kind === IInsightFacade_1.InsightDatasetKind.Courses) {
        if (KeyValidator_1.default.IsMkeyRooms(op.GetKey())) {
            throw new Error("Filter/Sort: Invalid S_KEY: Current KIND is COURSES but found ROOM key: " + op.GetKey());
        }
    }
    else if (kind === IInsightFacade_1.InsightDatasetKind.Rooms) {
        if (KeyValidator_1.default.IsMkeyCourses(op.GetKey())) {
            throw new Error("Filter/Sort: Invalid S_KEY: Current KIND is ROOMS but found COURSES key: " + op.GetKey());
        }
    }
    let prefixNot;
    if (op.GetOp().length === 2) {
        prefixNot = true;
    }
    else {
        prefixNot = false;
    }
    const keyValue = CSVLineValueFinder_1.default.getMkeyValue(op.GetKey(), line);
    const comparisonValue = op.GetComparison();
    let operation;
    if (prefixNot) {
        operation = op.GetOp()[1];
    }
    else {
        operation = op.GetOp()[0];
    }
    switch (operation) {
        case "greater": {
            if ((+keyValue > comparisonValue) !== prefixNot) {
                return true;
            }
            else {
                return false;
            }
        }
        case "less": {
            if ((+keyValue < comparisonValue) !== prefixNot) {
                return true;
            }
            else {
                return false;
            }
        }
        case "equal": {
            if ((+keyValue === comparisonValue) !== prefixNot) {
                return true;
            }
            else {
                return false;
            }
        }
        default: {
            return false;
        }
    }
};
const CheckIfWholeLineMatches = function (matched) {
    return AtLeastOneOrPasses(matched);
};
const AtLeastOneOrPasses = (matched) => {
    let allMatched = true;
    for (const value of matched) {
        if (value === "or") {
            if (allMatched === true) {
                return true;
            }
            else {
                allMatched = true;
            }
        }
        if (value === false) {
            allMatched = false;
        }
    }
    return allMatched;
};
//# sourceMappingURL=FilterAndSort.js.map