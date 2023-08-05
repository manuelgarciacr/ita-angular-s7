import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PanelComponent } from './panel/panel.component';
import { LandingComponent } from './landing/landing.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { BudgetListComponent } from './budget-list/budget-list.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        PanelComponent,
        LandingComponent,
        BudgetListComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        NgbModalModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
