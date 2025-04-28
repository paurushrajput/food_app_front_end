import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app.service';
import * as moment from 'moment/moment';
import { TxnFiltersComponent } from '../dialog/txn-filters/txn-filters.component';
import { ViewTxnDetailsComponent } from '../dialog/view-txn-details/view-txn-details.component';

@Component({
  selector: 'app-transaction-management',
  templateUrl: './transaction-management.component.html',
  styleUrls: ['./transaction-management.component.scss']
})
export class TransactionManagementComponent {

  searchForm!: FormGroup;
  ELEMENT_DATA: GAME[] = [];
  userList: any = []
  isLoading = false;
  totalRows = 0;
  pageSize = 50;
  dialogData: any;
  currentPage = 0;
  private exportTime = { hour: 7, minute: 15, meriden: 'PM', format: 24 };
  pageSizeOptions: number[] = [50, 100, 150, 200];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  displayedColumns: string[] = ['sr', 'paymentDate', 'bookingDate', 'slotTime', 'name', 'email', 'phone', 'bookingId', 'resName', 'resLocation', 'amount', 'pax', 'txnId', 'isPilot', 'status','action1'];
  dataSource: MatTableDataSource<GAME> = new MatTableDataSource();
  controls: any = {
    name: {
      controls: 'name',
      placeholder: 'Search by Restaurant Name',
      label: 'Search by Restaurant Name'
    },
    bookingId: {
      controls: 'bookingId',
      placeholder: 'Search by Booking ID',
      label: 'Search by Booking ID'
    },
    email: {
      controls: 'email',
      placeholder: 'Search by User Email',
      label: 'Search by User Email'
    }
  }
  constructor(
    public router: Router, private route: ActivatedRoute,  // Added ActivatedRoute
    public _appService: AppService, private fb: FormBuilder, public dialog: MatDialog, @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.searchForm = this.fb.group({
      name: [''],
      slot_time: [''],
      paymentStatus: [''],
      paymentMode: [''],
      booking_date_start: [''],
      booking_date_end: [''],
      bookingId: [''],
      email: [''],
      is_nukhba_user: ['0'],
      is_pilot: ['0']
    });
  }
  isTruncated: boolean[] = [];
  fullTxnIdIndex: number = -1;

  formReset = () => {
    this.currentPage = 0
    if (this.dialogData) {
      this.emptyObject()
    }
    this.searchForm.reset()
    this.loadDatav2()
    // this.dialogRef.close({ event: 'close' });
  }

  emptyObject = () => {
    Object.keys(this.dialogData).forEach(key => {
      this.dialogData[key] = '';
    });
  }
  toggleTruncation(index: number) {
    // Toggle the clicked state for the clicked row
    this.isTruncated[index] = !this.isTruncated[index];
  }



  // formReset = () => {
  //   this.searchForm.reset()
  //   this.loadData()
  //   window.location.reload()
  // }


