export class Dictionary<T> {
    private _value: { [key: string]: T } = {};

    constructor(value: { [key: string]: T }) {
        this._value = value;
    }

    forEach(callbackfn: (value: T, key: string, dictionary: Dictionary<T>) => void, thisArg?: this) {
        const entries = Object.entries(this._value);
        entries.forEach(val => callbackfn(val[1], val[0], this), thisArg)
    }

    reduce(callbackfn: (previousValue: T, currentValue: T,
        currentKey: string, array: [string, T][]) => T, initialValue?: T) {
        const entries = Object.entries(this._value);
        const values = Object.values(this._value);

        if (typeof initialValue == "undefined")
            return values.reduce((prev, val, idx) => callbackfn(prev, val, entries[idx][0], entries))
        else
            return values.reduce((prev, val, idx) => callbackfn(prev, val, entries[idx][0], entries), initialValue!)
    }

    get val() { return this._value }

}

