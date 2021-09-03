import { DH_CHECK_P_NOT_SAFE_PRIME } from "constants";
import { filter } from "jszip";
import { InsightDatasetKind } from "../IInsightFacade";
import { FilterKey } from "../QueryParser/FilterKey";
import KeyValidator from "../QueryParser/KeyValidator";
import { OP } from "../QueryParser/OP";
import { OrderKey } from "../QueryParser/OrderKey";
import { QueryParser } from "../QueryParser/QueryParser";
import CSVLineValueFinder from "./CSVLineValueFinder";

export function FilterCSV(
    splitArray: string[][], parser: QueryParser): string[][] {

    // getting variables for filtering
    const kind: InsightDatasetKind = parser.getDatasetKey().getKind();

    // for each value inside of csvs, print out the csv number and the line number in the csv array.
    let filteredArr: string[][] = [];

    if (kind === InsightDatasetKind.Courses) {
        // in a CSV array, each file will have many lines.
        filteredArr = FilterCourses(parser, splitArray);

    } else if (kind === InsightDatasetKind.Rooms) {
        // in a Rooms array, each file is a single line with 9 variables.
        filteredArr = FilterRooms(parser, splitArray);
    }

    return filteredArr;
}

const FilterRooms = function (parser: QueryParser, Rooms: string[][]): string[][] {
    // the array that the filtered lines will be pushed to
    const FilteredArr: string[][] = [];

    // getting variables for filtering
    const findall: boolean = parser.getFilterKey().GetFindAll();
    const filterKey: FilterKey = parser.getFilterKey();
    const isAggregate: boolean = parser.getAggregate();
    const kind = InsightDatasetKind.Rooms;
    let orderKey: OrderKey;

    if (isAggregate === false) {
        orderKey = parser.getOrderKey() as OrderKey;
    }

    Rooms.forEach(function (Room: string[]) {

        // for each room in Rooms
        const matched: boolean = MatchesFilter(Room, filterKey, kind);

        if (matched || findall === true) {

            // if it is a normal query with an order key of size 1, quicksort to improve runtime
            if (isAggregate === false && orderKey !== undefined && orderKey.getSortKey().length === 1) {

                const orderBy: string = orderKey.getSortKey()[0]; // Average, UUID, Department
                const orderIndex: number = CSVLineValueFinder.getIndexOfKeyInLine(orderBy);

            // enters the splitLine into the right order of the FilteredArr, sorting by values in orderIndex.

            // IF THE INDEX's VALUE IS EQUAL TO ITS NEIGHBOURS, SORT BY ITS NEXT SHOW KEY
                FilteredArr.splice(
                    getSortedIndex(FilteredArr, Room[orderIndex], orderIndex), 0, Room);

            // if it is an aggregate array, or the order key does not exist, only check if matched.
            } else {
                FilteredArr.push(Room);
            }

        }
    });

    return FilteredArr;
};

const FilterCourses = function (parser: QueryParser, CSVs: string[][]): string[][] {
    // the array that the filtered lines will be pushed to
    const FilteredArr: string[][] = [];

    // getting variables for filtering
    const findall: boolean = parser.getFilterKey().GetFindAll();
    const filterKey: FilterKey = parser.getFilterKey();
    const isAggregate: boolean = parser.getAggregate();
    const kind = InsightDatasetKind.Courses;
    let orderKey: OrderKey;

    if (isAggregate === false) {
        orderKey = parser.getOrderKey() as OrderKey;
    }

    CSVs.forEach(function (CSVfile: string[]) {

        // remove the first element of the array (TITLE|AVERAGE|ETC)
        CSVfile.shift();

        // for each line in the current CSV file:
        CSVfile.forEach(function (line: string) {

            // does nothing if the line is only white space.
            if (line.replace(/\s/g, "").length > 0) {

                // break the line apart into each category
                const splitLine: string[] = line.split("|");

                // if the split line matches the filter, push the split line into the filteredArr
                // const valuefinder: CSVLineValueFinder = new CSVLineValueFinder();

                const matched: boolean = MatchesFilter(splitLine, filterKey, kind);

                if (matched || findall === true) {

                    // if it is a normal query with an order key of size 1, quicksort to improve runtime
                    if (isAggregate === false && orderKey !== undefined && orderKey.getSortKey().length === 1) {

                        const orderBy: string = orderKey.getSortKey()[0]; // Average, UUID, Department
                        const orderIndex: number = CSVLineValueFinder.getIndexOfKeyInLine(orderBy);

                    // enters the splitLine into the right order of the FilteredArr, sorting by values in orderIndex.

                    // IF THE INDEX's VALUE IS EQUAL TO ITS NEIGHBOURS, SORT BY ITS NEXT SHOW KEY
                        FilteredArr.splice(
                            getSortedIndex(FilteredArr, splitLine[orderIndex], orderIndex), 0, splitLine);

                    } else {
                        FilteredArr.push(splitLine);
                    }

                }
            }
        });
    });

    return FilteredArr;
};

