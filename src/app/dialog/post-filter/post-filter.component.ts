import { Component, ElementRef, Inject, Optional, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { DatTimePickerComponent } from 'src/app/common/date-time-picker/date-time-picker.component';
import { PostManagementComponent } from 'src/app/post-management/post-management.component';

@Component({
  selector: 'app-post-filter',
  templateUrl: './post-filter.component.html',
  styleUrls: ['./post-filter.component.scss']
})
export class PostFilterComponent {

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
    public dialogRef: MatDialogRef<PostManagementComponent>,
    public _appService: AppService, private fb: FormBuilder, public dialog: MatDialog, @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.searchForm = this.fb.group({
      res_name: [''],
      status: [''],
      keyword: [''],
      // start_date: [''],
      // end_date: [''],
      // location_id: [''],
      is_nukhba_user: ['0'],
      // is_pilot: ['0'],
      // campaign_code: [''],
      // booking_id: [''],
      // coupon_code: [''],
      type: [''],
      isPhotos: [''],
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
      res_name: this.selectedFilter.res_name ? this.selectedFilter.res_name : null,
      status: this.selectedFilter.status ? this.selectedFilter.status : null,
      keyword: this.selectedFilter.keyword ? this.selectedFilter.keyword : null,
      isPhotos: this.selectedFilter.isPhotos ? this.selectedFilter.isPhotos : null,
      is_nukhba_user: this.selectedFilter.is_nukhba_user ? this.selectedFilter.is_nukhba_user : null,
      type: this.selectedFilter.type ? this.selectedFilter.type : null,
    })
  }
}