  ngOnInit() {
    const params = this.route.snapshot.queryParamMap;
    this.searchForm.patchValue({
      name: params.get('name') || '',
      slot_time: params.get('slot_time') || '',
      paymentStatus: params.get('paymentStatus') || '',
      paymentMode: params.get('paymentMode') || '',
      booking_date_start: params.get('booking_date_start') || '',
      booking_date_end: params.get('booking_date_end') || '',
      bookingId: params.get('bookingId') || '',
      email: params.get('email') || '',
      is_nukhba_user: params.get('is_nukhba_user') || 0,
      is_pilot: params.get('is_pilot') || 0
    });

    this.currentPage = params.get('page') ? +params.get('page')! - 1 : 0;
    this.pageSize = +params.get('pageSize')! || 10;
    this.loadData()

  }
  buildQueryParams() {

    const name = this.searchForm.value.name || '';
    const slot_time = this.searchForm.value.slot_time || '';
    const paymentStatus = this.searchForm.value.paymentStatus || '';
    const paymentMode = this.searchForm.value.paymentMode || '';
    const booking_date_start = this.searchForm.value.booking_date_start || '';
    const booking_date_end = this.searchForm.value.booking_date_end || '';
    const bookingId = this.searchForm.value.bookingId || '';
    const email = this.searchForm.value.email || '';
    const is_nukhba_user = this.searchForm.value.is_nukhba_user;
    const is_pilot = this.searchForm.value.is_pilot;
    return {
      name,
      is_pilot,
      slot_time,
      is_nukhba_user,
      paymentStatus,
      paymentMode,
      booking_date_start,
      booking_date_end,
      bookingId,
      email,
      page: this.currentPage + 1,
      pageSize: this.pageSize
    };
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadData() {
    let formValue = this.searchForm.value;
    let name = formValue.name ? formValue.name : ''
    let bookingId = formValue.bookingId ? formValue.bookingId : ''
    let email = formValue.email ? formValue.email : ''
    let paymentMode = formValue.paymentMode
    let paymentStatus = formValue.paymentStatus
    let bookingStartDate = (this.searchForm.value.booking_date_start) != '' && (this.searchForm.value.booking_date_start) ? moment(this.searchForm.value.booking_date_start).format('YYYY-MM-DD') : '';
    let bookingEndDate = (this.searchForm.value.booking_date_end) != '' && (this.searchForm.value.booking_date_end) ? moment(this.searchForm.value.booking_date_end).format('YYYY-MM-DD') : '';
    let is_nukhba_user = formValue.is_nukhba_user ? formValue.is_nukhba_user : 0
    let is_pilot = formValue.is_pilot ? formValue.is_nukhba_user : 0
    this.searchForm.patchValue({ 'is_nukhba_user': formValue.is_nukhba_user })
    this.searchForm.patchValue({ 'is_pilot': formValue.is_pilot })
    let query = ''
    // if (is_nukhba_user) {
    //   query += `&is_nukhba_user=${is_nukhba_user}`
    // }
    // if (is_pilot) {
    //   query += `&is_pilot=${formValue.is_pilot}`
    // }
    if (paymentMode) {
      query += `&payment_mode=${paymentMode}`
    }
    if (paymentStatus) {
      query += `&order_status_code=${paymentStatus}`
    }
    this.searchForm.patchValue({ 'booking_date_start': bookingStartDate })
    this.searchForm.patchValue({ 'booking_date_end': bookingEndDate })
    const params = this.buildQueryParams()
    this._appService.updateQueryParams(params)
    this._appService.getApiWithAuth(`/admin/payments/list?&user_email=${email}&reservation_id=${bookingId}&is_paginated=true&page=${this.currentPage + 1}&page_size=${this.pageSize}&restaurant_name=${name}&booking_date_start=${bookingStartDate}&booking_date_end=${bookingEndDate}&is_nukhba_user=${is_nukhba_user}&is_pilot=${is_pilot}${query}`).subscribe((res: any) => {
      const filteredData = res.data?.rows || [];
      this.isTruncated = Array(filteredData.length).fill(false);
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
      })
  }

  loadDatav2() {
    let formValue = this.dialogData;
    console.log('=====', formValue);

    if (formValue) {
      let name = formValue?.name ? formValue?.name : ''
      let bookingId = formValue?.bookingId ? formValue?.bookingId : ''
      let email = formValue?.email ? formValue?.email : ''
      let paymentMode = formValue?.paymentMode
      let paymentStatus = formValue?.paymentStatus
      let bookingStartDate = (formValue?.booking_date_start) != '' && (formValue?.booking_date_start) ? moment(formValue?.booking_date_start).format('YYYY-MM-DD') : '';
      let bookingEndDate = (formValue?.booking_date_end) != '' && (formValue?.booking_date_end) ? moment(formValue?.booking_date_end).format('YYYY-MM-DD') : '';
      let query = ''
      let is_nukhba_user = formValue?.is_nukhba_user;
      let is_pilot = formValue?.is_pilot
      this.searchForm.patchValue(formValue)
      this.searchForm.patchValue({ 'booking_date_start': bookingStartDate })
      this.searchForm.patchValue({ 'booking_date_end': bookingEndDate })
      this.searchForm.patchValue({ 'is_nukhba_user': is_nukhba_user })
      this.searchForm.patchValue({ 'is_pilot': is_pilot })

      const params = this.buildQueryParams()
      this._appService.updateQueryParams(params)
      if (paymentMode) {
        query += `&payment_mode=${paymentMode}`
      }
      if (paymentStatus) {
        query += `&order_status_code=${paymentStatus}`
      }
      if (is_nukhba_user) {
        query += `&is_nukhba_user=${is_nukhba_user}`
      }
      if (is_pilot) {
        query += `&is_pilot=${formValue.is_pilot}`
      }
      this._appService.getApiWithAuth(`/admin/payments/list?user_email=${email}&reservation_id=${bookingId}&is_paginated=true&page=${this.currentPage + 1}&page_size=${this.pageSize}&restaurant_name=${name}&from_date=${bookingStartDate}&to_date=${bookingEndDate}${query}`).subscribe((res: any) => {
        const filteredData = res.data?.rows || [];
        this.isTruncated = Array(filteredData.length).fill(false);
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
        })
    } else {
      this.loadData()
    }
  }

  pageChanged(event: PageEvent) {

    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadDatav2();
  }

  txnFilter(merchantData: any = {}) {
    const dialogRef = this.dialog.open(TxnFiltersComponent, {
      hasBackdrop: false,
      width: "575px",
      data: {
        data: this.dialogData,
      }
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
}


export interface GAME {
  sr: string,
  title: string,
  gameUrl: string,
  image: String,
  isSelected: string,
}
