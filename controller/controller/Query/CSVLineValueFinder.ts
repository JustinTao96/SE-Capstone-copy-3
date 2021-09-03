import { ICSV } from "../IZipIDataInterface";

export default class CSVLineValueFinder {

    public static getKeyValue = function (key: string, line: string[]): string {

        switch (key) {

            case "Average": {
                return CSVLineValueFinder.getAvg(line);
            }

            case "Pass": {
                return CSVLineValueFinder.getPass(line);
            }

            case "Fail": {
                return CSVLineValueFinder.getFail(line);
            }

            case "Audit": {
                 return CSVLineValueFinder.getAudit(line);
            }

            case "Year": {
                 return CSVLineValueFinder.getYear(line);
            }

            case "Latitude": {
                return CSVLineValueFinder.getRoomLat(line);
            }

            case "Longitude": {
                 return CSVLineValueFinder.getRoomLon(line);
            }

            case "Seats": {
                 return CSVLineValueFinder.getRoomSeats(line);
            }

            case "Department": {
                return CSVLineValueFinder.getSubject(line);
            }

            case "ID": {
                return CSVLineValueFinder.getCourse(line);
            }

            case "Instructor": {
                return CSVLineValueFinder.getProfessor(line);
            }

            case "Title": {
                 return CSVLineValueFinder.getTitle(line);
            }

            case "UUID": {
                return CSVLineValueFinder.getId(line);
            }

            case "FullName": {
                 return CSVLineValueFinder.getRoomFullName(line);
            }

            case "ShortName": {
                 return CSVLineValueFinder.getRoomShortName(line);
            }

            case "Number": {
                return CSVLineValueFinder.getRoomNumber(line);
            }

            case "Name": {
                return CSVLineValueFinder.getRoomName(line);
            }

            case "Address": {
                 return CSVLineValueFinder.getRoomAddress(line);
            }

            case "Type": {
                 return CSVLineValueFinder.getRoomType(line);
            }

            case "Furniture": {
                 return CSVLineValueFinder.getRoomFurniture(line);
            }

            case "Link": {
                 return CSVLineValueFinder.getRoomHref(line);
            }

            default: {
                throw new Error("Filter error: key is not a valid SKEY but isSOP on the OP object is = true");
            }
        }
    };

    public static getMkeyValue = function (key: string, line: string[]): number {
        let value: number;

        switch (key) {

            case "Average": {
                const tempValue: string = CSVLineValueFinder.getAvg(line);
                value = Number(tempValue); // (tempValue as unknown) as number;
                return value;
            }

            case "Pass": {
                const tempValue: string = CSVLineValueFinder.getPass(line);
                value = Number(tempValue);
                return value;
            }

            case "Fail": {
                const tempValue: string = CSVLineValueFinder.getFail(line);
                value = Number(tempValue);
                return value;
            }

            case "Audit": {
                const tempValue: string = CSVLineValueFinder.getAudit(line);
                value = Number(tempValue);
                return value;
            }

            case "Year": {
                const tempValue: string = CSVLineValueFinder.getYear(line);
                value = Number(tempValue);
                return value;
            }

            case "Latitude": {
                const tempValue: string = CSVLineValueFinder.getRoomLat(line);
                value = Number(tempValue);
                return value;
            }

            case "Longitude": {
                const tempValue: string = CSVLineValueFinder.getRoomLon(line);
                value = Number(tempValue);
                return value;
            }

            case "Seats": {
                const tempValue: string = CSVLineValueFinder.getRoomSeats(line);
                value = Number(tempValue);
                return value;
            }

            default: {
                throw new Error("Filter error: key is not a valid MKEY but isSOP on the OP object is = false");
            }
        }
    };

    public static getSkeyValue = function (key: string, line: string[]): string {
        let value: string;

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

    // returns the per-line index in which this key type is stored.
    public static getIndexOfKeyInLine = function (orderBy: string): number {
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

        // given a line of CSV, returns the corresponding value.
        public static getTitle = function (line: string[]) {
            return line[0];
        };
        public static getId = function (line: string[]) {
            return line[1];
        };
        public static getProfessor = function (line: string[]) {
            return line[2];
        };
        public static getAudit = function (line: string[]) {
            return line[3];
        };
        public static getYear = function (line: string[]) {
            if (line[4] === "overall") {
                return "1900";
            } else {
                return line[4];
            }
        };
        // getCourse is actually get ID 504b.
        public static getCourse = function (line: string[]) {
            return line[5];
        };
        public static getPass = function (line: string[]) {
            return line[6];
        };
        public static getFail = function (line: string[]) {
            return line[7];
        };
        public static getAvg = function (line: string[]) {
            return line[8];
        };
        public static getSubject = function (line: string[]) {
            return line[9];
        };
        public static getSection = function (line: string[]) {
            return line[10];
        };

        // Getters for Room Values:
        // [fullname, shortname, number, name, address, lat, lon, seats, type, furniture, href]
        public static getRoomFullName = function (line: string[]) {
            return line[0];
        };
        public static getRoomShortName = function (line: string[]) {
            return line[1];
        };
        public static getRoomNumber = function (line: string[]) {
            return line[2];
        };
        public static getRoomName = function (line: string[]) {
            return line[3];
        };
        public static getRoomAddress = function (line: string[]) {
            return line[4];
        };
        public static getRoomLat = function (line: string[]) {
            return line[5];
        };
        public static getRoomLon = function (line: string[]) {
            return line[6];
        };
        public static getRoomSeats = function (line: string[]) {
            return line[7];
        };
        public static getRoomType = function (line: string[]) {
            return line[8];
        };
        public static getRoomFurniture = function (line: string[]) {
            return line[9];
        };
        public static getRoomHref = function (line: string[]) {
            return line[10];
        };

        // transforms ICSV into an array of csvs each with an array of its lines.
        public static SplitCSVByLine = (csvArray: ICSV[]): string[][] => {

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

        // returns the number of rows on the csv file
        public static GetRows(content: ICSV[], removeHeader: boolean): number {
            let rows = 0;
            const splitArr: string[][] = CSVLineValueFinder.SplitCSVByLine(content);

            splitArr.forEach(function (csv: string[]) {

                // remove all the white space and blank lines from the csv.
                const trimmedCSV: string[] = csv.filter((s) => s.replace(/\s+/g, "").length !== 0);

                // removes the first element from the array: AVG||TITLE||etc.
                if (removeHeader === true) {
                    trimmedCSV.shift();
                }

                // each csv is now an array of strings with a length.
                const lineCount = trimmedCSV.length;

                // adds current lineCount to the total rows.
                rows = rows + lineCount;
            });

            return rows;
        }
}
