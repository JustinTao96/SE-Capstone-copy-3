import { IZipContent, ICSV, IRoomContent } from "../IZipIDataInterface";
import { InsightDatasetKind, InsightResponse, InsightResponseSuccessBody } from "../IInsightFacade";
import { QueryParser } from "./QueryParser";
import { FilterCSV } from "../Query/FilterAndSort";
import { FilterKey } from "./FilterKey";
import { OrderKey } from "./OrderKey";
import { DisplayKey } from "./DisplayKey";
import { getResponseBody } from "../Query/Display";
import { jsonp } from "restify";
import { AggregateDatasetKey } from "./AggregateDatasetKey";
import { AggregateDisplayKey } from "./AggregateDisplayKey";
import { AggregateOrderKey } from "./AggregateOrderKey";
import { IGroupedKey } from "./GroupedKeyInterface";
import KeyValidator from "./KeyValidator";
import SortHelper from "../Query/SortHelper";
import CSVLineValueFinder from "../Query/CSVLineValueFinder";
import CustomKeyReader from "../Query/CustomKeyReader";

export class ParserResponse {
    public TestFilteredArr: string[][];
    protected response: InsightResponse;
    protected openedJson: {};

    // i will be looking for a specific key's base64 string and decoding it back into json

            // add an object that has the file path and the string contents of the csv to zipContent.

    public async GetResponse(parser: QueryParser, data: { [id: string]: IZipContent }): Promise<InsightResponse> {
        // Figure out which key (id) to open
        const idToOpen: string = parser.getDatasetKey().getID();
        const parsedKind: InsightDatasetKind = parser.getDatasetKey().getKind();
        const datasetKind: InsightDatasetKind = data[idToOpen].kind;

        if (parsedKind !== datasetKind) {
            throw new Error("Parser Response: query KIND does not match the KIND of the dataset");
        }

        // determining if the kind is courses or rooms.
        if (parser.getDatasetKey().getKind() === InsightDatasetKind.Courses) {

            // TODO: implement a way to ensure that only keys of the current KIND are included in the parser.
            if (this.EnsureCorrectKeys() === false) {
                throw new Error("ParserResponse Error: found a ROOMS key but the query is of type COURSES");
            }

            // get the results for courses

            // get an array of csv files from the data dictionary
            const csvArray: ICSV[] = this.GetCSVFilesFromDictionary(idToOpen, data);

            // split each csv array by line so we can access each line:
            const splitArray: string[][] = this.SplitCSVByLine(csvArray);

            // get a different response based on whether the query is aggregate or normal
            if (parser.getAggregate() === true) {
                return this.AggregateQueryResponse(parser, splitArray);

            } else {
                return this.NormalQueryResponse(parser, splitArray);
            }

        // get the results for rooms.
        } else if (parser.getDatasetKey().getKind() === InsightDatasetKind.Rooms) {

            // TODO: implement a way to ensure that only keys of the current KIND are included in the parser.
            if (this.EnsureCorrectKeys() === false) {
                throw new Error("ParserResponse Error: found a ROOMS key but the query is of type COURSES");
            }

            // get an array of rooms objects files from the data dictionary
            const roomContent: IRoomContent[] = this.getRoomFilesFromDictionary(idToOpen, data);

            // turn the IRoomContent[] into an string[][] so it works with our legacy functions.
            const splitArray: string[][] = this.RoomContentToStringArray(roomContent);

            // get a different response based on whether the query is aggregate or normal
            if (parser.getAggregate() === true) {
                return this.AggregateQueryResponse(parser, splitArray);

            } else {
                return this.NormalQueryResponse(parser, splitArray);
            }
        }

    }

    public getTestFilteredArr() {
        return this.TestFilteredArr;
    }

    private NormalQueryResponse(parser: QueryParser, splitArray: string[][]): InsightResponse {
        // filtering the csvs
        const filteredArr: string[][] = this.FilterCSVFiles(splitArray, parser);

        // for each value in the filteredArr[], obtain the lines that match our Show: showedArr[]
        const responseCode: number = 200;
        const responseResult: Array<{[key: string]: any}> =
        this.GetLinesToShow(filteredArr, parser.getDisplayKey() as DisplayKey, parser.getDatasetKey().getID());

        // create a response body to store the response results.
        const responseBody: InsightResponseSuccessBody = {
            result: responseResult,
        };

        // if all these steps are successful, set this.response.body to sortedArr[], and code to 204.
        this.response = {code: responseCode, body: responseBody};
        return this.response;
    }

