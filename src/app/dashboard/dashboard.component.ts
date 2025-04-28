import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app.service';
import * as moment from 'moment/moment';
import { ViewTopRestroComponent } from '../dialog/view-top-restro/view-top-restro.component';
import { ViewUsersDetailsComponent } from '../dialog/view-users-details/view-users-details.component';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { DatTimePickerComponent } from '../common/date-time-picker/date-time-picker.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  searchForm: any;
  dashboardData: any;



  constructor(
    public _appService: AppService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
  ) {
    this.searchForm = this.fb.group({
      startDate: [moment().subtract(6, 'days').toDate()], // Set start date to 7 days ago
      endDate: [new Date()], // Set end date to current date
      is_nukhba_user: ['0']
    });
  }
  @ViewChild(DatTimePickerComponent) dateTimePicker: DatTimePickerComponent | undefined;


 
  ngOnInit() {
    this.loadData()
  }

  formReset = () => {
    this.searchForm.reset()
    this.dateTimePicker?.reset();
    this.loadData()
    
  }

  loadData() {
    let is_nukhba_user = this.searchForm.value.is_nukhba_user ? this.searchForm.value.is_nukhba_user : 0
    let startDate = (this.searchForm.value.startDate) != '' && (this.searchForm.value.startDate) ? moment(this.searchForm.value.startDate).format('YYYY-MM-DD') : '';
    let endDate = (this.searchForm.value.endDate) != '' && (this.searchForm.value.endDate) ? moment(this.searchForm.value.endDate).format('YYYY-MM-DD') : '';
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/daily-report?is_nukhba_user=${is_nukhba_user}&cumulative=true&from_date=${startDate}&to_date=${endDate}`).subscribe((res: any) => {
      this.dashboardData = res.data
      this._appService.hideSpinner()
    },
      (error) => {
        if (error?.error?.success == false) {
          this._appService.err(error?.error?.msg)
        }
        if (error?.error?.status_code == 401) {
          localStorage.removeItem('authtoken')
          this.router.navigateByUrl("/");
        }
      }
    )
  }
  onDateRangeChange(event: {startDate: Date, endDate: Date}) {
    console.log(event)
   this.searchForm.value.startDate=event.startDate
   this.searchForm.value.endDate=event.endDate
   
  }
  

  viewTopRestaurant(value: any) {
    const dialogRef = this.dialog.open(ViewTopRestroComponent, {
      hasBackdrop: false,
      width: '800px',
      data: {
        restroData: value ? value : '',
        isNukhba: this.searchForm.value.is_nukhba_user ? this.searchForm.value.is_nukhba_user : 0
      }
    });
    dialogRef.afterClosed().subscribe(result => {
       console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadData()
      }
    });
  }

  viewUsers(value: any, device: any) {
    const dialogRef = this.dialog.open(ViewUsersDetailsComponent, {
      hasBackdrop: false,
      width: '1000px',
      data: {
        restroData: value ? value : '',
        isNukhba: this.searchForm.value.is_nukhba_user ? this.searchForm.value.is_nukhba_user : 0,
        device: device
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
