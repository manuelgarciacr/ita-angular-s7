import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors, ValidatorFn } from '@angular/forms';
import { PricesService } from '../services/prices.service';
import { Observable, catchError, map, of } from 'rxjs';

export function minTextNumberValidator(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const float = parseFloat(control.value);
        const error = isNaN(float) || float < min

        return error ? { minTextNumber: { value: control.value } } : null;
    }
}

@Injectable({ providedIn: 'root' })
export class BudgetExistsValidator implements AsyncValidator {
    constructor(private pricesService: PricesService) { }

    validate(
        control: AbstractControl
    ): Observable<ValidationErrors | null> {
        return this.pricesService.budgetExists(control.value).pipe(
            map(exists => (exists ? { budgetExists: true } : null)),
            catchError(() => of(null))
        );
    }
}
