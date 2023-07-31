import { Injectable } from '@angular/core';

const prices = [500, 300, 200]; // webSite, SEO and marketing

@Injectable({
    providedIn: 'root'
})
export class PricesService {
    private _basePrice = 0;
    
    private _pagesCnt = 0;
    private _languagesCnt = 0;
    private _webPrice = 0;
    private _webPriceOk = true;
    private _hasWeb = false;

    constructor() { }

    private setWebPrice = () => this._webPrice = this._pagesCnt * this._languagesCnt * 30;

    // Setters

    set pagesCnt (count: number) {
        this._pagesCnt =  count;
        this.setWebPrice()
    }

    set languagesCnt (count: number) {
        this._languagesCnt =  count;
        this.setWebPrice()
    }

    set webPriceOk (isValid: boolean) {
        this._webPriceOk = isValid
    }

    set basePrice (status: boolean[]) {
        this._basePrice = status.map((v, i) => i < prices.length && v ? prices[i] : 0).reduce((prev, v) => prev + v, 0);
        this._hasWeb = status[0] // The price needs the detailed web prices
    }

    // Getters

    get totalPrice(): [number, boolean] {
        const price = this._hasWeb ? this._webPrice + this._basePrice : this._basePrice;
        const priceOk = this._hasWeb ? this._webPriceOk : true;

        return [price, priceOk]
    }
}