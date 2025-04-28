import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app.service';
import { RestaurantManagementComponent } from '../restaurant-management/restaurant-management.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ForcePassUpdateComponent } from '../dialog/force-pass-update/force-pass-update.component';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-merchant-management',
  templateUrl: './merchant-management.component.html',
  styleUrls: ['./merchant-management.component.scss']
})
export class MerchantManagementComponent {
  url: any
  ELEMENT_DATA: CATEGORY[] = [];
  totalRows = 0;
  pageSize = 10;
  id: any
  searchForm!: FormGroup;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 20, 300, 40, 100];
  displayedColumns: string[] = ['sr', 'name', 'email', 'mobile', 'resName', 'location', 'resCount', 'loginCount', 'action', 'force', 'login'];
  dataSource: MatTableDataSource<CATEGORY> = new MatTableDataSource();
  selectedLocation: any = {}
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  teamData: any;
  apiUrl: any;
  searchTextNotEmpty: any;
  controls: any = {
    name: {
      controls: 'name',
      placeholder: 'Search by Email /Mobile /Name',
      label: 'Search by Email /Mobile /Name'
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
    private route: ActivatedRoute,
    public router: Router,
  ) {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      console.log('ID from URL:', this.id);
    });
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
    if (environment.apiUrl == 'https://adminapi.nukhba.com/api/v1') {
      this.url = 'https://merchant.nukhba.com'
    } else {
      this.url = 'https://betamerchant.nukhba.com'
      //this.url = 'http://localhost:9001'
    }
  }
  searchData() {
    this.currentPage = 0
    this.loadData();

  }

  ngAfterViewChecked(): void {
    // new addin_pad();
  }

  formReset = () => {
    this.currentPage = 0
    this.searchForm.reset()
    this.loadData()
  }

  viewRestaurant(merchantData: any = {}) {
    const dialogRef = this.dialog.open(RestaurantManagementComponent, {
      hasBackdrop: false,
      width: '1080px',
      height: '550px',
      data: {
        merchantData: merchantData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadData()
      }
    });
  }

  checkSearchText(event: KeyboardEvent) {
    console.log(this.searchForm.value)
    this.searchTextNotEmpty = this.searchForm.value?.name?.trim().length > 0;
    if (event.key === "Enter") {
      // If the search text is not empty, then loadData is called
      if (this.searchTextNotEmpty) {
        this.loadData();
      }
      // Prevent any further execution
      return;
    }
    // If it's not Enter key, no need to load data, just update the searchTextNotEmpty flag
    this.searchTextNotEmpty = this.searchForm.value?.name?.trim().length > 0;
  }

  onSearch(searchText: string) {
    // Handle search logic here
    this.searchForm.patchValue({ name: searchText })
    this.currentPage = 0
    this.loadData();
  }

  onClearSearch() {
    this.searchForm.patchValue({ name: "" })
    this.currentPage = 0
    this.loadData();
    // Handle clear search logic here
  }


  forcePassUpdate(merchantData: any = {}) {
    const dialogRef = this.dialog.open(ForcePassUpdateComponent, {
      hasBackdrop: false,
      data: {
        merchantData: merchantData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.currentPage = 0
        this.loadData()
      }
    });
  }
  buildQueryParams() {

    const name = this.searchForm.value.name || '';
    return {
      name,
      page: this.currentPage + 1,
      pageSize: this.pageSize
    };
  }
  loadData() {
    let name = this.searchForm.value.name ? this.searchForm.value.name : '';
    const params = this.buildQueryParams();
    this._appService.updateQueryParams(params);
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/merchants/list?keyword=${name}&page=${this.currentPage + 1}&page_size=${this.pageSize}`).subscribe((res: any) => {
      this.dataSource.data = res.data.rows
      this._appService.hideSpinner()
      setTimeout(() => {
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length = res.data?.count;
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


  viewDashboard(data: any) {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/merchants/access-token?merchant_id=${data.id}`).subscribe((res: any) => {
      this._appService.hideSpinner()
      try {
        if (res.success == true) {
          this._appService.success(res.msg)
          let navigate = `${this.url}/dashboard?merchant_id=${data.id}&token=${res.data.access_token}`
          console.log(navigate);
          window.open(navigate, '_blank');
        } else {
          this._appService.err(res.msg)
        }
      } catch (err) {
        console.log(err);
      }
    })
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }
}



export interface CATEGORY {
  sr: string,
  name: string,
  image: string,
  type: string,
  Status: string,
}