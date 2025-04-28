import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { AppService } from 'src/app.service';
import { InstantPaymentFilterComponent } from '../dialog/instant-payment-filter/instant-payment-filter.component';
import { ViewTxnDetailsComponent } from '../dialog/view-txn-details/view-txn-details.component';

@Component({
  selector: 'app-instant-payment-management',
  templateUrl: './instant-payment-management.component.html',
  styleUrls: ['./instant-payment-management.component.scss']
})
export class InstantPaymentManagementComponent {

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
  displayedColumns: string[] = ['sr', 'name', 'email', 'bookingId', 'resName', 'amount', 'date', 'statusCode','status1','action1'];
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
      restaurant_name: [''],
      from_date: [''],
      to_date: [''],
      reservation_id: [''],
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
    this.loadData()
  }

  emptyObject = () => {
    Object.keys(this.dialogData).forEach(key => {
      this.dialogData[key] = '';
    });
  }
  toggleTruncation(index: number) {
    this.isTruncated[index] = !this.isTruncated[index];
  }

  dateCut(str: any) {
    if (str) {
      console.log(str);
      let month = str.slice(5, 7)
      let year = str.slice(2, 4)
      let day = str.slice(8, 10)
      let getMonth = this.getMonthName(month)
      let fullDate = day + '-' + getMonth + '-' + year
      return fullDate + '<br/>' + str.slice(11, 16)
    } else {
      return 'N/A'
    }
  }

  getMonthName(monthNumber: any) {
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "June",
      "July", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Ensure the monthNumber is valid (1-12)
    if (monthNumber < 1 || monthNumber > 12) {
      return "Invalid month number";
    }

    // Return the corresponding month name
    return monthNames[monthNumber - 1];
  }

  ngOnInit() {
    const params = this.route.snapshot.queryParamMap;
    this.searchForm.patchValue({
      restaurant_name: params.get('restaurant_name') || '',
      from_date: params.get('from_date') || '',
      to_date: params.get('to_date') || '',
      reservation_id: params.get('reservation_id') || '',
    });
    this.currentPage = params.get('page') ? +params.get('page')! - 1 : 0;
    this.pageSize = +params.get('pageSize')! || 10;
    this.loadData()
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
  buildQueryParams() {

    const restaurant_name = this.searchForm.value.restaurant_name || '';
    const from_date = this.searchForm.value.from_date || '';
    const to_date = this.searchForm.value.to_date || '';
    const reservation_id = this.searchForm.value.reservation_id || '';
    return {
      restaurant_name,
      from_date,
      to_date,
      reservation_id,
      page: this.currentPage + 1,
      pageSize: this.pageSize
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadData() {
    const params = this.buildQueryParams()
    this._appService.updateQueryParams(params)
    let formValue = this.searchForm.value;
    let restaurant_name = formValue?.restaurant_name ? formValue?.restaurant_name : ''
    let from_date = (formValue?.from_date) != '' && (formValue?.from_date) ? moment(formValue?.from_date).format('YYYY-MM-DD') : '';
    let to_date = (formValue?.to_date) != '' && (formValue?.to_date) ? moment(formValue?.to_date).format('YYYY-MM-DD') : '';
    let reservation_id = formValue?.reservation_id ? formValue?.reservation_id : ''
    this._appService.getApiWithAuth(`/admin/reservation/instant-payment?is_paginated=true&page=${this.currentPage + 1}&page_size=${this.pageSize}&restaurant_name=${restaurant_name}&from_date=${from_date}&to_date=${to_date}&reservation_id=${reservation_id}`).subscribe((res: any) => {
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
      })
  }

  loadDatav2() {
    let formValue = this.dialogData;
    if (formValue) {
      let restaurant_name = formValue?.restaurant_name ? formValue?.restaurant_name : ''
      let from_date = (formValue?.from_date) != '' && (formValue?.from_date) ? moment(formValue?.from_date).format('YYYY-MM-DD') : '';
      let to_date = (formValue?.to_date) != '' && (formValue?.to_date) ? moment(formValue?.to_date).format('YYYY-MM-DD') : '';
      let reservation_id = formValue?.reservation_id ? formValue?.reservation_id : ''
      this._appService.getApiWithAuth(`/admin/reservation/instant-payment?is_paginated=true&page=${this.currentPage + 1}&page_size=${this.pageSize}&restaurant_name=${restaurant_name}&from_date=${from_date}&to_date=${to_date}&reservation_id=${reservation_id}`).subscribe((res: any) => {
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
    const dialogRef = this.dialog.open(InstantPaymentFilterComponent, {
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
}


export interface GAME {
  sr: string,
  title: string,
  gameUrl: string,
  image: String,
  isSelected: string,
}
