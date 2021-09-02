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
const Util_1 = require("../Util");
const Datasets_1 = require("./Datasets");
class InsightFacade {
    constructor() {
        Util_1.default.trace("InsightFacadeImpl::init()");
        this.datasets = new Datasets_1.Datasets();
    }
    addDataset(id, content, kind) {
        return __awaiter(this, void 0, void 0, function* () {
            let response;
            try {
                response = yield this.datasets.addDataset(id, content, kind);
            }
            catch (err) {
                response = err;
            }
            return response;
        });
    }
    removeDataset(id) {
        return this.datasets.removeDataset(id);
    }
    performQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let response;
            try {
                response = yield this.datasets.performQuery(query);
            }
            catch (err) {
                response = err;
            }
            return response;
        });
    }
    listDatasets() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.datasets.listDatasets();
            return response;
        });
    }
}
exports.default = InsightFacade;
//# sourceMappingURL=InsightFacade.js.map