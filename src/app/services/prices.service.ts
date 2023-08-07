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

    set pagesCnt(count: number) {
        this._pagesCnt = count;
    }

    set languagesCnt(count: number) {
        this._languagesCnt = count;
    }

    set basePrice(status: Dictionary<boolean>) {
        status.forEach((val, key) => this._amounts.val[key] = val ? prices.val[key] : 0)
    }

    set order(order: number) { // 0: insertion, 1: name, 2: date
        this._order = order
    }

    set descending(descending: boolean) {
        this._descending = descending
    }

    // Getters

    get totalPrice(): [number, boolean] {
        const hasWeb = this._amounts.val["website"] > 0;
        const baseImport = this._amounts.reduce((prev, val) => prev + val)
        const detailPrice = this._pagesCnt * this._languagesCnt * 30;
        const detailOk = detailPrice > 0;

        const price = hasWeb ? baseImport + detailPrice : baseImport;
        const priceOk = hasWeb ? detailOk : true;

        return [price, priceOk]
    }

    get budgets(): Budget[] {
        if (this._order == 0) {// 0: insertion, 1: name, 2: date
            if (this._descending)
                return [...this._budgets].reverse();

            return [...this._budgets];
        }
        
        const fn = this._order == 1 
            ? (a: Budget, b: Budget) => a.name > b.name ? 1 : -1 // The names can't be equals
            : (a: Budget, b: Budget) => a.date > b.date ? 1 : (a.date < b.date ? -1 : 0);

        if (this._descending)
            return [...this._budgets].sort(fn).reverse();

        return [...this._budgets].sort(fn)
    }

    get order() {
        return this._order
    }

    get descending() {
        return this._descending
    }

    // Methods

    addBudget = (name: string, customer: string, dateStr: string) => {
        const hasWeb = this._amounts.val["website"] > 0;
        const date = new Date(dateStr);
        
        this._budgets.push({
            name: name,
            customer: customer,
            date: date,
            pages: this._pagesCnt,
            languages: this._languagesCnt,
            website: hasWeb ? this._amounts.val["website"] + (this._pagesCnt * this._languagesCnt * 30) : 0,
            consulting: this._amounts.val["consulting"],
            marketing: this._amounts.val["marketing"]
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
        this._amounts.forEach((_, key, dict) => dict.val[key] = 0)
    }

    budgetExists(name: string): Observable<boolean> {
        const idx = this._budgets.findIndex(v => 
            v.name.trim().toUpperCase() == name.trim().toUpperCase());
    
        return of(idx >= 0).pipe(delay(400))
    }
}