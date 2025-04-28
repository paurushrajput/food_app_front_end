import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app.service';

@Component({
  selector: 'app-active-campaign',
  templateUrl: './active-campaign.component.html',
  styleUrls: ['./active-campaign.component.scss']
})
export class ActiveCampaignComponent {

  ELEMENT_DATA: CATEGORY[] = [];
  totalRows = 0;
  pageSize = 10;
  searchForm!: FormGroup;
  currentPage = 0;
  selectedCategory: any = {}
  pageSizeOptions: number[] = [10, 20, 300, 40, 100];
  displayedColumns: string[] = ['sr', 'campaign_code',   'coupon_code','start_date', 'end_date','commission_amount', 'total_signup','total_booking','mobile_verified_users_count'];
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
    });
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    const params = this.route.snapshot.queryParamMap;
    this.searchForm.patchValue({
      name: params.get('name') || '',


    });

    this.currentPage = params.get('page') ? +params.get('page')! - 1 : 0;
    this.pageSize = +params.get('pageSize')! || 10;
    this.loadData()
  }

  ngAfterViewChecked(): void {
    // new addin_pad();
  }
  buildQueryParams() {

    const name = this.searchForm.value.name || '';
    return {
      name,
      page: this.currentPage + 1,
      pageSize: this.pageSize
    };
  }
  searchData(){
    this.currentPage=0
    this.loadData()
  }
  loadData() {
    this._appService.showSpinner()
    const params = this.buildQueryParams();
    this._appService.updateQueryParams(params);
    // let type = this.searchForm.value.type ? this.searchForm.value.type : ''
    // let size = this.searchForm.value.size ? this.searchForm.value.size : ''
    this._appService.getApiWithAuth(`/admin/report/agent?referral_code=${this.searchForm.value.name}`).subscribe((res: any) => {
      this.dataSource.data = res.data
      this._appService.hideSpinner()
      setTimeout(() => {
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length = res.data.length>0?res.data?.count ||10:0;
      });
      // this.isLoading = false;
    },
      (error) => {
        if (error?.error?.success == false) {
          this._appService.err(error?.error?.msg)
        }
        if (error?.error?.status_code == 401) {
          localStorage.removeItem('authtoken')
          this.router.navigateByUrl("/");
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