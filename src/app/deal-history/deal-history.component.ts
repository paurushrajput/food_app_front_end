import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { AddLocationComponent } from '../dialog/add-location/add-location.component';
import { DealHistoryFilterComponent } from '../dialog/deal-history-filter/deal-history-filter.component';
import * as moment from 'moment';
import { ViewTxnDetailsComponent } from '../dialog/view-txn-details/view-txn-details.component';
import { RedeemOtpComponent } from '../dialog/redeem-otp/redeem-otp.component';

@Component({
  selector: 'app-deal-history',
  templateUrl: './deal-history.component.html',
  styleUrls: ['./deal-history.component.scss']
})
export class DealHistoryComponent {
  dialogData: any
  ELEMENT_DATA: CATEGORY[] = [];
  totalRows = 0;
  pageSize = 10;
  id: any
  searchForm!: FormGroup;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 20, 40, 100, 300];
  displayedColumns: string[] = ['sr', 'purchaseDate', 'dealId', 'restro', 'username', 'deal', 'type', 'is_pilot', 'quantity', 'total_price', 'redeemed_date', 'expiryDate', 'slot_time', 'selected', 'statusCode', 'status1', 'action1'];
  dataSource: MatTableDataSource<CATEGORY> = new MatTableDataSource();
  selectedLocation: any = {}
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  teamData: any;
  apiUrl: any;
  searchTextNotEmpty: any;
  lastSearchTerm: any;
  constructor(
    public _appService: AppService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,


  ) {
    this.searchForm = this.fb.group({
      created_at_from_date: [''],
      created_at_to_date: [''],
      redeemed_at_from_date: [''],
      redeemed_at_to_date: [''],
      type: ['paid'],
      is_pilot: ['0'],
      booking_id: [''],
      status: ['']
    });
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    const params = this.route.snapshot.queryParamMap;
    this.searchForm.patchValue({
      created_at_from_date: params.get('created_at_from_date') || '',
      created_at_to_date: params.get('created_at_to_date') || '',
      redeemed_at_from_date: params.get('redeemed_at_from_date') || '',
      redeemed_at_to_date: params.get('redeemed_at_to_date') || '',
      type: params.get('type') || 'paid',
      booking_id: params.get('booking_id') || '',
      status: params.get('status') || '',
      is_pilot: params.get('is_pilot') || 0
    });
    this.currentPage = params.get('page') ? +params.get('page')! - 1 : 0;
    this.pageSize = +params.get('pageSize')! || 10;
    this.loadData()
  }
  buildQueryParams() {
    const created_at_from_date = this.searchForm.value.created_at_from_date || '';
    const created_at_to_date = this.searchForm.value.created_at_to_date || '';
    const redeemed_at_from_date = this.searchForm.value.redeemed_at_from_date || '';
    const redeemed_at_to_date = this.searchForm.value.redeemed_at_to_date || '';
    const type = this.searchForm.value.type || '';
    const booking_id = this.searchForm.value.booking_id || '';
    const is_pilot = this.searchForm.value.is_pilot;
    const status = this.searchForm.value.status;
    return {
      created_at_from_date,
      is_pilot,
      redeemed_at_from_date,
      redeemed_at_to_date,
      created_at_to_date,
      type,
      booking_id,
      status,
      page: this.currentPage + 1,
      pageSize: this.pageSize
    };
  }
  ngAfterViewChecked(): void {
    // new addin_pad();
  }

  addLocation(categoryData: any = {}) {
    const dialogRef = this.dialog.open(AddLocationComponent, {
      hasBackdrop: false,
      // width: '80px',
      // height: '80px',
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



  loadData() {
    this._appService.showSpinner();

    let formValue = this.searchForm.value;
    this.searchForm.patchValue({ 'type': formValue.type });
    this.searchForm.patchValue({ 'is_pilot': formValue.is_pilot });

    const params = this.buildQueryParams();
    this._appService.updateQueryParams(params);

    this._appService.getApiWithAuth(`/admin/deal/user-deal-list?page=${this.currentPage + 1}&page_size=${this.pageSize}&is_paginated=true&type=${formValue.type}&is_pilot=${formValue.is_pilot}`)
      .subscribe((res: any) => {
        // Step 1: Filter the data where status is 0
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
      }, (error) => {
        if (error?.error?.status_code) {
          this.router.navigateByUrl("/");
          localStorage.removeItem('authtoken');
        }
        this._appService.hideSpinner();
      });
  }


  loadDatav2() {
    this._appService.showSpinner();
    let formValue = this.dialogData;
    if (formValue) {
      let created_at_from_date = (formValue.created_at_from_date) != '' && (formValue.created_at_from_date) ? moment(formValue.created_at_from_date).format('YYYY-MM-DD') : '';
      let created_at_to_date = (formValue.created_at_to_date) != '' && (formValue.created_at_to_date) ? moment(formValue.created_at_to_date).format('YYYY-MM-DD') : '';
      let redeemed_at_from_date = (formValue.redeemed_at_from_date) != '' && (formValue.redeemed_at_from_date) ? moment(formValue.redeemed_at_from_date).format('YYYY-MM-DD') : '';
      let redeemed_at_to_date = (formValue.redeemed_at_to_date) != '' && (formValue.redeemed_at_to_date) ? moment(formValue.redeemed_at_to_date).format('YYYY-MM-DD') : '';
      let booking_id = formValue.booking_id ? formValue.booking_id : ''
      let type = formValue.type
      let status = formValue.status
      let is_pilot = formValue.is_pilot
      let query = ''
      if (type) {
        query += `&type=${type}`
      }
      if (status) {
        query += `&order_status_code=${status}`
      }
      if (is_pilot) {
        query += `&is_pilot=${formValue.is_pilot}`
      }
      this._appService.getApiWithAuth(`/admin/deal/user-deal-list?booking_id=${booking_id}&created_at_from_date=${created_at_from_date}&created_at_to_date=${created_at_to_date}&redeemed_at_from_date=${redeemed_at_from_date}&redeemed_at_to_date=${redeemed_at_to_date}&page=${this.currentPage + 1}&page_size=${this.pageSize}&is_paginated=true${query}`).subscribe((res: any) => {
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
      }, (error) => {
        if (error?.error?.status_code) {
          this.router.navigateByUrl("/");
          localStorage.removeItem('authtoken');
        }
      });
    } else {
      this.loadData()
    }
  }


  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadDatav2();
  }

  dealHistoryFilter() {
    const dialogRef = this.dialog.open(DealHistoryFilterComponent, {
      hasBackdrop: false,
      width: "575px",
      data: {
        data: this.dialogData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result?.data) {
        this.currentPage = 0
        this.dialogData = result.data;
        this.loadDatav2()
      }
    });
  }

  formReset = () => {
    this.currentPage = 0
    this.id = ''
    this.dialogData = ''
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

  txnDetails(data: any = {}) {
    const dialogRef = this.dialog.open(ViewTxnDetailsComponent, {
      hasBackdrop: false,
      width: "800px",
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result.data) {
        this.currentPage = 0
        this.dialogData = result.data;
        this.loadDatav2()
      }
    });
  }
  redeemOtp(data: any = {}) {
    const dialogRef = this.dialog.open(RedeemOtpComponent, {
      hasBackdrop: false,
      width: "800px",
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result.data) {
        this.currentPage = 0
        this.dialogData = result.data;
        this.loadDatav2()
      }
    });
  }
}



export interface CATEGORY {
  sr: string,
  name: string,
  image: string,
  type: string,
  Status: string,
}
