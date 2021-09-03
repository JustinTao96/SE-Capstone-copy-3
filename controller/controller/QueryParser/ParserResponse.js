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
const IInsightFacade_1 = require("../IInsightFacade");
const FilterAndSort_1 = require("../Query/FilterAndSort");
const Display_1 = require("../Query/Display");
class ParserResponse {
    constructor() {
        this.GetCollumns = (datasetKey, displayKey) => {
            const collumns = [];
            const groupedBy = datasetKey.GetGroupedBy();
            const meanings = displayKey.getMeaningsOfSpecialKeys();
            groupedBy.forEach(function (str) {
                collumns.push(str);
            });
            meanings.forEach(function (groupedKey) {
                collumns.push(groupedKey.name);
            });
            return collumns;
        };
        this.KeysExistInCollumns = (collumns, displayKey, orderKey) => {
            const keysToShow = displayKey.GetKeysToShow();
            const sortKey = orderKey.getSortKey();
            const keysToShowMatched = keysToShow.every((key) => collumns.includes(key));
            const sortKeyMatched = sortKey.every((key) => collumns.includes(key));
            if (keysToShowMatched && sortKeyMatched) {
                return true;
            }
            else {
                return false;
            }
        };
        this.SplitByGroup = (parser) => {
            return null;
        };
        this.FilterAggregateFiles = (parser) => {
            return null;
        };
        this.GetAggregateArray = (parser) => {
            return null;
        };
        this.SortAggregateArray = (parser) => {
            return null;
        };
        this.GetCSVFilesFromDictionary = (key, data) => {
            if (key in data) {
                return data[key].content;
            }
            else {
                throw new Error("Error: the specified dataset cannot be found");
            }
        };
        this.SplitCSVByLine = (csvArray) => {
            const splitArray = [];
            function splitLines(t) { return t.split(/\r\n|\r|\n/); }
            csvArray.forEach((file) => {
                splitArray.push(splitLines(file.content));
            });
            return splitArray;
        };
        this.FilterCSVFiles = (splitArray, parser) => {
            const newarr = FilterAndSort_1.FilterCSV(splitArray, parser);
            return newarr;
        };
        this.GetLinesToShow = (FilteredArr, displayKey, id) => {
            const body = Display_1.getResponseBody(id, displayKey, FilteredArr);
            return body;
        };
        this.getRoomFilesFromDictionary = (idToOpen, data) => {
            return null;
        };
        this.RoomContentToStringArray = (roomContent) => {
            const Rooms = [];
            roomContent.forEach(function (room) {
                const roomArray = [];
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
        };
    }
    GetResponse(parser, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const idToOpen = parser.getDatasetKey().getID();
            const parsedKind = parser.getDatasetKey().getKind();
            const datasetKind = data[idToOpen].kind;
            if (parsedKind !== datasetKind) {
                throw new Error("Parser Response: query KIND does not match the KIND of the dataset");
            }
            if (parser.getDatasetKey().getKind() === IInsightFacade_1.InsightDatasetKind.Courses) {
                const csvArray = this.GetCSVFilesFromDictionary(idToOpen, data);
                const splitArray = this.SplitCSVByLine(csvArray);
                if (parser.getAggregate() === true) {
                    return this.AggregateQueryResponse(parser, splitArray);
                }
                else {
                    return this.NormalQueryResponse(parser, splitArray);
                }
            }
            else if (parser.getDatasetKey().getKind() === IInsightFacade_1.InsightDatasetKind.Rooms) {
                const roomContent = this.getRoomFilesFromDictionary(idToOpen, data);
                const splitArray = this.RoomContentToStringArray(roomContent);
                if (parser.getAggregate() === true) {
                    return this.AggregateQueryResponse(parser, splitArray);
                }
                else {
                    return this.NormalQueryResponse(parser, splitArray);
                }
            }
        });
    }
    getTestFilteredArr() {
        return this.TestFilteredArr;
    }
    NormalQueryResponse(parser, splitArray) {
        const filteredArr = this.FilterCSVFiles(splitArray, parser);
        const responseCode = 200;
        const responseResult = this.GetLinesToShow(filteredArr, parser.getDisplayKey(), parser.getDatasetKey().getID());
        const responseBody = {
            result: responseResult,
        };
        this.response = { code: responseCode, body: responseBody };
        return this.response;
    }
    AggregateQueryResponse(parser, splitArray) {
        const datasetKey = parser.getDatasetKey();
        const displayKey = parser.getDisplayKey();
        const filterKey = parser.getFilterKey();
        const orderKey = parser.getOrderKey();
        const collumns = this.GetCollumns(datasetKey, displayKey);
        if (this.KeysExistInCollumns(collumns, displayKey, orderKey) === false) {
            throw new Error("ensure that the keys in the displayKey and sortKey are custom, or declared in groupedBy.");
        }
        const filteredArr = this.FilterCSVFiles(splitArray, parser);
        const splitGroups = this.SplitByGroup(parser);
        const aggArr = this.GetAggregateArray(parser);
        const sortedAggArr = this.SortAggregateArray(parser);
        const responseCode = 200;
        const responseBody = {
            result: sortedAggArr,
        };
        this.response = { code: responseCode, body: responseBody };
        return this.response;
    }
}
exports.ParserResponse = ParserResponse;
//# sourceMappingURL=ParserResponse.js.map