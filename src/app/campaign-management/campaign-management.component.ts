import { Component, HostBinding, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { AddCampaignComponent } from '../dialog/add-campaign/add-campaign.component';
import { ImagePreviewDialogComponent } from '../dialog/image-preview-dialog/image-preview-dialog.component';
import { RestaurantManagementComponent } from '../restaurant-management/restaurant-management.component';

@Component({
  selector: 'app-campaign-management',
  templateUrl: './campaign-management.component.html',
  styleUrls: ['./campaign-management.component.scss']
})
export class CampaignManagementComponent {
  @HostBinding('style.height') height = '56px';
  ELEMENT_DATA: CATEGORY[] = [];
  totalRows = 0;
  pageSize = 10;
  categoryResp: any;
  searchForm!: FormGroup;
  currentPage = 0;
  imageSrc: any;
  selectedCategory: any = {}
  pageSizeOptions: number[] = [10, 20, 300, 40, 100];
  displayedColumns: string[] = ['sr', 'name', 'start_date', 'end_date', 'agent_name', 'coupon_code', 'commission_amount', 'commission_type', 'status', 'action'];
  dataSource: MatTableDataSource<CATEGORY> = new MatTableDataSource();
  selectedContest: any = {}
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  teamData: any;
  apiUrl: any;
  controls: any = {
    name: {
      controls: 'name',
      placeholder: 'Search By Title',
      label: 'Search By Title'
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
  searchTextNotEmpty: any;
  constructor(
    public _appService: AppService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
  ) {
    this.searchForm = this.fb.group({
      name: [this.route.snapshot.queryParamMap.get('name') || ''],
      status: [this.route.snapshot.queryParamMap.get('status') || ''],
      type: [''],

      // startDate: [''],
      // endDate: [''],
    });
  }
  clearData() {
    this.searchTextNotEmpty = false
    this.searchForm.reset()
    this.loadData()
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    const params = this.route.snapshot.queryParamMap;
    this.searchForm.patchValue({
      name: params.get('name') || '',
      status: params.get('status') || '',

    });

    this.currentPage = params.get('page') ? +params.get('page')! - 1 : 0;
    this.pageSize = +params.get('pageSize')! || 10;
    this.loadData()
  }
  onSearch(searchText: string) {
    // Handle search logic here
    this.searchForm.patchValue({ name: searchText })

    this.loadData();
  }

  onClearSearch() {
    this.searchForm.patchValue({ name: "" })
    this.loadData();
    // Handle clear search logic here
  }

  ngAfterViewChecked(): void {
    // new addin_pad();
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
  searchData() {
    this.currentPage = 0
    this.loadData()
  }
  buildQueryParams() {

    const name = this.searchForm.value.name || '';
    const status = this.searchForm.value.status || '';
    return {
      name,
      status,
      page: this.currentPage + 1,
      pageSize: this.pageSize
    };
  }
  loadData() {
    this._appService.showSpinner()
    let status = this.searchForm.value.status ? this.searchForm.value.status : ''
    let name = this.searchForm.value.name ? this.searchForm.value.name : ''
    const params = this.buildQueryParams();
    this._appService.updateQueryParams(params);
    this._appService.getApiWithAuth(`/admin/campaign/get?keyword=${name}&page=${this.currentPage + 1}&page_size=${this.pageSize}&status=${status}&is_paginated=true&sortBy=created_at&order=desc`).subscribe((res: any) => {
      const filteredData = res.data?.rows || [];

      // Step 2: Extract userIds from the filtered data
      const userIds = filteredData
        .filter((row: any) => row.user_status == 0)
        .map((row: any) => row.user_id)
        .join(',');

      if (userIds.length > 0) {
        // Step 3: Call the /admin/deleted-users/list-by-id API to get the usernames
        this._appService.mergeDeletedUsersWithData(userIds,filteredData,this.dataSource,this.paginator,this.currentPage, res.data?.count)
      } else {
        // If no users with status = 0 are found
        this.dataSource.data = res.data?.rows || [];
        this._appService.hideSpinner();
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = res.data?.count || 0;
        });
      }
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

  previewImage(imageLink: any) {

    this.imageSrc = imageLink;
    const dialogRef = this.dialog.open(ImagePreviewDialogComponent, {
      hasBackdrop: false,
      data: { imageLink },
      // height: '600px',
      // width: '600px',
    });
    // this.dialog.open();
  }


  showEditForm(category: any) {
    this.selectedCategory = category
    this.addCampaign(category);
  }

  addCampaign(categoryData: any = {}) {
    const dialogRef = this.dialog.open(AddCampaignComponent, {
      hasBackdrop: false,
      width: '575px',
      // height: '80px',
      data: {
        categoryData: categoryData,
        // response: resp
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

  viewRestaurant(categoryData: any = {}) {
    const dialogRef = this.dialog.open(RestaurantManagementComponent, {
      hasBackdrop: false,
      width: '80%',
      height: '80%',
      data: {
        categoryData: categoryData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadData()
      }
    });
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }

  formReset = () => {
    this.currentPage = 0
    this.searchForm.reset()
    this.loadData()
    // window.location.reload()
  }
}



export interface CATEGORY {
  sr: string,
  name: string,
  image: string,
  type: string,
  Status: string,
}