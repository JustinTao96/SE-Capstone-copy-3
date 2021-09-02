"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class KeyValidator {
    static IsAggregator(str) {
        if (KeyValidator.AGGREGATOR.indexOf(str) !== -1) {
            return true;
        }
        else {
            return false;
        }
    }
}
exports.default = KeyValidator;
KeyValidator.KEYWORD = [
    "In", "dataset", "find", "all", "show", "and", "or", "sort", "by", "entries",
    "is", "the", "of", "whose"
];
KeyValidator.M_OP = [
    "is", "not", "greater", "less", "than", "equal",
    "to"
];
KeyValidator.S_OP = [
    "is", "not", "includes", "does", "include",
    "begins", "does", "begin", "ends", "does", "end", "with"
];
KeyValidator.AGGREGATOR = ["MAX", "MIN", "AVG", "SUM"];
KeyValidator.IsCKey = (str) => {
    if (str.includes(" ") || str.includes("_")) {
        return false;
    }
    const keywords = KeyValidator.KEYWORD;
    const mops = KeyValidator.M_OP;
    const sops = KeyValidator.S_OP;
    if (keywords.indexOf(str) !== -1 || mops.indexOf(str) !== -1 || sops.indexOf(str) !== -1) {
        return false;
    }
    else {
        return true;
    }
};
KeyValidator.IsSkey = (str) => {
    const S_KEY = [
        "Department", "ID", "Instructor", "Title", "UUID",
        "FullName", "ShortName", "Number", "Name", "Address", "Type", "Furniture", "Link"
    ];
    let bool = false;
    S_KEY.forEach((skey) => {
        if (str === skey) {
            bool = true;
            return;
        }
    });
    return bool;
};
KeyValidator.IsMkey = (str) => {
    const M_KEY = [
        "Average", "Pass", "Fail", "Audit",
        "Latitude", "Longitude", "Seats", "Year"
    ];
    let bool = false;
    M_KEY.forEach((mkey) => {
        if (str === mkey) {
            bool = true;
            return;
        }
    });
    return bool;
};
KeyValidator.IsSkeyCourses = (str) => {
    const S_KEY = ["Department", "ID", "Instructor", "Title", "UUID"];
    let bool = false;
    S_KEY.forEach((skey) => {
        if (str === skey) {
            bool = true;
            return;
        }
    });
    return bool;
};
KeyValidator.IsMkeyCourses = (str) => {
    const M_KEY = ["Average", "Pass", "Fail", "Audit"];
    let bool = false;
    M_KEY.forEach((mkey) => {
        if (str === mkey) {
            bool = true;
            return;
        }
    });
    return bool;
};
KeyValidator.IsSkeyRooms = (str) => {
    const M_KEY = [
        "FullName", "ShortName", "Number", "Name", "Address", "Type", "Furniture", "Link"
    ];
    let bool = false;
    M_KEY.forEach((mkey) => {
        if (str === mkey) {
            bool = true;
            return;
        }
    });
    return bool;
};
KeyValidator.IsMkeyRooms = (str) => {
    const M_KEY = ["Latitude", "Longitude", "Seats", "Year"];
    let bool = false;
    M_KEY.forEach((mkey) => {
        if (str === mkey) {
            bool = true;
            return;
        }
    });
    return bool;
};
//# sourceMappingURL=KeyValidator.js.map