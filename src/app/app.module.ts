import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; // Add this line
import { AppComponent } from './app.component';
import { RouterModule, Routes  } from '@angular/router';

@NgModule({
    declarations: [
        // Remove AppComponent from declarations array
        // AppComponent,
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        RouterModule
    ],
    providers: [],
    // bootstrap: [AppComponent],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
})
export class AppModule {
}
