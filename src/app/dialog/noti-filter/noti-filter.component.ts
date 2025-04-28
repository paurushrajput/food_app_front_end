import { AfterViewInit, Component, Inject, Optional, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { CampaignandnotificationManagementComponent } from 'src/app/campaignandnotification-management/campaignandnotification-management.component';
import { DatTimePickerComponent } from 'src/app/common/date-time-picker/date-time-picker.component';

@Component({
  selector: 'app-noti-filter',
  templateUrl: './noti-filter.component.html',
  styleUrls: ['./noti-filter.component.scss']
})
export class NotiFilterComponent  implements AfterViewInit{


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
    public dialogRef: MatDialogRef<CampaignandnotificationManagementComponent>,
    public _appService: AppService, private fb: FormBuilder, public dialog: MatDialog, @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.searchForm = this.fb.group({
      name: [''],
      status: [''],
      booking_count: [''],
      from_date: [''],
      to_date: [''],
      is_nukhba_user: [''],
      campaign_title:[''],
      user_invites_status:[''],
      country_code:['']
    });
  }
ngAfterViewInit(): void {
  this.dateTimePicker?.updateValue(this.selectedFilter?.from_date ? this.selectedFilter?.from_date : null,this.selectedFilter?.from_date ? this.selectedFilter?.to_date : null)
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

  formReset = () => {
    this.searchForm.reset()
    this.dateTimePicker?.reset();
    // this.dialogRef.close({ event: 'close' });
  }
  @ViewChild(DatTimePickerComponent) dateTimePicker: DatTimePickerComponent | undefined;

  backFrom = () => {
    this.dialogRef.close({ event: 'close' });
  }
  onDateRangeChange(event: {startDate: Date, endDate: Date}) {
    console.log(event)
   this.searchForm.value.from_date=event.startDate
   this.searchForm.value.to_date=event.endDate
   
  }
  setFormvalues = () => {
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
    })
  }
}