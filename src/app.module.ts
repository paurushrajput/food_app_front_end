import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
  ],
  imports: [
    MatDatepickerModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,ReactiveFormsModule,
    MatNativeDateModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    MatCheckboxModule,
    NgxMatNativeDateModule,MatDatepickerModule,
    ToastrModule.forRoot()
  ],
  providers: [ DatePipe,  MatDatepickerModule, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },   ],
})
export class AppModule { }
