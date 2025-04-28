import { AfterViewInit, Component, ElementRef, Inject, Optional, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { DatTimePickerComponent } from 'src/app/common/date-time-picker/date-time-picker.component';
import { ReservationManagementComponent } from 'src/app/reservation-management/reservation-management.component';

@Component({
  selector: 'app-reservation-filter',
  templateUrl: './reservation-filter.component.html',
  styleUrls: ['./reservation-filter.component.scss']
})
export class ReservationFilterComponent implements AfterViewInit {
  selectedFilter: any
  controls: any = {
    resName: {
      controls: 'resName',
      placeholder: 'Search by Restaurant Name',
      label: 'Search by Restaurant Name'
    }
  }
  searchForm!: FormGroup;

  constructor(
    public router: Router,
    public dialogRef: MatDialogRef<ReservationManagementComponent>,
    public _appService: AppService, private fb: FormBuilder, public dialog: MatDialog, @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.searchForm = this.fb.group({
      resName: [''],
      status: [''],
      // email: [''],
      start_date: [''],
      end_date: [''],
      location_id: [''],
      is_nukhba_user: ['0'],
      is_pilot: ['0'],
      campaign_code: [''],
      booking_id: [''],
      coupon_code: [''],
      coupon_discount: [''],
      slot_discount: [''],
      user_email_mobile: [''],
      coupon_applied: ['']
    });
  }

  onDateRangeChange(event: {startDate: Date, endDate: Date}) {
    console.log(event)
   this.searchForm.value.start_date=event.startDate
   this.searchForm.value.end_date=event.endDate
   
  }

  @ViewChild(DatTimePickerComponent) dateTimePicker: DatTimePickerComponent | undefined;
  @ViewChild('picker') picker: MatDateRangePicker<any> | undefined;
  @ViewChild('startInput') startInput: ElementRef | undefined;
  @ViewChild('endInput') endInput: ElementRef | undefined;
  ngAfterViewInit(): void {
    this.startInput?.nativeElement.addEventListener('click', () => this.picker?.open());
    this.endInput?.nativeElement.addEventListener('click', () => this.picker?.open());
    this.dateTimePicker?.updateValue(this.selectedFilter?.start_date ? this.selectedFilter?.start_date : null,this.selectedFilter?.end_date ? this.selectedFilter?.end_date : null)
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

  closeDialog() {
    this.dialogRef.close({ event: 'close', data: this.searchForm.value });
  }

  // formReset = () => {
  //   this.searchForm.reset()
  // }

  formReset = () => {
    // this.searchForm.patchValue({
    //   resName: '',
    //   status: '',
    //   email: '',
    //   start_date: '',
    //   end_date: '',
    //   location_id: '',
    // });
    this.searchForm.reset()
    this.dateTimePicker?.reset();
    // this.searchForm.controls['name'].reset()
    // this.dialogRef.close({ event: 'close' });
  }

  backFrom = () => {
    this.dialogRef.close({ event: 'close' });
  }

  setFormvalues = () => {
    this.searchForm.patchValue({
      resName: this.selectedFilter.resName ? this.selectedFilter.resName : null,
      status: this.selectedFilter.status ? this.selectedFilter.status : null,
      // email: this.selectedFilter.email ? this.selectedFilter.email : null,
      start_date: this.selectedFilter.start_date ? this.selectedFilter.start_date : null,
      end_date: this.selectedFilter.end_date ? this.selectedFilter.end_date : null,
      location_id: this.selectedFilter.location_id ? this.selectedFilter.location_id : null,
      is_nukhba_user: this.selectedFilter.is_nukhba_user ? this.selectedFilter.is_nukhba_user : null,
      is_pilot: this.selectedFilter.is_pilot ? this.selectedFilter.is_pilot : null,
      campaign_code: this.selectedFilter.campaign_code ? this.selectedFilter.campaign_code : null,
      booking_id: this.selectedFilter.booking_id ? this.selectedFilter.booking_id : null,
      coupon_code: this.selectedFilter.coupon_code ? this.selectedFilter.coupon_code : null,
      coupon_discount: this.selectedFilter.coupon_discount ? this.selectedFilter.coupon_discount : null,
      slot_discount: this.selectedFilter.slot_discount ? this.selectedFilter.slot_discount : null,
      user_email_mobile: this.selectedFilter.user_email_mobile ? this.selectedFilter.user_email_mobile : null,
      coupon_applied: this.selectedFilter.coupon_applied ? this.selectedFilter.coupon_applied : null,
    })
  }
}
