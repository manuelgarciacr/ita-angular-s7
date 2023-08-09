import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PricesService } from '../services/prices.service';
import { BudgetExistsValidator } from '../utils/CustomValidators';
import { formatDate } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';

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
        class: 'container-fluid'
    }
})
export class HomeComponent implements OnInit {
    protected checkoutForm: FormGroup = this.formBuilder.group({});

    constructor(private formBuilder: FormBuilder,
        protected pricesService: PricesService,
        private budgetExistsValidator: BudgetExistsValidator,
        private route: ActivatedRoute,
        private router: Router) {
        addEventListener("beforeunload", () => this.checkoutForm.reset())
    }

    ngOnInit(): void {
        const params = this.route.snapshot.queryParams;
        const date = formatDate(new Date(), 'yyyy-MM-dd', "es-ES");
        const formGroup = {
            name: new FormControl("", {
                validators: [Validators.required, Validators.minLength(5)],
                asyncValidators: [this.budgetExistsValidator.validate.bind(this.budgetExistsValidator)],
            }),
            customer: ["", [Validators.required, Validators.minLength(5)]],
            date: [date, [Validators.required]],
            website: false,
            pages: 0,
            languages: 0,
            consulting: false,
            marketing: false,
            total: [0, [(control: AbstractControl) => control.value > 0 ? null : { "required": true }]] // Error if total is zero
        }
        const website = params["website"] == "true" ? true : false;
        const consulting = params["consulting"] == "true" ? true : false;
        const marketing = params["marketing"] == "true" ? true : false;
        const pages = params["pages"] == undefined ? 0 : parseInt(params["pages"]);
        const languages = params["languages"] == undefined ? 0 : parseInt(params["languages"]);
        const values = {
            name: params['name'] ?? "",
            customer: params["customer"] ?? "",
            date: params["date"] ?? date,
            website: website,
            pages: pages,
            languages: languages,
            consulting: consulting,
            marketing: marketing,
            total: 0
        }

        if (website)
            this.onClick("website", website);

        if (consulting)
            this.onClick("consulting", consulting);

        if (marketing)
            this.onClick("marketing", marketing);

        if (pages > 0)
            this.pricesService.pagesCnt = pages;

        if (languages > 0)
            this.pricesService.languagesCnt = languages;

        this.checkoutForm = this.formBuilder.group(formGroup, { validators: (control: AbstractControl) => {
            const website = control.get("website")?.value;
            const pages = control.get("pages")?.value;
            const languages = control.get("languages")?.value;
            if ( !website )
                return null;
            if ( pages > 0 && languages > 0 )
                return null;
            return {"detail": true}
        }});

        this.checkoutForm.reset(values);
        this.setQueryParams()

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.checkoutForm.get("name")?.valueChanges.subscribe(_ => this.setQueryParams());
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.checkoutForm.get("customer")?.valueChanges.subscribe(_ => this.setQueryParams());
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.checkoutForm.get("date")?.valueChanges.subscribe(_ => this.setQueryParams());
        this.checkoutForm.get("website")?.valueChanges.subscribe(v => this.onClick("website", v));
        this.checkoutForm.get("consulting")?.valueChanges.subscribe(v => this.onClick("consulting", v));
        this.checkoutForm.get("marketing")?.valueChanges.subscribe(v => this.onClick("marketing", v));
    }

    private onClick = (key: string, value: boolean) => {
        this.pricesService.amount = [key, value];
        this.pricesChange(this.pricesService.totalAmount)
    }

    protected getError = (field: string) => {
        const errors = this.checkoutForm.get(field)?.errors ?? {};
        const subject = field === "name" ? "El nombre del presupuesto"
            : field === "customer" ? "El nombre del cliente" : "La fecha del presupuesto";

        if (field == "date")
            return subject + " es obligatoria."
        if (errors['required'])
            return subject + " es obligatorio.";
        if (errors['minlength'])
            return subject + ` debe tener al menos ${errors['minlength'].requiredLength} caracteres.`;
        if (errors['budgetExists'])
            return subject + " ya existe."
        return subject + " no es válido."
    }

    protected pricesChange = (price: [number, number, number]) => {
        const [total, pages, languages] = price;

        this.checkoutForm.get("total")?.setValue(total);
        this.checkoutForm.get("total")?.updateValueAndValidity();

        this.checkoutForm.get("pages")?.setValue(pages);
        this.checkoutForm.get("languages")?.setValue(languages);
        this.setQueryParams()
    }

    protected addBudget = () => {
        this.pricesService.addBudget(
            this.checkoutForm.get("name")?.value?.trim() ?? "",
            this.checkoutForm.get("customer")?.value?.trim() ?? "",
            this.checkoutForm.get("date")?.value?.trim() ?? ""
        );

        this.checkoutForm.reset({
            name: "",
            customer: "",
            date: formatDate(new Date(), 'yyyy-MM-dd', "es-ES"),
            website: false,
            pages: 0,
            languages: 0,
            consulting: false,
            marketing: false,
            total: 0
        });

        this.setQueryParams()
    }

    public setQueryParams() {
        const name = this.checkoutForm.get("name")?.value?.trim() ?? "";
        const customer = this.checkoutForm.get("customer")?.value?.trim() ?? "";
        const date = this.checkoutForm.get("date")?.value?.trim() ?? "";
        const website = this.checkoutForm.get("website")?.value;
        const pages = this.checkoutForm.get("pages")?.value;
        const languages = this.checkoutForm.get("languages")?.value;
        const consulting = this.checkoutForm.get("consulting")?.value;
        const marketing = this.checkoutForm.get("marketing")?.value
        const params: Params = [];

        if (name.length > 0)
            params["name"] = name;

        if (customer.length > 0)
            params["customer"] = customer;

        if (date.length > 0)
            params["date"] = date;

        if (website){
            params["website"] = "true";
            if (pages !== undefined){
                params["pages"] = pages;
                params["languages"] = languages
            }
        }

        if (consulting)
            params["consulting"] = "true";

        if (marketing)
            params["marketing"] = "true";

        this.router.navigate(
            [],
            {
                relativeTo: this.route,
                queryParams: params,
                // queryParamsHandling: 'merge', // remove to replace all query params by provided
            }
        )
    }
}
