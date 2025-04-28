import { AfterViewInit, Component, Inject, Optional, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AppService } from 'src/app.service';
import { DashboardComponent } from 'src/app/dashboard/dashboard.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DatTimePickerComponent } from 'src/app/common/date-time-picker/date-time-picker.component';


@Component({
  selector: 'app-view-users-details',
  templateUrl: './view-users-details.component.html',
  styleUrls: ['./view-users-details.component.scss']
})
export class ViewUsersDetailsComponent implements AfterViewInit{
  totalRows = 0;
  searchForm!: FormGroup;
  pageSize = 10;
  currentPage = 0;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  pageSizeOptions: number[] = [10, 20, 300, 40, 100];
  dataSource: MatTableDataSource<DashboardComponent> = new MatTableDataSource();

  displayedColumns: string[] = ['sr', 'fname', 'lname', 'email'];
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

  onDateRangeChange(event: {startDate: Date, endDate: Date}) {
   
   this.searchForm.value.from_date=event.startDate
   this.searchForm.value.to_date=event.endDate
   
  }

  @ViewChild(DatTimePickerComponent) dateTimePicker: DatTimePickerComponent | undefined;
  ngOnInit() {
    if (this.data.restroData.startDate != null && this.data.restroData.endDate != null) {
      this.setformvalues()
    }
    this.loadData()
  }
ngAfterViewInit(): void {
  this.dateTimePicker?.updateValue(this.searchForm.value?.from_date ? this.searchForm.value?.from_date : null,this.searchForm.value?.from_date ? this.searchForm.value?.to_date : null)

}
  loadData() {
    this._appService.showSpinner();
    let startDate = (this.searchForm.value.from_date) != '' && (this.searchForm.value.from_date) ? moment(this.searchForm.value.from_date).format('YYYY-MM-DD') : '';
    let endDate = (this.searchForm.value.to_date) != '' && (this.searchForm.value.to_date) ? moment(this.searchForm.value.to_date).format('YYYY-MM-DD') : '';
    this._appService.getApiWithAuth(`/admin/daily-report/active-users-list?is_nukhba_user=${this.data.isNukhba}&from_date=${startDate}&to_date=${endDate}&device_type=${this.data.device}&page=${this.currentPage + 1}&page_size=${this.pageSize}`).subscribe((res: any) => {
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
      from_date: new Date(this.data.restroData.startDate),
      to_date: new Date(this.data.restroData.endDate),
    });
  }

  formReset = () => {
    this.searchForm.reset()
    this.loadData()
    this.dateTimePicker?.reset();
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }
}
