import { FilterKey } from "./FilterKey";
import { Key } from "./Key";
import KeyValidator from "./KeyValidator";

export class AggregateFilterKey extends FilterKey {
    // might not be needed since filterkey should remain the same.

    constructor(key: string[])  {
        super(key);
    }

}
