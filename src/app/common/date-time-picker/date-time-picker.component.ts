import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDateRangePicker } from '@angular/material/datepicker';
import * as moment from 'moment';
@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.scss']
})
export class DatTimePickerComponent implements AfterViewInit {
  @Output() dateRangeChange = new EventEmitter<{ startDate: Date, endDate: Date }>();
  @ViewChild('picker') picker: MatDateRangePicker<any> | undefined;
  @ViewChild('startInput') startInput: ElementRef | undefined;
  @ViewChild('endInput') endInput: ElementRef | undefined;
  @Input('defaultValue') defaultValue: boolean = false;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    if (this.defaultValue) {
      this.form = this.fb.group({
        startDate: [moment().subtract(6, 'days').toDate()], // Set start date to 7 days ago
        endDate: [new Date()],
      });
    } else {
      this.form = this.fb.group({
        startDate: [''], // Set start date to 7 days ago
        endDate: [''],
      });
    }
    this.form.valueChanges.subscribe(value => {
      this.dateRangeChange.emit(value);
    });

   
    this.form.get('startDate')!.valueChanges.subscribe(() => this.onDateChange());
    this.form.get('endDate')!.valueChanges.subscribe(() => this.onDateChange());
  }
  reset() {
    this.form.reset();
  }

  openPicker() {
    this.picker?.open();
  }
  onDateChange() {
    const startDate = this.form.get('startDate')?.value;
    const endDate = this.form.get('endDate')?.value;
    if (startDate && endDate) {
      this.dateRangeChange.emit({ startDate, endDate });
    }
  }
  updateValue(startDate: any, endDate: any) {
    console.log("vg")
    this.form.patchValue({
      startDate: startDate,
      endDate: endDate,
    });
    this.onDateChange()
  }
  ngAfterViewInit(): void {
    this.startInput?.nativeElement.addEventListener('click', () => this.picker?.open());
    this.endInput?.nativeElement.addEventListener('click', () => this.picker?.open());
    
  }
}
