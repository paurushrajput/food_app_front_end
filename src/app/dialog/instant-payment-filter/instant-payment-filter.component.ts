import { Component, ElementRef, Inject, Optional, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { DatTimePickerComponent } from 'src/app/common/date-time-picker/date-time-picker.component';
import { InstantPaymentManagementComponent } from 'src/app/instant-payment-management/instant-payment-management.component';

@Component({
  selector: 'app-instant-payment-filter',
  templateUrl: './instant-payment-filter.component.html',
  styleUrls: ['./instant-payment-filter.component.scss']
})
export class InstantPaymentFilterComponent {

  selectedFilter: any
  controls: any = {
    name: {
      controls: 'name',
      placeholder: 'Search by Restaurant Name',
      label: 'Search by Restaurant Name'
    },
    reservation_id: {
      controls: 'reservation_id',
      placeholder: 'Search by Booking ID',
      label: 'Search by Booking ID'
    },
    email: {
      controls: 'email',
      placeholder: 'Search by User Email',
      label: 'Search by User Email'
    }
  }
  searchForm!: FormGroup;

  constructor(
    public router: Router,
    public dialogRef: MatDialogRef<InstantPaymentManagementComponent>,
    public _appService: AppService, private fb: FormBuilder, public dialog: MatDialog, @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.searchForm = this.fb.group({
      restaurant_name: [''],
      from_date: [''],
      to_date: [''],
      reservation_id: [''],
    });
  }
  @ViewChild('picker') picker: MatDateRangePicker<any> | undefined;
  @ViewChild('startInput') startInput: ElementRef | undefined;
  @ViewChild('endInput') endInput: ElementRef | undefined;
  ngAfterViewInit(): void {
    this.startInput?.nativeElement.addEventListener('click', () => this.picker?.open());
    this.endInput?.nativeElement.addEventListener('click', () => this.picker?.open());
    this.dateTimePicker?.updateValue(this.selectedFilter?.from_date ? this.selectedFilter?.from_date : null, this.selectedFilter?.to_date ? this.selectedFilter?.to_date : null)
  }

  ngOnInit(): void {
    if (this.data.data != undefined) {
      this.selectedFilter = this.data.data
      this.setFormvalues()
    }
  }

  loadData() {
    this.closeDialog()
  }
  onDateRangeChange(event: { startDate: Date, endDate: Date }) {
    this.searchForm.value.from_date = event.startDate
    this.searchForm.value.to_date = event.endDate

  }

  @ViewChild(DatTimePickerComponent) dateTimePicker: DatTimePickerComponent | undefined;
  closeDialog() {
    this.dialogRef.close({ event: 'close', data: this.searchForm.value });
  }

  formReset = () => {
    this.searchForm.reset()
    this.dateTimePicker?.reset();
  }

  backFrom = () => {
    this.dialogRef.close({ event: 'close' });
  }

  setFormvalues = () => {
    this.searchForm.patchValue({
      restaurant_name: this.selectedFilter.restaurant_name ? this.selectedFilter.restaurant_name : null,
      from_date: this.selectedFilter.from_date ? this.selectedFilter.from_date : null,
      to_date: this.selectedFilter.to_date ? this.selectedFilter.to_date : null,
      reservation_id: this.selectedFilter.reservation_id ? this.selectedFilter.reservation_id : null,
    })
  }
}