    private AggregateQueryResponse(parser: QueryParser, splitArray: string[][]): InsightResponse  {
        // find the aggregate query response here.

        // declaring fields
        // TODO: implement a way to ensure that only keys of the current KIND are included in the parser.
        const datasetKey: AggregateDatasetKey = parser.getDatasetKey() as AggregateDatasetKey;
        const displayKey: AggregateDisplayKey = parser.getDisplayKey() as AggregateDisplayKey;
        const filterKey: FilterKey = parser.getFilterKey();
        const orderKey: AggregateOrderKey = parser.getOrderKey() as AggregateOrderKey;

        // 1. create the COLLUMNS key
        const collumns: string[] = this.GetCollumns(datasetKey, displayKey);

        if (this.KeysExistInCollumns(collumns, displayKey, orderKey) === false) {
            throw new Error(
                "ensure that the keys in the displayKey and sortKey are custom, or declared in groupedBy.");
        }

        // 2. filter the Query
        const filteredArr: string[][] = this.FilterCSVFiles(splitArray, parser);

        // 3. split the dataset into groups:
        const splitGroups: string[][][] = this.SplitByGroup(parser, filteredArr);

        // 4. create an aggregate Array []{}, where each group is condensed into 1 object
        const aggArr: any[] = this.GetAggregateArray(parser, splitGroups);

        // 5. sort the aggregate Array to get a sorted []{}.
        const sortedAggArr: any[] = this.SortAggregateArray(parser, aggArr);

        // 6. create the response body and response code and return it.
        const responseCode = 200;
        const responseBody: InsightResponseSuccessBody = {
            result: sortedAggArr,
        };

        this.response = {code: responseCode, body: responseBody};
        return this.response;
    }

    private GetCollumns = (datasetKey: AggregateDatasetKey, displayKey: AggregateDisplayKey): string[] => {
        /*
            1. create a term called the COLLUMNS key: string[].

            the COLLUMS is made up of:
            1. all values in the dataset key's GROUPEDBY: string[].
            2. all custom key names stored in the DISPLAY key's MEANINGS: string[].

	        - create and save the COLLUMNS[] inside of query parser.
	        - ensure that the DISPLAY KEY's keysToShow[] only includes values found in the COLLUMNS[].
	        - ensure that the SORT KEY's sortKey[] only includes values found in the COLLUMNS[].
        */

        const collumns: string[] = [];
        const groupedBy: string[] = datasetKey.GetGroupedBy();
        const meanings: IGroupedKey[] = displayKey.getMeaningsOfSpecialKeys();

        groupedBy.forEach(function (str: string) {
            collumns.push(str);
        });

        meanings.forEach(function (groupedKey: IGroupedKey) {
            collumns.push(groupedKey.name);
        });

        return collumns;
    }

    private KeysExistInCollumns = (
        collumns: string[], displayKey: AggregateDisplayKey, orderKey: AggregateOrderKey): boolean => {

        const keysToShow: string[] = displayKey.GetKeysToShow();
        const sortKey: string[] = orderKey.getSortKey();

        const keysToShowMatched: boolean = keysToShow.every( (key) => collumns.includes(key));
        const sortKeyMatched: boolean = sortKey.every( (key) => collumns.includes(key));

        if (keysToShowMatched && sortKeyMatched) {
            return true;

        } else {
            return false;
        }
    }

    private SplitByGroup = (parser: QueryParser, filteredArr: string[][]): string[][][] => {

        const groupedBy: string[] = (parser.getDatasetKey() as AggregateDatasetKey).GetGroupedBy();

        // sorts the filterred array by groupedBy categories before we can split it
        const sortedArr: string[][] = SortHelper.sort2DGivenArray(filteredArr, groupedBy);

        // splits the array into organized groups: [group][line][word]
        const splitArr: string[][][] = SortHelper.splitSortedArrByGroup(sortedArr, groupedBy);

        return splitArr;
    }

    private FilterAggregateFiles = (parser: QueryParser): string[][] => {
        return null;
    }

