export default class KeyValidator {

    // defining restricted words:
    public static KEYWORD: string[] = [
        "In", "dataset", "find", "all", "show", "and", "or", "sort", "by", "entries",
        "is", "the", "of", "whose"];

    public static M_OP: string[] = [
        "is", "not", "greater", "less", "than", "equal",
        "to"];

    public static S_OP: string[] = [
            "is", "not", "includes", "does", "include",
            "begins", "does", "begin", "ends", "does", "end", "with"];

    public static AGGREGATOR: string[] = ["MAX", "MIN", "AVG", "SUM"];

    public static IsAggregator(str: string): boolean {
        if (KeyValidator.AGGREGATOR.indexOf(str) !== -1) {
            return true;
        } else {
            return false;
        }
    }

    public static IsCKey = (str: string): boolean => {
        // CKey is valid as long as it does not include a KEYWORD, M_OP, S_OP, or space, _,
        if (str.includes(" ") || str.includes("_")) {
            return false;
        }

        const keywords: string[] = KeyValidator.KEYWORD;
        const mops: string[] = KeyValidator.M_OP;
        const sops: string[] = KeyValidator.S_OP;

        // if str can be found in any of these arrays, return false.
        if (keywords.indexOf(str) !== -1 || mops.indexOf(str) !== -1 || sops.indexOf(str) !== -1) {
            return false;

        } else {
            return true;
        }
    }

    public static IsSkey = (str: string): boolean => {
        const S_KEY: string[] = [
        "Department", "ID", "Instructor", "Title", "UUID",
        "FullName", "ShortName", "Number", "Name", "Address", "Type", "Furniture", "Link"];

        let bool: boolean = false;

        S_KEY.forEach((skey) => {
            if (str === skey) {
                bool = true;
                return;
            }
        });

        return bool;
    }

    public static IsMkey = (str: string): boolean => {
        const M_KEY: string[] = [
        "Average", "Pass", "Fail", "Audit",
        "Latitude", "Longitude", "Seats", "Year"];

        let bool: boolean = false;

        M_KEY.forEach((mkey) => {
            if (str === mkey) {
                bool = true;
                return;
            }
        });

        return bool;
    }

    public static IsSkeyCourses = (str: string): boolean => {
        const S_KEY: string[] = ["Department", "ID", "Instructor", "Title", "UUID"];
        let bool: boolean = false;

        S_KEY.forEach((skey) => {
            if (str === skey) {
                bool = true;
                return;
            }
        });

        return bool;
    }

    public static IsMkeyCourses = (str: string): boolean => {
        const M_KEY: string[] = ["Average", "Pass", "Fail", "Audit"];
        let bool: boolean = false;

        M_KEY.forEach((mkey) => {
            if (str === mkey) {
                bool = true;
                return;
            }
        });

        return bool;
    }

    public static IsSkeyRooms = (str: string): boolean => {
        const M_KEY: string[] = [
            "FullName", "ShortName", "Number", "Name", "Address", "Type", "Furniture", "Link"];

        let bool: boolean = false;

        M_KEY.forEach((mkey) => {
            if (str === mkey) {
                bool = true;
                return;
            }
        });

        return bool;
    }

    public static IsMkeyRooms = (str: string): boolean => {
        const M_KEY: string[] = ["Latitude", "Longitude", "Seats", "Year"];
        let bool: boolean = false;

        M_KEY.forEach((mkey) => {
            if (str === mkey) {
                bool = true;
                return;
            }
        });

        return bool;
    }
}
