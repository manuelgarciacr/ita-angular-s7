import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minTextNumberValidator(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const float = parseFloat(control.value);
        const error = isNaN(float) || float < min
        
        return error ? {minTextNumber: {value: control.value}} : null; 
    }
}