import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

const prices = [500, 300, 200];

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    private status = [false, false, false];
    protected total = 0;
    protected checkoutForm = this.formBuilder.group({
        website: false, 
        consulting: false,
        marketing: false
    });

    constructor(private formBuilder: FormBuilder) {}

    onClick = (idx: number) => {
        this.status[idx] = !this.status[idx];
        this.total = prices.reduce((prev, val, idx) => this.status[idx] ? (prev + val) : prev, 0) 
    }
}
