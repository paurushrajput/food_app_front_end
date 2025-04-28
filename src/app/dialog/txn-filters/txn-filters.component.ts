import { Component, ElementRef, Inject, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { DatTimePickerComponent } from 'src/app/common/date-time-picker/date-time-picker.component';
import { TransactionManagementComponent } from 'src/app/transaction-management/transaction-management.component';

@Component({
  selector: 'app-txn-filters',
  templateUrl: './txn-filters.component.html',
  styleUrls: ['./txn-filters.component.scss']
})
export class TxnFiltersComponent {
  selectedFilter: any
  controls: any = {
    name: {
      controls: 'name',
      placeholder: 'Search by Restaurant Name',
      label: 'Search by Restaurant Name'
    },
    bookingId: {
      controls: 'bookingId',
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
    public dialogRef: MatDialogRef<TransactionManagementComponent>,
    public _appService: AppService, private fb: FormBuilder, public dialog: MatDialog, @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.searchForm = this.fb.group({
      name: [''],
      slot_time: [''],
      paymentStatus: [''],
      paymentMode: [''],
      booking_date_start: [''],
      booking_date_end: [''],
      bookingId: [''],
      email: [''],
      is_nukhba_user: ['0'],
      is_pilot: ['0']
    });
  }
  @ViewChild('picker') picker: MatDateRangePicker<any> | undefined;
  @ViewChild('startInput') startInput: ElementRef | undefined;
  @ViewChild('endInput') endInput: ElementRef | undefined;
  ngAfterViewInit(): void {
    this.startInput?.nativeElement.addEventListener('click', () => this.picker?.open());
    this.endInput?.nativeElement.addEventListener('click', () => this.picker?.open());
    this.dateTimePicker?.updateValue(this.selectedFilter?.booking_date_start ? this.selectedFilter?.booking_date_start : null,this.selectedFilter?.booking_date_end ? this.selectedFilter?.booking_date_end : null)
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
  onDateRangeChange(event: {startDate: Date, endDate: Date}) {
    console.log(event)
   this.searchForm.value.booking_date_start=event.startDate
   this.searchForm.value.booking_date_end=event.endDate
   
  }

  @ViewChild(DatTimePickerComponent) dateTimePicker: DatTimePickerComponent | undefined;
  closeDialog() {
    this.dialogRef.close({ event: 'close', data: this.searchForm.value });
  }

  formReset = () => {
    // this.searchForm.patchValue({
    //   name: '',
    //   booking_date_start: '',
    //   booking_date_end: '',
    //   slot_time: '',
    //   paymentStatus: '',
    //   paymentMode: '',
    //   bookingId: '',
    //   email: '',
    // });
    this.searchForm.reset()
    this.dateTimePicker?.reset();
    // this.dialogRef.close({ event: 'close' });
  }

  backFrom = () => {
    this.dialogRef.close({ event: 'close' });
  }

  setFormvalues = () => {
    this.searchForm.patchValue({
      name: this.selectedFilter.name ? this.selectedFilter.name : null,
      booking_date_start: this.selectedFilter.booking_date_start ? this.selectedFilter.booking_date_start : null,
      booking_date_end: this.selectedFilter.booking_date_end ? this.selectedFilter.booking_date_end : null,
      slot_time: this.selectedFilter.slot_time ? this.selectedFilter.slot_time : null,
      paymentStatus: this.selectedFilter.paymentStatus ? this.selectedFilter.paymentStatus : null,
      paymentMode: this.selectedFilter.paymentMode ? this.selectedFilter.paymentMode : null,
      bookingId: this.selectedFilter.bookingId ? this.selectedFilter.bookingId : null,
      email: this.selectedFilter.email ? this.selectedFilter.email : null,
      is_nukhba_user: this.selectedFilter.is_nukhba_user ? this.selectedFilter.is_nukhba_user : null,
      is_pilot: this.selectedFilter.is_pilot ? this.selectedFilter.is_pilot : null,
    })
  }
}
