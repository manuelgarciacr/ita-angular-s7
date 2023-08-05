import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PricesService } from '../services/prices.service';
import { Dictionary } from '../utils/Dictionary';
import { BudgetExistsValidator } from '../utils/CustomValidators';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styles: [`
        form, .cls-budgets-list  {
            max-width: 36rem;
            margin: 0 auto
        }
    `],
    host: {
        class:'container-fluid'
    }
})
export class HomeComponent implements OnInit{
    protected status = new Dictionary({"website": false, "consulting": false, "marketing": false}); // Checkbox status
    protected priceOk = true; // It's ok if the web detail prices are ok
    protected checkoutForm: FormGroup = this.formBuilder.group({});

    constructor(private formBuilder: FormBuilder, 
        protected pricesService: PricesService,
        private budgetExistsValidator: BudgetExistsValidator) {
        addEventListener("beforeunload", () => this.checkoutForm.reset())         
    }
    
    ngOnInit(): void {
        this.checkoutForm.reset();
        this.checkoutForm = this.formBuilder.group({
            name: new FormControl('', {
                validators: [Validators.required, Validators.minLength(5)],
                asyncValidators: [this.budgetExistsValidator.validate.bind(this.budgetExistsValidator)],
                updateOn: 'blur'
            }),
            customer: ["", [Validators.required, Validators.minLength(5)]],
            website: [false, [() => this.priceOk ? null : {"detail": true}]], // Detail website error
            consulting: false,
            marketing: false,
            total: [0, [(control: AbstractControl) => control.value > 0 ? null : {"required": true}]] // Error if total is zero
        });
    }
   
    protected onClick = (id: string) => {
        this.status.val[id] = !this.status.val[id];
        this.pricesService.basePrice = this.status;
        this.pricesChange(this.pricesService.totalPrice)
    }

    protected getError = (field: string) => {
        const errors = this.checkoutForm.get(field)?.errors ?? {};
        const subject = field === "name" ?  "El nombre del presupuesto" : "El nombre del cliente";

        if (errors['required']) 
            return subject + " es obligatorio.";
        if (errors['minlength']) 
            return subject + ` debe tener al menos ${ errors['minlength'].requiredLength } caracteres.`;
        if (errors['budgetExists'])
            return subject + " ya existe."
        return subject + " no es válido."
    }

    protected pricesChange = (price: [number, boolean]) => {
        const [total, priceOk] = price;

        this.priceOk = priceOk;
        this.checkoutForm.get("total")?.setValue(total);
        this.checkoutForm.get("website")?.updateValueAndValidity();
        this.checkoutForm.get("total")?.updateValueAndValidity();
    }

    protected addBudget = () => {
        this.pricesService.addBudget(
            this.checkoutForm.get("name")?.value,
            this.checkoutForm.get("customer")?.value
        );
        this.status.forEach((_, key, dict) => dict.val[key] = false);
        this.priceOk = true;
        this.checkoutForm.reset()
    }
}
