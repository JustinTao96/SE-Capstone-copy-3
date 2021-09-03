import Decimal from "decimal.js";
import { IGroupedKey } from "../QueryParser/GroupedKeyInterface";
import CSVLineValueFinder from "./CSVLineValueFinder";

export default class CustomKeyReader {
    public static GetCustomKeyValue = function (
        key: string, meanings: IGroupedKey[], group: string[][]): number {

        const currentMeaning: IGroupedKey = CustomKeyReader.FindMeaning(key, meanings);

        if (currentMeaning === null) {
            throw new Error("CustomKeyReader: the key: " + key + "was not defined in the DISPLAY key");
        }

        // if the meaning was found, calculate the value of the meaning.
        // currentMeaning.meaning is an array of 2 length with [aggregator, key];
        const aggregator = currentMeaning.meaning[0];
        const aggregateKey = currentMeaning.meaning[1];

        switch (aggregator) {

            case ("MAX"): {
                return CustomKeyReader.FindGroupMAX(group, aggregateKey);
            }

            case ("MIN"): {
                return CustomKeyReader.FindGroupMIN(group, aggregateKey);
            }

            case ("AVG"): {
                return CustomKeyReader.FindGroupAVG(group, aggregateKey);
            }

            case ("SUM"): {
                const decimalSum: Decimal = CustomKeyReader.FindGroupSUM(group, aggregateKey);
                const sum: number = Number(decimalSum.toFixed(2));
                return sum;
            }

            case ("COUNT"): {
                return CustomKeyReader.FindGroupCOUNT(group, aggregateKey);
            }
        }

    };

    // Find the maximum value of a field. For numeric fields only.
    private static FindGroupMAX = function (group: string[][], key: string): number {
        // assign MAX to the first line in group.
        let currentMax: number = CSVLineValueFinder.getMkeyValue(key, group[0]);

        for (let i = 1; i < group.length; i++) {
            const currentLine: string[] = group[i];
            const currentValue: number = CSVLineValueFinder.getMkeyValue(key, currentLine);

            if (currentValue > currentMax) {
                currentMax = currentValue;
            }
        }

        return currentMax;
    };

    // Find the maximum value of a field. For numeric fields only.
    private static FindGroupMIN = function (group: string[][], key: string): number {
        // assign MIN to the first line in group.
        let currentMin: number = CSVLineValueFinder.getMkeyValue(key, group[0]);

        for (let i = 1; i < group.length; i++) {
            const currentLine: string[] = group[i];
            const currentValue: number = CSVLineValueFinder.getMkeyValue(key, currentLine);

            if (currentValue < currentMin) {
                currentMin = currentValue;
            }
        }

        return currentMin;
    };

    // Find the maximum value of a field. For numeric fields only.
    private static FindGroupAVG = function (group: string[][], key: string): number {
        const total: Decimal = CustomKeyReader.FindGroupSUM(group, key);
        const rows: number = group.length;

        const avg = total.toNumber() / rows;

        const res = Number(avg.toFixed(2));

        return res;
    };

    // Find the maximum value of a field. For numeric fields only.
    private static FindGroupSUM = function (group: string[][], key: string): Decimal {
        // assign MIN to the first line in group.
        let total: Decimal = new Decimal(0);

        for (const i in group) {
            const currentLine: string[] = group[i];
            const currentValue: Decimal = new Decimal(
                CSVLineValueFinder.getMkeyValue(key, currentLine));

            total = total.add(currentValue);
        }

        return total;
    };

    // Find the maximum value of a field. For numeric fields only.
    private static FindGroupCOUNT = function (group: string[][], key: string): number {
        return null;
    };

    // check if the meaning for the current key string exists in meanings[].
    private static FindMeaning = function (key: string, meanings: IGroupedKey[]): IGroupedKey {

        // if meaning is found in meanings[], return meaning.
        for (const i in meanings) {
            if (meanings[i].name === key) {
                 return meanings[i];
            }
        }
        // if meaning is not found, return null.
        return null;
    };
}
