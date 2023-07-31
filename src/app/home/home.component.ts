import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PricesService } from '../prices.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styles: [':host {display: flex; justify-content: center} form {min-width: 20rem; max-width: 40rem}']
})
export class HomeComponent {
    protected status = [false, false, false]; // Checkbox status
    protected total = 0;
    protected priceOk = true; // Its ok if the web detail prices are ok
    protected checkoutForm = this.formBuilder.group({
        website: false, 
        consulting: false,
        marketing: false
    });

    constructor(private formBuilder: FormBuilder, protected pricesService: PricesService) {}
   
    protected onClick = (idx: number) => {
        this.status[idx] = !this.status[idx];
        this.pricesService.basePrice = this.status;
        [this.total, this.priceOk] = this.pricesService.totalPrice
    }

    panelChange = (price: [number, boolean]) => [this.total, this.priceOk] = price
}
