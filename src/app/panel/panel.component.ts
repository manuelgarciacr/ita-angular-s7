import { Component, EventEmitter, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PricesService } from '../services/prices.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { minTextNumberValidator } from '../utils/CustomValidators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-panel',
    templateUrl: './panel.component.html',
    animations: [
        trigger('openClose', [
            transition(':enter', [
                style({ opacity: 0, transform: 'scale(0, 0)', height: 0 }),
                animate('1000ms', style({ opacity: 1, transform: 'scale(1, 1)', height: '20rem' })),
            ]),
        ])
    ]
 })
export class PanelComponent implements OnInit, OnDestroy {
    @Output() private changeEmitter = new EventEmitter<[number, boolean]>() // Total price and panel error if true
    protected checkoutForm: FormGroup;
    protected modalText = 'páginas';

    constructor(private formBuilder: FormBuilder, 
        protected pricesService: PricesService,
        protected modalService: NgbModal) {

        this.checkoutForm = this.formBuilder.group({
            pages: [1, [minTextNumberValidator(1)]],
            languages: new FormControl(1, minTextNumberValidator(1)) // Its Ok too
        });
    }

    ngOnInit(): void {       
        this.setCount(); // This call can perhaps also be made within the constructor, but it's not good practice..
    }

    ngOnDestroy(): void {
        // NG0100: ExpressionChangedAfterItHasBeenCheckedError:
        // Resetting the counters before exiting prevents the NG0100 error
        this.pricesService.resetBudget()
    }

    protected onKeydown = (ev: KeyboardEvent) => /^[\D]$/.test(ev.key)
        ? ev.preventDefault() : true; // Only positive integers

    protected setCount = () => {
        const pages = this.checkoutForm.value.pages ?? 0;
        const languages = this.checkoutForm.value.languages ?? 0;
        
        this.pricesService.pagesCnt = pages;
        this.pricesService.languagesCnt = languages;

        this.changeEmitter.emit(this.pricesService.totalPrice)
    };

    protected add = (ctrl: string) => {
        const control = this.checkoutForm.get(ctrl)!;
        const newValue = control.value == "" ? 1 : parseInt(control.value) + 1;

        control.setValue(newValue.toString());
        this.setCount()
    }

    protected remove = (ctrl: string) => {
        const control = this.checkoutForm.get(ctrl)!;
        const newValue = control.value == "" ? -1 : parseInt(control.value) - 1;

        if (newValue < 1)
            return;

        control.setValue(newValue.toString());
        this.setCount()
    }

    protected open = (content: TemplateRef<unknown>, text: string) => {
        this.modalText = text;
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', animation: true, size: 'lg', windowClass: 'cls-modal' })
	}
}
