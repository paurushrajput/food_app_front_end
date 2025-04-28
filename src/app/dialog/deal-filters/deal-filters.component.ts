import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { DealMngmtComponent } from 'src/app/deal-mngmt/deal-mngmt.component';

@Component({
  selector: 'app-deal-filters',
  templateUrl: './deal-filters.component.html',
  styleUrls: ['./deal-filters.component.scss']
})
export class DealFiltersComponent {
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
    public dialogRef: MatDialogRef<DealMngmtComponent>,
    public _appService: AppService, private fb: FormBuilder, public dialog: MatDialog, @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.searchForm = this.fb.group({
      title: [''],
      from_date: [''],
      to_date: [''],
      days_validity: ['']
    });
  }
  @ViewChild('datePicker') datetimePicker: MatDateRangePicker<any> | undefined;
  @ViewChild('dateEndtimePicker') dateEndtimePicker: MatDateRangePicker<any> | undefined;
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
    // this.dialogRef.close({ event: 'close' });
  }

  backFrom = () => {
    this.dialogRef.close({ event: 'close' });
  }

  setFormvalues = () => {
    this.searchForm.patchValue({
      title: this.selectedFilter.title ? this.selectedFilter.title : null,
      from_date: this.selectedFilter.from_date ? this.selectedFilter.from_date : null,
      to_date: this.selectedFilter.to_date ? this.selectedFilter.to_date : null,
      days_validity: this.selectedFilter.days_validity ? this.selectedFilter.days_validity : null,
    })
  }
}