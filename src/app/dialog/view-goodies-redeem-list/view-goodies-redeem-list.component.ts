import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { ViewFeedbackDetailsComponent } from '../view-feedback-details/view-feedback-details.component';
import { ViewReportedUserDetailsComponent } from '../view-reported-user-details/view-reported-user-details.component';
import { UpdateStatusRedeemListComponent } from '../update-status-redeem-list/update-status-redeem-list.component';

@Component({
  selector: 'app-view-goodies-redeem-list',
  templateUrl: './view-goodies-redeem-list.component.html',
  styleUrls: ['./view-goodies-redeem-list.component.scss']
})
export class ViewGoodiesRedeemListComponent {


  ELEMENT_DATA: CATEGORY[] = [];
  totalRows = 0;
  pageSize = 10;
  id: any
  searchForm!: FormGroup;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 20, 40, 100, 300];
  displayedColumns: string[] = ['sr', 'reported_date', 'desc', 'reported', 'comment', 'status', 'action'];
  dataSource: MatTableDataSource<CATEGORY> = new MatTableDataSource();
  selectedLocation: any = {}
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  teamData: any;
  apiUrl: any;
  searchTextNotEmpty: any;
  controls: any = {
    resId: {
      controls: 'resId',
      placeholder: 'Enter Restaturant Id',
      label: 'Restaurant Id'
    },
    name: {
      controls: 'name',
      placeholder: 'Enter Restaturant name',
      label: 'Search By Restaurant Name'
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
  lastSearchTerm: any;
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public _appService: AppService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,

  ) {
    this.searchForm = this.fb.group({
      name: [this.route.snapshot.queryParamMap.get('name') || ''],
      resId: ['']
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

  viewUser(userData: any = {}) {
    const dialogRef = this.dialog.open(ViewReportedUserDetailsComponent, {
      hasBackdrop: false,
      width: '700px',
      // height: '80px',
      data: {
        userData: userData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadData()
      }
    });
  }

  reportStatus(redeemData: any = {}) {
    const dialogRef = this.dialog.open(UpdateStatusRedeemListComponent, {
      hasBackdrop: false,
      width: '700px',
      // height: '80px',
      data: {
        redeemData: redeemData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result.status}`);
      // if (result && result.status != 'close') {
        this.loadData()
      // }
    });
  }

  reviewDetails(feedbackData: any = {}) {
    const dialogRef = this.dialog.open(ViewFeedbackDetailsComponent, {
      hasBackdrop: false,
      width: '700px',
      data: {
        feedbackData: feedbackData
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      // if (result && result.status != 'close') {
      this.loadData()
      // }
    });
  }
  searchData() {
    this.currentPage = 0
    this.loadData()
  }

  loadData() {
    this._appService.showSpinner();
    const params = this.buildQueryParams();
    this._appService.updateQueryParams(params);
    this._appService.getApiWithAuth(`/admin/store-redeem/list?type=2&page=${this.currentPage + 1}&page_size=${this.pageSize}&is_paginated=true`).subscribe((res: any) => {
      this._appService.hideSpinner();

      this.dataSource.data = res.data?.rows
    }, (error) => {
      if (error?.error?.status_code) {
        this.router.navigateByUrl("/");
        localStorage.removeItem('authtoken');
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
    this.id = ''
    this.searchForm.reset()
    this.loadData()
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

    this.loadData();
  }

  onClearSearch() {
    this.searchForm.patchValue({ name: "" })
    this.loadData();
    // Handle clear search logic here
  }

}



export interface CATEGORY {
  sr: string,
  name: string,
  image: string,
  type: string,
  Status: string,
}

