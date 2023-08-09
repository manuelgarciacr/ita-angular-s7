import { Component } from '@angular/core';
import { PricesService } from '../services/prices.service';

@Component({
    selector: 'app-budget-list',
    templateUrl: './budget-list.component.html',
    styles: [':host {outline: thick double #32a1ce; height: calc(100vh - 5rem); overflow-y: scroll}']
})
export class BudgetListComponent {

    constructor(protected pricesService: PricesService) { }

    remove = (name: string) => this.pricesService.removeBudget(name);

    changeOrder = (idx: number) => {
        if (this.pricesService.order === idx) {
            this.pricesService.descending = !this.pricesService.descending;
            return
        }

        const buttons = document.getElementsByClassName("cls-order");

        this.pricesService.order = idx;
        
        Array.from(buttons).forEach(btn => {
            btn.removeAttribute("aria-pressed");
            btn.classList.remove("active");
            btn.firstElementChild?.classList.add("d-none")
        });

        buttons[idx].setAttribute("aria-pressed", "true");
        buttons[idx].classList.add("active");
        buttons[idx].firstElementChild?.classList.remove("d-none")
    }

    searchString = (ev: Event) => this.pricesService.filter = (ev.target as HTMLInputElement).value
}
