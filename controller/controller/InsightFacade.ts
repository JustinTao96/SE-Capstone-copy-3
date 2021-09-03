import Log from "../Util";
import {IInsightFacade, InsightResponse, InsightDatasetKind} from "./IInsightFacade";
import {Datasets} from "./Datasets";

/**
 * This is the main programmatic entry point for the project.
 */
export default class InsightFacade implements IInsightFacade {

    private datasets: Datasets;

    constructor() {
        Log.trace("InsightFacadeImpl::init()");
        this.datasets = new Datasets();
    }

    public async addDataset(id: string, content: string, kind: InsightDatasetKind): Promise<InsightResponse> {
        // return Promise.reject({code: -1, body: null});
        let response: InsightResponse;

        try {
            response = await this.datasets.addDataset(id, content, kind);
        } catch (err) {
            response = err;
        }

        return response;
    }

    public removeDataset(id: string): Promise<InsightResponse> {
        // return Promise.reject({code: -1, body: null});
        return this.datasets.removeDataset(id);
    }

    public async performQuery(query: string): Promise <InsightResponse> {
        // return Promise.reject({code: -1, body: null});

        // this might have to be turned into an async await try/catch block.
        let response: InsightResponse;

        try {
            response = await this.datasets.performQuery(query);
        } catch (err) {
            response = err;
        }

        return response;
    }

    public async listDatasets(): Promise<InsightResponse> {
        // return Promise.reject({code: -1, body: null});
        const response = await this.datasets.listDatasets();
        return response;
    }
}
