"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CSVLineValueFinder {
    static GetRows(content, removeHeader) {
        let rows = 0;
        const splitArr = CSVLineValueFinder.SplitCSVByLine(content);
        splitArr.forEach(function (csv) {
            const trimmedCSV = csv.filter((s) => s.replace(/\s+/g, "").length !== 0);
            if (removeHeader === true) {
                trimmedCSV.shift();
            }
            const lineCount = trimmedCSV.length;
            rows = rows + lineCount;
        });
        return rows;
    }
}
exports.default = CSVLineValueFinder;
CSVLineValueFinder.getMkeyValue = function (key, line) {
    let value;
    switch (key) {
        case "Average": {
            const tempValue = CSVLineValueFinder.getAvg(line);
            value = Number(tempValue);
            return value;
        }
        case "Pass": {
            const tempValue = CSVLineValueFinder.getPass(line);
            value = Number(tempValue);
            return value;
        }
        case "Fail": {
            const tempValue = CSVLineValueFinder.getFail(line);
            value = Number(tempValue);
            return value;
        }
        case "Audit": {
            const tempValue = CSVLineValueFinder.getAudit(line);
            value = Number(tempValue);
            return value;
        }
        case "Year": {
            const tempValue = CSVLineValueFinder.getYear(line);
            value = Number(tempValue);
            return value;
        }
        case "Latitude": {
            const tempValue = CSVLineValueFinder.getRoomLat(line);
            value = Number(tempValue);
            return value;
        }
        case "Longitude": {
            const tempValue = CSVLineValueFinder.getRoomLon(line);
            value = Number(tempValue);
            return value;
        }
        case "Seats": {
            const tempValue = CSVLineValueFinder.getRoomSeats(line);
            value = Number(tempValue);
            return value;
        }
        default: {
            throw new Error("Filter error: key is not a valid MKEY but isSOP on the OP object is = false");
        }
    }
};
CSVLineValueFinder.getSkeyValue = function (key, line) {
    let value;
    switch (key) {
        case "Department": {
            value = CSVLineValueFinder.getSubject(line);
            return value;
        }
        case "ID": {
            value = CSVLineValueFinder.getCourse(line);
            return value;
        }
        case "Instructor": {
            value = CSVLineValueFinder.getProfessor(line);
            return value;
        }
        case "Title": {
            value = CSVLineValueFinder.getTitle(line);
            return value;
        }
        case "UUID": {
            value = CSVLineValueFinder.getId(line);
            return value;
        }
        case "FullName": {
            value = CSVLineValueFinder.getRoomFullName(line);
            return value;
        }
        case "ShortName": {
            value = CSVLineValueFinder.getRoomShortName(line);
            return value;
        }
        case "Number": {
            value = CSVLineValueFinder.getRoomNumber(line);
            return value;
        }
        case "Name": {
            value = CSVLineValueFinder.getRoomName(line);
            return value;
        }
        case "Address": {
            value = CSVLineValueFinder.getRoomAddress(line);
            return value;
        }
        case "Type": {
            value = CSVLineValueFinder.getRoomType(line);
            return value;
        }
        case "Furniture": {
            value = CSVLineValueFinder.getRoomFurniture(line);
            return value;
        }
        case "Link": {
            value = CSVLineValueFinder.getRoomHref(line);
            return value;
        }
        default: {
            throw new Error("Filter error: key is not a valid SKEY but isSOP on the OP object is = true");
        }
    }
};
CSVLineValueFinder.getIndexOfKeyInLine = function (orderBy) {
    switch (orderBy) {
        case "Title": {
            return 0;
        }
        case "UUID": {
            return 1;
        }
        case "Instructor": {
            return 2;
        }
        case "Audit": {
            return 3;
        }
        case "Year": {
            return 4;
        }
        case "ID": {
            return 5;
        }
        case "Pass": {
            return 6;
        }
        case "Fail": {
            return 7;
        }
        case "Average": {
            return 8;
        }
        case "Department": {
            return 9;
        }
        case "Section": {
            return 10;
        }
    }
};
CSVLineValueFinder.getTitle = function (line) {
    return line[0];
};
CSVLineValueFinder.getId = function (line) {
    return line[1];
};
CSVLineValueFinder.getProfessor = function (line) {
    return line[2];
};
CSVLineValueFinder.getAudit = function (line) {
    return line[3];
};
CSVLineValueFinder.getYear = function (line) {
    if (line[4] === "overall") {
        return "1900";
    }
    else {
        return line[4];
    }
};
CSVLineValueFinder.getCourse = function (line) {
    return line[5];
};
CSVLineValueFinder.getPass = function (line) {
    return line[6];
};
CSVLineValueFinder.getFail = function (line) {
    return line[7];
};
CSVLineValueFinder.getAvg = function (line) {
    return line[8];
};
CSVLineValueFinder.getSubject = function (line) {
    return line[9];
};
CSVLineValueFinder.getSection = function (line) {
    return line[10];
};
CSVLineValueFinder.getRoomFullName = function (line) {
    return line[0];
};
CSVLineValueFinder.getRoomShortName = function (line) {
    return line[1];
};
CSVLineValueFinder.getRoomNumber = function (line) {
    return line[2];
};
CSVLineValueFinder.getRoomName = function (line) {
    return line[3];
};
CSVLineValueFinder.getRoomAddress = function (line) {
    return line[4];
};
CSVLineValueFinder.getRoomLat = function (line) {
    return line[5];
};
CSVLineValueFinder.getRoomLon = function (line) {
    return line[6];
};
CSVLineValueFinder.getRoomSeats = function (line) {
    return line[7];
};
CSVLineValueFinder.getRoomType = function (line) {
    return line[8];
};
CSVLineValueFinder.getRoomFurniture = function (line) {
    return line[9];
};
CSVLineValueFinder.getRoomHref = function (line) {
    return line[10];
};
CSVLineValueFinder.SplitCSVByLine = (csvArray) => {
    const splitArray = [];
    function splitLines(t) { return t.split(/\r\n|\r|\n/); }
    csvArray.forEach((file) => {
        splitArray.push(splitLines(file.content));
    });
    return splitArray;
};
//# sourceMappingURL=CSVLineValueFinder.js.map