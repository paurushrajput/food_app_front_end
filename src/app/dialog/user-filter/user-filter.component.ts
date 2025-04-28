import { Component, ElementRef, Inject, Optional, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { DatTimePickerComponent } from 'src/app/common/date-time-picker/date-time-picker.component';
import { UserManagementComponent } from 'src/app/user-management/user-management.component';

@Component({
  selector: 'app-user-filter',
  templateUrl: './user-filter.component.html',
  styleUrls: ['./user-filter.component.scss']
})
export class UserFilterComponent {

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
    public dialogRef: MatDialogRef<UserManagementComponent>,
    public _appService: AppService, private fb: FormBuilder, public dialog: MatDialog, @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.searchForm = this.fb.group({
      name: [''],
      status: [''],
      booking_count: [''],
      from_date: [''],
      to_date: [''],
      is_nukhba_user: ['0'],
      campaign_title: [''],
      user_invites_status: [''],
      country_code: [''],
      referred_by: [''],
      is_pilot: ['0'],
      device_id: [''],
      referral_count: [''],
      allow_referral: [''],
      allow_campaign: ['']
    });
  }

  @ViewChild('picker') picker: MatDateRangePicker<any> | undefined;
  @ViewChild('startInput') startInput: ElementRef | undefined;
  @ViewChild('endInput') endInput: ElementRef | undefined;
  ngAfterViewInit(): void {
    this.startInput?.nativeElement.addEventListener('click', () => this.picker?.open());
    this.endInput?.nativeElement.addEventListener('click', () => this.picker?.open());
    // this.dateTimePicker?.updateValue(this.selectedFilter?.from_date ? this.selectedFilter?.from_date : null,this.selectedFilter?.from_date ? this.selectedFilter?.to_date : null)
  }

  ngOnInit(): void {
    if (this.data.data != undefined) {
      this.selectedFilter = this.data.data
      this.setFormvalues()
    }
  }
  onDateRangeChange(event: { startDate: Date, endDate: Date }) {
    console.log(event.startDate)
    this.searchForm.patchValue({
      from_date: event.startDate,
      to_date: event.endDate
    });

  }

  @ViewChild('dateTimePicker') dateTimePicker: DatTimePickerComponent | undefined;
  loadData() {
    this.closeDialog()
  }

  closeDialog() {
    this.dialogRef.close({ event: 'close', data: this.searchForm.value });
  }

  // formReset = () => {
  //   this.searchForm.reset()
  //   // this.dialogRef.close({ event: 'close' });
  // }
  formReset = () => {
    // this.searchForm.patchValue({
    //   name: '',
    //   from_date: '',
    //   to_date: '',
    //   status: '',
    //   booking_count: '',
    //   campaign_title: '',
    //   country_code: '',
    //   user_invites_status: '',

    // });
    this.dateTimePicker?.reset();
    this.searchForm.reset()
    // this.dialogRef.close({ event: 'close' });
  }

  backFrom = () => {
    this.dialogRef.close({ event: 'close' });
  }



  setFormvalues = () => {
    console.log('@@@@', this.selectedFilter);

    this.searchForm.patchValue({
      name: this.selectedFilter.name ? this.selectedFilter.name : null,
      from_date: this.selectedFilter.from_date ? this.selectedFilter.from_date : null,
      to_date: this.selectedFilter.to_date ? this.selectedFilter.to_date : null,
      status: this.selectedFilter.status ? this.selectedFilter.status : null,
      booking_count: this.selectedFilter.booking_count ? this.selectedFilter.booking_count : null,
      is_nukhba_user: this.selectedFilter.is_nukhba_user ? this.selectedFilter.is_nukhba_user : null,
      campaign_title: this.selectedFilter.campaign_title ? this.selectedFilter.campaign_title : null,
      country_code: this.selectedFilter.country_code ? this.selectedFilter.country_code : null,
      user_invites_status: this.selectedFilter.user_invites_status ? this.selectedFilter.user_invites_status : null,
      is_pilot: this.selectedFilter.is_pilot ? this.selectedFilter.is_pilot : null,
      referred_by: this.selectedFilter.referred_by ? this.selectedFilter.referred_by : null,
      device_id: this.selectedFilter.device_id ? this.selectedFilter.device_id : null,
      referral_count: this.selectedFilter.referral_count ? this.selectedFilter.referral_count : null,
      allow_referral: this.selectedFilter.allow_referral ? this.selectedFilter.allow_referral : null,
      allow_campaign: this.selectedFilter.allow_campaign ? this.selectedFilter.allow_campaign : null,
    })
  }
}
