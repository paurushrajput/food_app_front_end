import { Component, ElementRef, Inject, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DashboardComponent } from 'src/app/dashboard/dashboard.component';
import * as moment from 'moment/moment';
import { ViewRestroBookingsComponent } from '../view-restro-bookings/view-restro-bookings.component';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { DatTimePickerComponent } from 'src/app/common/date-time-picker/date-time-picker.component';

@Component({
  selector: 'app-view-top-restro',
  templateUrl: './view-top-restro.component.html',
  styleUrls: ['./view-top-restro.component.scss']
})
export class ViewTopRestroComponent {
  searchForm!: FormGroup;
  dataSource: MatTableDataSource<DashboardComponent> = new MatTableDataSource();

  displayedColumns: string[] = ['sr', 'name', 'count', 'viewBooking'];
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
    this.dateTimePicker?.updateValue(this.searchForm.value?.from_date ? this.searchForm.value?.from_date : null,this.searchForm.value?.from_date ?this.searchForm.value?.to_date : null)

  }

  ngOnInit() {
    if (this.data.restroData.startDate != null && this.data.restroData.endDate != null) {
      this.setformvalues()
    }
    this.loadData()
  }
  onDateRangeChange(event: {startDate: Date, endDate: Date}) {
    console.log(event)
   this.searchForm.value.from_date=event.startDate
   this.searchForm.value.to_date=event.endDate
   
  }

  @ViewChild(DatTimePickerComponent) dateTimePicker: DatTimePickerComponent | undefined;

  loadData() {
    this._appService.showSpinner();
    let startDate = (this.searchForm.value.from_date) != '' && (this.searchForm.value.from_date) ? moment(this.searchForm.value.from_date).format('YYYY-MM-DD') : '';
    let endDate = (this.searchForm.value.to_date) != '' && (this.searchForm.value.to_date) ? moment(this.searchForm.value.to_date).format('YYYY-MM-DD') : '';
    this._appService.getApiWithAuth(`/admin/reservation/most-booked-restro?is_nukhba_user=${this.data.isNukhba}&from_date=${startDate}&to_date=${endDate}`).subscribe((res: any) => {
      this.dataSource.data = res.data;
      this._appService.hideSpinner();
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



  viewRestroBooking(value: any, dates: any) {
    const dialogRef = this.dialog.open(ViewRestroBookingsComponent, {
      hasBackdrop: false,
      width: '800px',
      data: {
        restroData: value,
        dates: dates,
        is_nukhba_user: this.data.isNukhba
      }
    });
    dialogRef.afterClosed().subscribe(result => {
       console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadData()
      }
    });
  }
}
