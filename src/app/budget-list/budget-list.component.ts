import { Component } from '@angular/core';
import { PricesService } from '../services/prices.service';

@Component({
    selector: 'app-budget-list',
    templateUrl: './budget-list.component.html',
    styles: [':host {outline: thick double #32a1ce; height: calc(100vh - 5rem); overflow-y: scroll}']
})
export class BudgetListComponent {

    constructor(protected pricesService: PricesService) { }

    remove(name: string) { this.pricesService.removeBudget(name) }
}
