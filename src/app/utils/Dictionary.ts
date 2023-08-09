export class Dictionary<T> {
    // TODO: unitary test
    // TODO: Docs
    private _value: { [key: string]: T } = {};

    constructor(value: { [key: string]: T }) {
        this._value = {...value};
    }

    add(key: string, value: T) {
        this._value[key] = value
    }

    remove(key: string) {
        delete this._value[key]
    }

    forEach(callbackfn: (value: T, key: string, dictionary: Dictionary<T>) => void, thisArg?: this) {
        const entries = Object.entries(this._value);
        entries.forEach(val => callbackfn(val[1], val[0], this), thisArg)
    }

    map<M>(callbackfn: (value: T, key: string, dictionary: Dictionary<T>) => M, thisArg?: this) {
        const entries = Object.entries(this._value);
        const arr = new Dictionary<M>({});

        entries.forEach(val => arr.add(val[0], callbackfn(val[1], val[0], this)), thisArg);

        return arr
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

    get keys() {
        return Object.keys(this._value)
    }

    get values() {
        return Object.values(this._value)
    }

    get entries() {
        return Object.entries(this._value)
    }

    val = (key: string) => this._value[key];

    setVal = (key: string, value: T) => this._value[key] = value

}

