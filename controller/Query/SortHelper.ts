import CSVLineValueFinder from "./CSVLineValueFinder";

export default class SortHelper {

    public static sort2DGivenArray = (arr: string[][], groupedBy: string[]): string[][] => {
        return arr.sort(function (firstCourse: string[], secondCourse: string[]): number {
            let sortOutput = 0;
            let i = 0;

            // checks each value of grouped by until it finds a value where a != b
            while (i < groupedBy.length) {
                const currentComparison = groupedBy[i];
                const firstValue = CSVLineValueFinder.getKeyValue(currentComparison, firstCourse);
                const secondValue = CSVLineValueFinder.getKeyValue(currentComparison, secondCourse);

                if (firstValue < secondValue) {
                    sortOutput = -1;
                    break;
                }

                if (firstValue > secondValue) {
                   sortOutput = 1;
                   break;
                }

                i++;
            }
            return sortOutput;
        });
    }

    public static splitSortedArrByGroup = (sortedArr: string[][], groupedBy: string[]): string[][][] => {
        const finalArr: string[][][] = [];
        let currentGroup: string[][] = new Array();

        // doing the first iteration outside of loop so we can access previous.
        let i = 1;
        currentGroup.push(sortedArr[0]);

        while (i < sortedArr.length) {
            const previousLine: string[] = sortedArr[i - 1];
            const currentLine: string[] = sortedArr[i];

            for (let y = 0; y < groupedBy.length; y++) {
                const key: string = groupedBy[y];
                const currentKeyValue: string = CSVLineValueFinder.getKeyValue(key, currentLine);
                const previousKeyValue: string = CSVLineValueFinder.getKeyValue(key, previousLine);

                // if it finally does not match
                if (currentKeyValue !== previousKeyValue) {
                    // add everything in the current group to the final group.
                     finalArr.push(currentGroup);

                     // reset the current group to only include this new unmatching line.
                     currentGroup = new Array();
                     currentGroup.push(currentLine);

                     // stop searching through keys since it already does not match.
                     break;
                }

                // if every single key matched and you made it to the end:
                if (y === (groupedBy.length - 1)) {

                    // push the current line onto the current group.
                    currentGroup.push(currentLine);
                }
            }
            i++;
        }

        finalArr.push(currentGroup);
        return finalArr;
    }
}
