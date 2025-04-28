import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { AppService } from 'src/app.service';
import { DatTimePickerComponent } from '../common/date-time-picker/date-time-picker.component';

@Component({
  selector: 'app-campaign-report',
  templateUrl: './campaign-report.component.html',
  styleUrls: ['./campaign-report.component.scss']
})
export class CampaignReportComponent {
  ELEMENT_DATA: CATEGORY[] = [];
  totalRows = 0;
  pageSize = 10;
  searchForm!: FormGroup;
  currentPage = 0;
  selectedCategory: any = {}
  pageSizeOptions: number[] = [10, 20, 300, 40, 100];
  displayedColumns: string[] = ['sr', 'campaign_code',   'coupon_code','start_date', 'end_date','commission_type','commission_amount', 'total_signup','total_booking'];
  dataSource: MatTableDataSource<CATEGORY> = new MatTableDataSource();
  selectedContest: any = {}
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  teamData: any;
  apiUrl: any;
  controls: any = {
    name: {
      controls: 'name',
      placeholder: 'Search Name',
      label: 'Enter Name'
    },
    date: {
      controls: { startDate: 'startDate', endDate: 'endDate' },
      placeholder: 'Enter date range',
      label: 'Select Date'
    },
    pagination: {
      page: 1,
      pageSize: 10,
    }
  }
  constructor(
    public _appService: AppService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,

  ) {
    this.searchForm = this.fb.group({
      name: [this.route.snapshot.queryParamMap.get('name') || ''],
      startDate:[this.route.snapshot.queryParamMap.get('startDate') || ''],
      endDate:[this.route.snapshot.queryParamMap.get('endDate') || '']
    });
  }
  @ViewChild(DatTimePickerComponent) dateTimePicker: DatTimePickerComponent | undefined;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    const params = this.route.snapshot.queryParamMap;
    this.searchForm.patchValue({
      name: params.get('name') || '',
      endDate: params.get('endDate') || '',
      startDate: params.get('startDate') || '',

    });

    this.currentPage = params.get('page') ? +params.get('page')! - 1 : 0;
    this.pageSize = +params.get('pageSize')! || 10;
    this.loadData()
  }
  buildQueryParams() {

    const name = this.searchForm.value.name || '';
    const endDate = this.searchForm.value.endDate || '';
    const startDate = this.searchForm.value.startDate || '';
    return {
      name,
      startDate,
      endDate,
      page: this.currentPage + 1,
      pageSize: this.pageSize
    };
  }
  searchData(){
    this.currentPage=0
    this.loadData()
  }

  ngAfterViewChecked(): void {
    // new addin_pad();
  }
  onDateRangeChange(event: {startDate: Date, endDate: Date}) {
    console.log(event)
   this.searchForm.value.startDate=event.startDate
   this.searchForm.value.endDate=event.endDate
   
  }
  loadData() {
    this._appService.showSpinner()
    let startDate = (this.searchForm.value.startDate) != '' && (this.searchForm.value.startDate) ? moment(this.searchForm.value.startDate).format('YYYY-MM-DD') :'';
    let endDate = (this.searchForm.value.endDate) != '' && (this.searchForm.value.endDate) ? moment(this.searchForm.value.endDate).format('YYYY-MM-DD') : '';
    const params = this.buildQueryParams();
    this._appService.updateQueryParams(params);
    this._appService.getApiWithAuth(`/admin/report/campaign?start_date=${startDate}&end_date=${endDate}&campaign_code=${this.searchForm.value.name}`).subscribe((res: any) => {
      this.dataSource.data = res.data
      this._appService.hideSpinner()
      setTimeout(() => {
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length = res.data?.count ||10;
      });
      // this.isLoading = false;
    },
      (error) => {
        if (error?.error?.success == false) {
          this._appService.err(error?.error?.msg)
          this._appService.hideSpinner()
        }
        if (error?.error?.status_code == 401) {
          localStorage.removeItem('authtoken')
          this.router.navigateByUrl("/");
          this._appService.hideSpinner()
        }
      })
  }

  //showEditForm(category: any) {
  //   this.selectedCategory = category
  //   //this.addCategory(category);
  // }

  // addCategory(bannerData: any = {}) {
  //   const dialogRef = this.dialog.open(AddBannerComponent, {
  //     // width: '80px',
  //     // height: '80px',
  //     data: {
  //       bannerData: bannerData,
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(`Dialog result: ${result}`);
  //     this.loadData()
  //   });
  // }
  // deleteBanner(element: any) {
  //   const dialogRef = this.dialog.open(DeleteRequestComponent, {
  //     // width: '80px',
  //     // height: '80px',
  //     data: {
  //       text: 'Banner',
  //       label: 'Delete',
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(`Dialog result: ${result.data}`);
  //     if (result && result.data.status == 1) {
  //       let data = {
  //         id: element.id
  //       }
  //       this._appService.deleteApi(`/admin/banner/delete`, data, 1).subscribe((success: any) => {
  //         if (success.success) {
  //           this._appService.success(success.msg)
  //           this.loadData()
  //         } else {
  //           this._appService.error(success.msg)
  //           this.loadData()
  //         }
  //       })
  //     }


  //   });
  // }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }

  formReset = () => {
    this.currentPage = 0
    this.searchForm.reset()
    this.dateTimePicker?.reset()
    this.loadData()
  }
}


export interface CATEGORY {
  sr: string,
  name: string,
  image: string,
  type: string,
  Status: string,
}