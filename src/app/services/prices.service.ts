import { Injectable } from '@angular/core';
import { Dictionary } from '../utils/Dictionary';
import { Observable, delay, of } from 'rxjs';

const prices = new Dictionary({
    "website": 500, 
    "consulting": 300, 
    "marketing": 200
})

export interface Budget {
    name: string,
    customer: string,
    date: Date, // I prefer a string type but want to work with dates.
    pages: number,
    languages: number,
    website: number,
    consulting: number,
    marketing: number
}

@Injectable({
    providedIn: 'root'
})
export class PricesService {
    private _budgets: Budget[] = [];
    // NG0100: ExpressionChangedAfterItHasBeenCheckedError:
    // Initializing the counters before startup prevents the NG0100 error
    private _pagesCnt = 1;
    private _languagesCnt = 1;
    private _amounts = new Dictionary({
        "website": 0, 
        "consulting": 0, 
        "marketing": 0
    });
    private _order = 0; // 0: insertion, 1: name, 2: date
    private _descending = false;
    private _filter = "";

    // Setters

    set pagesCnt(count: number) {
        this._pagesCnt = count
    }

    set languagesCnt(count: number) {
        this._languagesCnt = count
    }

    set amount(item: [string, boolean]) {
        const [key, value] = item;
        this._amounts.setVal(key, value ? prices.val(key) : 0)
    }

    set order(order: number) { // 0: insertion, 1: name, 2: date
        this._order = order
    }

    set descending(descending: boolean) {
        this._descending = descending
    }

    set filter(filter: string) {
        this._filter = filter
    }

    // Getters

    get totalAmount(): [number, number, number] {
        const hasWeb = this._amounts.val("website") > 0;
        //const baseImport = this._amounts.val("website") + this._amounts.val("consulting") + this._amounts.val("marketing")
        const baseAmount = this._amounts.reduce((prev, val) => prev + val);
        const detailAmount = this._pagesCnt * this._languagesCnt * 30;
        const price = hasWeb ? baseAmount + detailAmount : baseAmount;

        return [price, this._pagesCnt, this._languagesCnt]
    }

    get budgets(): Budget[] {
        const normalize = (str: string) => str
            .replace(/\s/g, '') // remove spaces
            .toUpperCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, ''); // remove accents
        const filter = normalize(this._filter);
        const budgets = this._budgets.filter(v => {
            const name = normalize(v.name);
            return name.includes(filter)
        });
        const fn = this._order == 1 
            ? (a: Budget, b: Budget) => a.name > b.name ? 1 : -1 // The names can't be equals
            : (a: Budget, b: Budget) => a.date > b.date ? 1 : (a.date < b.date ? -1 : 0);

        if (this._order == 0) {// 0: insertion, 1: name, 2: date
            if (this._descending)
                return budgets.reverse();

            return budgets
        }
        
        if (this._descending)
            return budgets.sort(fn).reverse();

        return budgets.sort(fn)
    }

    get pagesCnt() {
        return this._pagesCnt
    }

    get languagesCnt() {
        return this._languagesCnt
    }

    get order() {
        return this._order
    }

    get descending() {
        return this._descending
    }

    // Methods

    addBudget = (name: string, customer: string, dateStr: string) => {
        const hasWeb = this._amounts.val("website") > 0;
        const date = new Date(dateStr);
        
        this._budgets.push({
            name: name,
            customer: customer,
            date: date,
            pages: this._pagesCnt,
            languages: this._languagesCnt,
            website: hasWeb ? this._amounts.val("website") + (this._pagesCnt * this._languagesCnt * 30) : 0,
            consulting: this._amounts.val("consulting"),
            marketing: this._amounts.val("marketing")
        })
    }

    removeBudget = (name: string) => {
        const idx = this._budgets.findIndex(v => 
            v.name.trim().toUpperCase() == name.trim().toUpperCase());
            
        this._budgets.splice(idx, 1)
    }

    resetBudget = () => {
        this.pagesCnt = 1;
        this.languagesCnt = 1;
        this._amounts.forEach((_, key, dict) => dict.setVal(key, 0))
    }

    budgetExists(name: string): Observable<boolean> {
        const idx = this._budgets.findIndex(v => 
            v.name.trim().toUpperCase() == name.trim().toUpperCase());
    
        return of(idx >= 0).pipe(delay(400))
    }
}