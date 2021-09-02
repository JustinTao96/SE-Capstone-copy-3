import { InsightDatasetKind } from "./IInsightFacade";

export interface IZipContent {
    file: string; // this is the file path
    content: ICSV[] | IRoomContent[]; // this is an array of ICSVs
    kind: InsightDatasetKind; // this is the kind of the dataset
}

export interface ICSV {
    file: string; // this is the path to the csv
    content: string; // this is the stringified version of the csv
}

export interface IRoomContent {
    fullname: string;
    shortname: string;
    number: string;
    name: string;
    address: string;
    lat: number;
    lon: number;
    seats: number;
    type: string;
    furniture: string;
    href: string;
}
