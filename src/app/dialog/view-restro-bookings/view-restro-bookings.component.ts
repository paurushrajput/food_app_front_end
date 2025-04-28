import { Component, ElementRef, Inject, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AppService } from 'src/app.service';
import { DatTimePickerComponent } from 'src/app/common/date-time-picker/date-time-picker.component';
import { DashboardComponent } from 'src/app/dashboard/dashboard.component';

@Component({
  selector: 'app-view-restro-bookings',
  templateUrl: './view-restro-bookings.component.html',
  styleUrls: ['./view-restro-bookings.component.scss']
})
export class ViewRestroBookingsComponent {
  totalRows = 0;
  searchForm!: FormGroup;
  pageSize = 10;
  currentPage = 0;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  pageSizeOptions: number[] = [10, 20, 300, 40, 100];
  dataSource: MatTableDataSource<DashboardComponent> = new MatTableDataSource();

  displayedColumns: string[] = ['sr', 'name', 'email', 'booking_date'];
  constructor(
    public _appService: AppService,
    private fb: FormBuilder,
    public router: Router,
    public dialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.searchForm = this.fb.group({
      from_date: [''],
      to_date: ['']
    });
  }

  @ViewChild('picker') picker: MatDateRangePicker<any> | undefined;
  @ViewChild('startInput') startInput: ElementRef | undefined;
  @ViewChild('endInput') endInput: ElementRef | undefined;
  ngAfterViewInit(): void {
    this.startInput?.nativeElement.addEventListener('click', () => this.picker?.open());
    this.endInput?.nativeElement.addEventListener('click', () => this.picker?.open());
    this.dateTimePicker?.updateValue(this.searchForm.value?.from_date ? this.searchForm.value?.from_date : null,this.searchForm.value?.from_date ? this.searchForm.value?.to_date : null)

  }
  onDateRangeChange(event: {startDate: Date, endDate: Date}) {
    console.log(event)
   this.searchForm.value.from_date=event.startDate
   this.searchForm.value.to_date=event.endDate
   
  }

  @ViewChild(DatTimePickerComponent) dateTimePicker: DatTimePickerComponent | undefined;
  ngOnInit() {
    if (this.data.dates.from_date != null && this.data.dates.to_date != null) {
      this.setformvalues()
    }
    this.loadData()
  }

  loadData() {
    this._appService.showSpinner();
    let startDate = (this.searchForm.value.from_date) != '' && (this.searchForm.value.from_date) ? moment(this.searchForm.value.from_date).format('YYYY-MM-DD') : '';
    let endDate = (this.searchForm.value.to_date) != '' && (this.searchForm.value.to_date) ? moment(this.searchForm.value.to_date).format('YYYY-MM-DD') : '';
    this._appService.getApiWithAuth(`/admin/reservation/list?type=dashboard&is_nukhba_user=${this.data.is_nukhba_user}&res_uid=${this.data.restroData.res_uid}&is_paginated=true&page=${this.currentPage + 1}&page_size=${this.pageSize}&booking_type=all&from_date=${startDate}&to_date=${endDate}`).subscribe((res: any) => {
      this.dataSource.data = res.data.rows;
      this._appService.hideSpinner();
      setTimeout(() => {
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length = res.data?.count;
      });
    }, (error) => {
      if (error?.error?.status_code) {
        this.router.navigateByUrl("/");
        localStorage.removeItem('authtoken');
      }
    });
  }

  setformvalues() {
    this.searchForm.patchValue({
      from_date: new Date(this.data.dates.from_date),
      to_date: new Date(this.data.dates.to_date),
    });
  }


  formReset = () => {
    this.searchForm.reset()
    this.dateTimePicker?.reset();
    this.loadData()
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }

}
