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

    private _imports = new Dictionary({
        "website": 0, 
        "consulting": 0, 
        "marketing": 0
    });
    
    set pagesCnt(count: number) {
        this._pagesCnt = count;
    }

    set languagesCnt(count: number) {
        this._languagesCnt = count;
    }

    set basePrice(status: Dictionary<boolean>) {
        status.forEach((val, key) => this._imports.val[key] = val ? prices.val[key] : 0)
    }

    // Getters

    get totalPrice(): [number, boolean] {
        const hasWeb = this._imports.val["website"] > 0;
        const baseImport = this._imports.reduce((prev, val) => prev + val)
        const detailPrice = this._pagesCnt * this._languagesCnt * 30;
        const detailOk = detailPrice > 0;

        const price = hasWeb ? baseImport + detailPrice : baseImport;
        const priceOk = hasWeb ? detailOk : true;

        return [price, priceOk]
    }

    get budgets(): Budget[] {
        return this._budgets
    }

    // Methods

    addBudget = (name: string, customer: string) => {
        const hasWeb = this._imports.val["website"] > 0;

        this._budgets.push({
            name: name,
            customer: customer,
            pages: this._pagesCnt,
            languages: this._languagesCnt,
            website: hasWeb ? this._imports.val["website"] + (this._pagesCnt * this._languagesCnt * 30) : 0,
            consulting: this._imports.val["consulting"],
            marketing: this._imports.val["marketing"]
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
        this._imports.forEach((_, key, dict) => dict.val[key] = 0)
    }

    budgetExists(name: string): Observable<boolean> {
        const idx = this._budgets.findIndex(v => 
            v.name.trim().toUpperCase() == name.trim().toUpperCase());
    
        return of(idx >= 0).pipe(delay(400));
    }
}