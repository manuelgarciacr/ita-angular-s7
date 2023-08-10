# ItaAngularS7

Budget and customer names are validated after losing focus (after first touch).

The "Add" button is not enabled until the required fields are completed and the form is free of errors.

Budget name must be a minimum of 5 characters and cannot be repeated (custom asynchronous validator). It is not case sensitive, but it does take spaces and accents into account.

![Budget name](https://i.ibb.co/xLwZHQk/S7-01.png)

The customer name must have a minimum of 5 characters and can be repeated.

![Customer](https://i.ibb.co/NF3WhLD/S7-02.png)

The date has a date piker and is saved in date format. I prefer to use string fields but wanted to work with this data type.

![Date picker](https://i.ibb.co/kMKLczY/S7-03.png)

The number of pages and languages ​​is at least one (custom validator).

![Number of pages and languages](https://i.ibb.co/m0P3fnx/S7-04.png)

If website is selected, number of pages and languages ​​is required (custom cross fields validator)

The total amount cannot be zero (custom inline validator).

![Total amount](https://i.ibb.co/0cwWScN/S7-05.png)

The budget list can be displayed in ascending or descending order.

![List order](https://i.ibb.co/85QLhTJ/S7-06.png)

The budgets filter is not case sensitive and ignores spaces and accents.

![Budgets filter](https://i.ibb.co/Ps2W1qV/S7-07.png)

Budgets within the list can be deleted.

It is a link of a budget page: http://localhost:4200/calculator?name=Presupuesto%20de%20prueba&customer=Manuel&date=2023-08-01&website=true&pages=2&languages=3&consulting=true&marketing=true




This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