const getSortedIndex = function (array: any, value: any, orderIndex: number): number {
    let low = 0;
    let high = array.length;

    while (low < high) {
        const mid = Math.floor((low + high) / 2);
        // change the "<" to ">" for decending order.
        // orderindex < value is ascending order.
        // orderindex > value is decending order.
        if (array[mid][orderIndex] < value) {
            low = mid + 1;

        } else {
            high = mid;
        }
    }
    return low;
};

    /*  const expectedFilterKey: string[] = [
        "find", "entries", "whose", "Average", "is", "greater", "than", "90", "and",
        "Department", "is", "\"adhe\"", "or", "Average", "is", "equal", "to", "95"];
    */

 // check if the current line matches the filter values
const MatchesFilter = function (splitLine: string[], filterKey: FilterKey, kind: InsightDatasetKind): boolean {

    const ops: OP[] = filterKey.GetOps();

    // make an array that stores whether or not an op has passed. valid: (true, false, "or")
    const OPResults: any[] = [];

    if (kind === InsightDatasetKind.Courses) {
        // for each op in the KEY, make sure that
        ops.forEach(function (op: OP) {

            // check if the current op passes for this line

            // if an OP EVER fails to pass, return false. (keep and, or in mind);

            if (op.GetIsSOP() === true) {
                // check if the current SOP matches the line
                const passesSOP: boolean = CheckIfSOPMatches(splitLine, op, kind);
                OPResults.push(passesSOP);

            } else {
                // check if the current MOP matches the line
                const passesMOP: boolean = CheckIfMOPMatches(splitLine, op, kind);
                OPResults.push(passesMOP);
            }

            // if the next op is an "or", push it to passing array. "and" is implied. (saves push runtime)
            if (op.GetNextOP() === "or") {
                OPResults.push(op.GetNextOP());
            }
        });
    }

    return CheckIfWholeLineMatches(OPResults);
};

const CheckIfSOPMatches = function (line: string[], op: OP, kind: InsightDatasetKind): boolean {
    // Example SOP = "Department", "is", "not" "\"adhe\"", "or";
    // example: Key: "Department", op: ["is" "not"], comparison: ""adhe"", length: 5, nextOP: "or"

    // only 8 possibilities for comparison
    // 1 length: is, includes. (2)                     -- done
    // 2 length: is not, begins with, ends with. (3)
    // 3 length: does not include. (1)                  -- done
    // 4 length: does not begin with, does not end with. (2)

    // if the kind is courses, ensure that the current s_key is a courses key.
    if (kind === InsightDatasetKind.Courses) {
        if (KeyValidator.IsSkeyRooms(op.GetKey())) {
            throw new Error("Filter/Sort: Invalid S_KEY: Current KIND is COURSES but found ROOM key: " + op.GetKey());
        }
    // if the kind is rooms, ensure that the current s_key is a rooms key.
    } else if (kind === InsightDatasetKind.Rooms) {
        if (KeyValidator.IsSkeyCourses(op.GetKey())) {
            throw new Error("Filter/Sort: Invalid S_KEY: Current KIND is ROOMS but found COURSES key: " + op.GetKey());
        }
    }

    // keyValue is the value thats actually in the csv.
    const keyValue: string = CSVLineValueFinder.getSkeyValue(op.GetKey(), line);
    // comparison value is the value stored in the OP
    const comparisonValue: string = op.GetComparison() as string;
    const operation: string = op.GetOp().join(" ");

    switch (operation) {

        case "is": {
            if (keyValue === comparisonValue) {
                // passes the op.
                return true;

            } else {
                // fails the op.
                return false;
            }
        }

        case "is not": {
            if (keyValue !== comparisonValue) {
                // passes the op.
                return true;

            } else {
                // fails the op.
                return false;
            }
        }

        case "includes": {
            if (keyValue.includes(comparisonValue)) {
                // passes the op.
                return true;

            } else {
                // fails the op.
                return false;
            }
        }

        case "does not include": {
            if (keyValue.includes(comparisonValue)) {
                return false;

            } else {
                return true;
            }
        }

        case "begins with": {
            if (keyValue.startsWith(comparisonValue) === true) {
                // passes the op.
                return true;

            } else {
                // fails the op.
                return false;
            }
        }

        case "does not begin with": {
            if (keyValue.startsWith(comparisonValue) !== true) {
                // passes the op.
                return true;

            } else {
                // fails the op.
                return false;
            }
        }

        case "ends with": {
            if (keyValue.endsWith(comparisonValue) === true) {
                // passes the op.
                return true;

            } else {
                // fails the op.
                return false;
            }
        }

        case "does not end with": {
            if (keyValue.endsWith(comparisonValue) !== true) {
                // passes the op.
                return true;

            } else {
                // fails the op.
                return false;
            }
        }

        default: {
            return false;
        }
    }
};

