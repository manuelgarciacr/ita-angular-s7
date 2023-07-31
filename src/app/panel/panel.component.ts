import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PricesService } from '../prices.service';

@Component({
    selector: 'app-panel',
    templateUrl: './panel.component.html',
    styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {
    @Output() private changeEmitter = new EventEmitter<[number, boolean]>() // Total price and panel error if true
    protected checkoutForm: FormGroup;

    constructor(private formBuilder: FormBuilder, protected pricesService: PricesService) {
        this.checkoutForm = this.formBuilder.group({
            // pages: new FormControl(1, Validators.min(1)), // Its OK too
            pages: [1, [Validators.min(1)]],
            languages: 1 // inherits html validations: required and min
        });
    }

    ngOnInit(): void {
        this.setCount() // This call can also be made inside the constructor, but it is not a good practice.
    }
   
    protected onKeydown = (ev: KeyboardEvent) => /^[.,eE+-]$/.test(ev.key) 
        ? ev.preventDefault() : true; // Only positive integers
    
    protected setCount = () => {
        const pages = this.checkoutForm.value.pages ?? 0;
        const languages = this.checkoutForm.value.languages ?? 0;

        this.pricesService.pagesCnt = pages;
        this.pricesService.languagesCnt = languages;
        this.pricesService.webPriceOk = this.checkoutForm.valid;
        this.changeEmitter.emit(this.pricesService.totalPrice)
    };
}