    private GetAggregateArray = (parser: QueryParser, splitGroups: string[][][]): any[] => {
        const displayKey: AggregateDisplayKey = parser.getDisplayKey() as AggregateDisplayKey;
        const datasetKey: AggregateDatasetKey = parser.getDatasetKey() as AggregateDatasetKey;

        const id: string = datasetKey.getID();
        const keysToShow: string[] = displayKey.GetKeysToShow();
        const meaningsOfCustomKeys: IGroupedKey[] = displayKey.getMeaningsOfSpecialKeys();

        // this is an array of dictionaries: []{[key: string]: any}
        const aggArr: any[] = [];

        splitGroups.forEach((group: string[][]) => {
             // push this dict into aggArr at the end of each loop.
            const currentAggDictionary: {[key: string]: any} = {};
            const firstLineFromGroup: string[] = group[0];

            // this should populate the currentAggDictionary.
            keysToShow.forEach((key: string) => {

                if (KeyValidator.IsMkey(key)) {
                    const mValue: number = CSVLineValueFinder.getMkeyValue(key, firstLineFromGroup);
                    const lowercaseKey: string = key.toLowerCase();
                    const keyName = `${id}_${lowercaseKey}`;

                    currentAggDictionary[keyName] = mValue;

                } else if (KeyValidator.IsSkey(key)) {
                    const sValue: string = CSVLineValueFinder.getSkeyValue(key, firstLineFromGroup);
                    const lowercaseKey: string = key.toLowerCase();
                    const keyName = `${id}_${lowercaseKey}`;

                    currentAggDictionary[keyName] = sValue;

                    // it must be a custom key at this point:
                } else {
                    // create the custom
                    const customKeyName = key;
                    const customKeyValue = CustomKeyReader.GetCustomKeyValue(key, meaningsOfCustomKeys, group);
                    currentAggDictionary[customKeyName] = customKeyValue;
                }
            });

            aggArr.push(currentAggDictionary);
        });

        return aggArr;
    }

    private SortAggregateArray = (parser: QueryParser, aggArr: any[]): any[] => {
        // do not sort the array if the ORDER key does not exist.
        if (parser.getOrderKey() === undefined || parser.getOrderKey() === null) {
            return aggArr;
        }

        // if the order key exists, sort the array and return it.
        const orderKey: AggregateOrderKey = parser.getOrderKey() as AggregateOrderKey;
        const operator: string = orderKey.getOperator();
        const sortBy: string[] = orderKey.getSortKey();

        return SortHelper.SortAggArray(aggArr, sortBy, operator);
    }

    private GetCSVFilesFromDictionary = (key: string, data: { [id: string]: IZipContent }): ICSV[] => {
        // checks if the string key is a key within the data object.
        if (key in data) {
            // return the value associated with the key
            return data[key].content as ICSV[];
        } else {
            throw new Error("Error: the specified dataset cannot be found");
        }
    }

    private SplitCSVByLine = (csvArray: ICSV[]): string[][] => {

        const splitArray: string[][] = [];

        // function to split the csv files by new line
        function splitLines(t: string) { return t.split(/\r\n|\r|\n/); }

        // for each value inside of zipContent,
        // split all lines of the current csv string and push it into the split array[][].
        csvArray.forEach((file: ICSV) => {
            splitArray.push(splitLines(file.content));
        });

        return splitArray;
    }

    private FilterCSVFiles = (
        splitArray: string[][], parser: QueryParser): string[][] => {

        const newarr: string[][] = FilterCSV(splitArray, parser);

        return newarr;
    }

    // figure out which lines to show and return them as a proper insight response
    private GetLinesToShow =
    (FilteredArr: string[][], displayKey: DisplayKey, id: string): Array<{[key: string]: any}> => {

        const body: Array<{[key: string]: any}> = getResponseBody(id, displayKey, FilteredArr);
        return body;
    }

    private getRoomFilesFromDictionary = (idToOpen: string, data: {[id: string]: IZipContent }): IRoomContent[] => {
        // get the array of IRoomContent from data.
        return null;
    }

    private RoomContentToStringArray = (roomContent: IRoomContent[]): string[][] => {
        // turn an array of IRoomContent into an array of string arrays
        // [fullname, shortname, number, name, address, lat, lon, seats, type, furniture, href]

        const Rooms: string[][] = [];

        roomContent.forEach(function (room: IRoomContent) {
            const roomArray: string[] = [];

            roomArray.push(room.fullname);
            roomArray.push(room.shortname);
            roomArray.push(room.number);
            roomArray.push(room.name);
            roomArray.push(room.address);
            roomArray.push(String(room.lat));
            roomArray.push(String(room.lon));
            roomArray.push(String(room.seats));
            roomArray.push(room.type);
            roomArray.push(room.furniture);
            roomArray.push(room.href);

            Rooms.push(roomArray);
        });

        return Rooms;
    }
}
