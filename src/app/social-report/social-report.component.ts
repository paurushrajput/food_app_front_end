import { Component, HostBinding, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app.service';

@Component({
  selector: 'app-social-report',
  templateUrl: './social-report.component.html',
  styleUrls: ['./social-report.component.scss']
})
export class SocialReportComponent {

 @HostBinding('style.height') height = '56px';
  ELEMENT_DATA: CATEGORY[] = [];
  totalRows = 0;
  lable:any='Profile Report Management'
  pageSize = 10;
  categoryResp: any;
  searchForm!: FormGroup;
  currentPage = 0;
  imageSrc: any;
  selectedCategory: any = {}
  pageSizeOptions: number[] = [10, 20, 300, 40, 100];
  displayedColumns: string[] = ['sr', 'fname','lname','name', 'email', 'compaign_start_date', 'compaign_end_date', 'campaign', 'earned_commission_amount'];
  dataSource: MatTableDataSource<CATEGORY> = new MatTableDataSource();
  selectedContest: any = {}
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  teamData: any;
  apiUrl: any;
  controls: any = {
    name: {
      controls: 'search',
      placeholder: 'Enter name',
      label: 'Search By User Name'
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
element: any;
  constructor(
    public _appService: AppService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
  ) {
    this.searchForm = this.fb.group({
      search: [this.route.snapshot.queryParamMap.get('search') || ''],
      status: [''],
      type: [''],

      // startDate: [''],
      // endDate: [''],
    });
  }
  buildQueryParams() {

    const search = this.searchForm.value.search || '';
    return {
      search,
      page: this.currentPage + 1,
      pageSize: this.pageSize
    };
  }
  isTruncated: boolean[] = [];
  fullTxnIdIndex: number = -1;
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    const params = this.route.snapshot.queryParamMap;
    this.searchForm.patchValue({
      search: params.get('search') || '',


    });

    this.currentPage = params.get('page') ? +params.get('page')! - 1 : 0;
    this.pageSize = +params.get('pageSize')! || 10;
    this.loadData()
  }

  toggleTruncation(index: number) {
    // Toggle the clicked state for the clicked row
    this.isTruncated[index] = !this.isTruncated[index];
  }
  searchData(){
    this.currentPage=0
    this.loadData()
  }
  loadData() {
    this._appService.showSpinner()
    const params = this.buildQueryParams();
    this._appService.updateQueryParams(params);
    this._appService.getApiWithAuth(`/admin/agent/list?page=${this.currentPage + 1}&page_size=${this.pageSize}&is_paginated=true&search=${this.searchForm.value?.search?this.searchForm.value?.search:''}`).subscribe((res: any) => {
      const filteredData = res.data?.list || [];

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
        this.dataSource.data = res.data?.list || [];
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

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }

  formReset = () => {
    this.searchForm.reset()
    this.loadData()
    this.currentPage = 0
    // window.location.reload()
  }

  navigateToOtherTab(e: any) {
    if (e.tab.textLabel == 'Profile') {
      this.lable = 'Profile Report Management'
    }
    if (e.tab.textLabel == 'Post') {
      this.lable = 'Post Report Management'
    }
    if (e.tab.textLabel == 'Comment') {
      this.lable = 'Comment Report Management'
    }
  }
}



export interface CATEGORY {
  sr: string,
  name: string,
  image: string,
  type: string,
  Status: string,
}