const CheckIfMOPMatches = function (line: string[], op: OP, kind: InsightDatasetKind): boolean {
    // Example MOP = "Average", "is", "not", "greater", "than", "90", "and"
    // example: Key: "Average", op: ["not", "greater"], comparison: 90, length: 6, nextOP: "and"

    // only 6 possibilities for comparison
    // [greater, less, equal]
    // [not greater, not less, not equal]

    // if the op has 2 words, it means there is a not as the prefix.

    // if the kind is courses, ensure that the current m_key is a courses key.
    if (kind === InsightDatasetKind.Courses) {
        if (KeyValidator.IsMkeyRooms(op.GetKey())) {
            throw new Error("Filter/Sort: Invalid S_KEY: Current KIND is COURSES but found ROOM key: " + op.GetKey());
        }
    // if the kind is rooms, ensure that the current m_key is a rooms key.
    } else if (kind === InsightDatasetKind.Rooms) {
        if (KeyValidator.IsMkeyCourses(op.GetKey())) {
            throw new Error("Filter/Sort: Invalid S_KEY: Current KIND is ROOMS but found COURSES key: " + op.GetKey());
        }
    }

    let prefixNot: boolean;

    if (op.GetOp().length === 2) {
        prefixNot = true;
    } else {
        prefixNot = false;
    }

    const keyValue: number = CSVLineValueFinder.getMkeyValue(op.GetKey(), line) as number;
    const comparisonValue: number = op.GetComparison() as number;

    // operation is "greater", "less" or "equal"
    let operation: string;

    if (prefixNot) {
        operation = op.GetOp()[1]; // if not is prefix, operation is stored in 2nd index
    } else {
        operation = op.GetOp()[0]; // if there is no prefix, operation is stored in 1st index.
    }

    switch (operation) {

        case "greater": {
            // if prefixNot = true, it expects (keyValue > ComparisonValue) = false;
                if ( (+keyValue > comparisonValue) !== prefixNot ) {
                    // passes the op.
                    return true;

                } else {
                    // fails the op.
                    return false;
                }
        }

        case "less": {
             // if prefixNot = true, it expects (keyValue < ComparisonValue) = false;
            if ( (+keyValue < comparisonValue) !== prefixNot ) {
                // passes the op.
                return true;

            } else {
                // fails the op.
                return false;
            }

        }

        case "equal": {
             // if prefixNot = true, it expects (keyValue === ComparisonValue) = false;
            // 94.44 is the first KeyValue
            if ( (+keyValue === comparisonValue) !== prefixNot ) {
                // throw new Error("properly detected that: " + keyValue + " is equal to " + 94.44);
                // passes the op.
                return true;

            } else {
                return false;
            }
        }

        default: {
            return false;
        }
    }
};

const CheckIfWholeLineMatches = function (matched: any[]): boolean {
    // passing: [true]                          --- matched = true; (all true)
    // passing: [false]                         --- matched = false; (all false)

    // passing: [true, "and", true]             --- matched = true; (all sequential ands must be true)
    // passing: [true, "and", false]            --- matched = false; (all sequential ands must be true)
    // passing: [false, "and", false]           --- matched = false; (all sequential ands must be true)

    // passing: [false, "or", false]           --- matched = false; (at least one side of the or must be true)
    // passing: [true, "or", false]            --- matched = true; (at least one side of the or must be true)
    // passing: [true, "or", true]             --- matched = true; (at least one side of the or must be true)

    // passing: [true, "and", true, "or", true] --- matched = true; (all true)
    // passing: [true, "and", false, "or", true] --- matched = true; (the right side of the or still evaluates to true)

    // passing: [true, "and", false, "or", true, "and", true, "or", false]
    // [true, "and", false] = false.      [true, "and", true] = true
    // = [false, "or", true, "or" false]
    // because at least one of the or's is true, line evaluates to true.

    // values are [true, false, "or"]

    return AtLeastOneOrPasses(matched);
};

const AtLeastOneOrPasses = (matched: any[]): boolean => {

    let allMatched = true;

    for (const value of matched) {
        // once you reach an "or", check if there was never a single false before this or.
        if (value === "or") {

            // if there was not a single false before this or, return true.
            if (allMatched === true) {
                return true;

            // if there was a single false, reset allMatched to true, and check next chunk.
            } else {
                allMatched = true;
            }
        }

        // if any value in a sequence is false, allMatched is false.
        if (value === false) {
            allMatched = false;
        }
    }
    return allMatched;
};
