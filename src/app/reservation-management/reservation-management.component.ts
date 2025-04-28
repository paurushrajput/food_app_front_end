import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app.service';
import { AddLocationComponent } from '../dialog/add-location/add-location.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingCancelComponent } from '../dialog/booking-cancel/booking-cancel.component';
import * as moment from 'moment/moment';
import * as momentv1 from 'moment-timezone';
import { ReservationFilterComponent } from '../dialog/reservation-filter/reservation-filter.component';

@Component({
  selector: 'app-reservation-management',
  templateUrl: './reservation-management.component.html',
  styleUrls: ['./reservation-management.component.scss']
})
export class ReservationManagementComponent {
  ELEMENT_DATA: CATEGORY[] = [];
  totalRows = 0;
  pageSize = 10;
  searchForm!: FormGroup;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 20, 300, 40, 100];
  displayedColumns: string[] = ['sr', 'bookingDate', 'scheduled_at', 'cname', 'cemail', 'cmobile', 'resName', 'discount', 'commission', 'campaign_code', 'coupon_code', 'coupon_amount', 'coupon_discount', 'pax', 'id', 'status', 'action'];
  dataSource: MatTableDataSource<CATEGORY> = new MatTableDataSource();
  selectedLocation: any = {}
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  teamData: any;
  apiUrl: any;
  selectedIds: any
  dialogData: any;
  controls: any = {
    email: {
      controls: 'email',
      placeholder: 'Search by Email',
      label: 'Search by Email'
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
  locationData: any;
  constructor(
    public _appService: AppService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,

  ) {
    this.searchForm = this.fb.group({
      resName: [''],
      status: [''],
      // email: [''],
      start_date: [''],
      end_date: [''],
      location_id: [''],
      is_nukhba_user: ['0'],
      is_pilot: ['0'],
      campaign_code: [''],
      booking_id: [''],
      coupon_code: [''],
      coupon_discount: [''],
      slot_discount: [''],
      user_email_mobile: [''],
      coupon_applied: ['']
    });
  }
  buildQueryParams() {

    const resName = this.searchForm.value.resName || '';
    const status = this.searchForm.value.status || '';
    const paymentStatus = this.searchForm.value.paymentStatus || '';
    const location_id = this.searchForm.value.location_id || '';
    const start_date = this.searchForm.value.start_date || '';
    const end_date = this.searchForm.value.end_date || '';
    const booking_id = this.searchForm.value.booking_id || '';
    const campaign_code = this.searchForm.value.campaign_code || '';
    const is_nukhba_user = this.searchForm.value.is_nukhba_user;
    const is_pilot = this.searchForm.value.is_pilot;
    const coupon_applied = this.searchForm.value.coupon_applied;
    const coupon_code = this.searchForm.value.coupon_code || '';
    const coupon_discount = this.searchForm.value.coupon_discount || '';
    const slot_discount = this.searchForm.value.slot_discount;
    const user_email_mobile = this.searchForm.value.user_email_mobile;
    return {
      resName,
      is_pilot,
      coupon_applied,
      coupon_code,
      coupon_discount,
      user_email_mobile,
      slot_discount,
      status,
      is_nukhba_user,
      paymentStatus,
      location_id,
      start_date,
      end_date,
      booking_id,
      campaign_code,
      page: this.currentPage + 1,
      pageSize: this.pageSize
    };
  }
  onSelectAllCheckboxClick() {
    // Update the state of all checkboxes based on the state of "Select All" checkbox
    this.dataSource.data.map((item: any) => {
      item.checked = this.selectAllValue;
    });
    if (this.selectAllValue) {
      this.selectedIds = this.dataSource.data
        .filter((item: any) => item.status?.text !== 'Cancelled by Admin')
        .map((item: any) => item.id)
        .join(',');
      const dialogRef = this.dialog.open(BookingCancelComponent, {
        hasBackdrop: false,
        // width: '80px',
        // height: '80px',
        data: {
          bookingData: this.selectedIds,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        this.loadData()
        this.selectAllValue = false
      });
    } else {
      this.selectedIds = '';
    }
  }
  checkboxValue: any = false
  selectAllValue: boolean = false;



  // convertTimestampToGST(timestamp: number): string {
  //   // Convert the timestamp to a Moment.js object and format it to GST timezone
  //   return momentv1(timestamp).tz('Asia/Dubai').format('YYYY-MM-DD HH:mm:ss');
  // }

  convertToGST(timestamp: number): string {
    const utcMoment = momentv1.utc(timestamp * 1000); // Convert seconds to milliseconds
    const gstMoment = utcMoment.tz('Asia/Dubai');
    return gstMoment.format('d-MMM-YY hh:mm a');
  }
  onCheckboxClick(bookingData: any) {
    // Make your API call here
    console.log(bookingData)
    if (bookingData.checked) {
      const dialogRef = this.dialog.open(BookingCancelComponent, {
        hasBackdrop: false,
        width: '450px',
        // height: '80px',
        data: {
          bookingData: bookingData.id,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        this.loadData()
      });

    }
  }
  getlocationData() {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/location?is_nukhba_user=0&is_pilot=0&status=${status}&page=${this.currentPage + 1}&page_size=${this.pageSize}&isPaginated=false`).subscribe((res: any) => {
      this.locationData = res.data?.rows
      this._appService.hideSpinner()

    })
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    const params = this.route.snapshot.queryParamMap;

    this.searchForm.patchValue({
      resName: params.get('resName') || '',
      status: params.get('status') || '',
      start_date: params.get('start_date') || '',
      end_date: params.get('end_date') || '',
      location_id: params.get('location_id') || '',
      campaign_code: params.get('campaign_code') || '',
      booking_id: params.get('booking_id') || '',
      coupon_code: params.get('coupon_code') || '',
      is_nukhba_user: params.get('is_nukhba_user') || 0,
      is_pilot: params.get('is_pilot') || 0,
      coupon_discount: params.get('coupon_discount'),
      slot_discount: params.get('slot_discount') || '',
      user_email_mobile: params.get('user_email_mobile') || '',
      coupon_applied: params.get('coupon_applied')
    });

    this.currentPage = params.get('page') ? +params.get('page')! - 1 : 0;
    this.pageSize = +params.get('pageSize')! || 10;
    this.loadData()
    this.getlocationData()
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

  showEditForm(location: any) {
    this.selectedLocation = location
    this.addLocation(location);
  }


  loadData() {
    this._appService.showSpinner()
    let formValue = this.searchForm.value;
    console.log(formValue)
    if (formValue) {
      let is_nukhba_user = formValue.is_nukhba_user ? formValue.is_nukhba_user : 0
      let is_pilot = formValue.is_pilot ? formValue.is_pilot : 0
      let campaign_code = formValue.campaign_code ? formValue.campaign_code : ""
      let booking_id = formValue.booking_id ? formValue.booking_id : ""
      let coupon_code = formValue.coupon_code ? formValue.coupon_code : ""
      let coupon_applied = formValue.coupon_applied ? formValue.coupon_applied : ""
      let slot_discount = formValue.slot_discount ? formValue.slot_discount : ""
      let coupon_discount = formValue.coupon_discount ? formValue.coupon_discount : ""
      let bookingType = formValue.status ? formValue.status : ""
      let query = ''
      // if (is_nukhba_user) {
      //   query += `&is_nukhba_user=${is_nukhba_user}`
      // }
      // if (is_pilot) {
      //   query += `&is_pilot=${formValue.is_pilot}`
      // }
      if (campaign_code) {
        query += `&campaign_code=${formValue.campaign_code}`
      }
      if (booking_id) {
        query += `&booking_id=${formValue.booking_id}`
      }
      if (coupon_code) {
        query += `&coupon_code=${formValue.coupon_code}`
      }
      if (coupon_applied) {
        query += `&coupon_applied=${formValue.coupon_applied}`
      }
      if (coupon_discount) {
        query += `&coupon_discount=${formValue.coupon_discount}`
      }
      if (slot_discount) {
        query += `&reservation_discount=${formValue.slot_discount}`
      }
      let bookingStartDate = (formValue.start_date) != '' && (formValue.start_date) ? moment(formValue.start_date).format('YYYY-MM-DD') : '';
      let bookingEndDate = (formValue.end_date) != '' && (formValue.end_date) ? moment(formValue.end_date).format('YYYY-MM-DD') : '';
      this.searchForm.patchValue(formValue)

      const params = this.buildQueryParams()
      this._appService.updateQueryParams(params)
      this._appService.getApiWithAuth(`/admin/reservation/list?type=reservation&page=${this.currentPage + 1}&page_size=${this.pageSize}&booking_type=${bookingType}&location_id=${formValue.location_id ? formValue.location_id : ""}&from_date=${bookingStartDate}&to_date=${bookingEndDate}&res_name=${formValue.resName ? formValue.resName : ""}&is_paginated=true&keyword=${formValue.user_email_mobile ? formValue.user_email_mobile : ''}&is_nukhba_user=${is_nukhba_user}&is_pilot=${is_pilot}${query}`).subscribe((res: any) => {
        const filteredData = res.data?.rows;

        // Step 2: Extract userIds from the filtered data
        // Step 2: Extract userIds from the filtered data and join them as a comma-separated string
        const userIds = filteredData.filter((row: any) => row.user_status === 0).map((row: any) => row.user_id).join(',');


        if (userIds.length > 0) {
          // Step 3: Call the /admin/deleted-users/list-by-id API to get the usernames
          this._appService.mergeDeletedUsersWithData(userIds,filteredData,this.dataSource,this.paginator,this.currentPage, res.data?.count)

        } else {
          // If no users with status = 0 are found
          this.dataSource.data = res.data?.rows
          this._appService.hideSpinner();
          setTimeout(() => {
            this.paginator.pageIndex = this.currentPage; // Update paginator's pageIndex to reflect currentPage
            this.paginator.length = res.data?.count;
          });
        }
      }, (error) => {
        if (error?.error?.status_code) {
          this.router.navigateByUrl("/");
          localStorage.removeItem('authtoken');
        }
      });

    }
  }

  reservationFilter() {
    const dialogRef = this.dialog.open(ReservationFilterComponent, {
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


  loadDatav2() {
    this._appService.showSpinner()
    let formValue = this.dialogData;
    if (formValue) {
      let is_nukhba_user = formValue.is_nukhba_user
      let is_pilot = formValue.is_pilot
      let campaign_code = formValue.campaign_code ? formValue.campaign_code : ""
      let booking_id = formValue.booking_id ? formValue.booking_id : ""
      let coupon_code = formValue.coupon_code ? formValue.coupon_code : ""
      let coupon_applied = formValue.coupon_applied ? formValue.coupon_applied : ""
      let slot_discount = formValue.slot_discount ? formValue.slot_discount : ""
      let coupon_discount = formValue.coupon_discount ? formValue.coupon_discount : ""
      let bookingType = formValue.status ? formValue.status : ""
      let query = ''
      if (is_nukhba_user) {
        query += `&is_nukhba_user=${is_nukhba_user}`
      }
      if (is_pilot) {
        query += `&is_pilot=${formValue.is_pilot}`
      }
      if (campaign_code) {
        query += `&campaign_code=${formValue.campaign_code}`
      }
      if (booking_id) {
        query += `&booking_id=${formValue.booking_id}`
      }
      if (coupon_code) {
        query += `&coupon_code=${formValue.coupon_code}`
      }
      if (coupon_applied) {
        query += `&coupon_applied=${formValue.coupon_applied}`
      }
      if (coupon_discount) {
        query += `&coupon_discount=${formValue.coupon_discount}`
      }
      if (slot_discount) {
        query += `&reservation_discount=${formValue.slot_discount}`
      }
      let bookingStartDate = (formValue.start_date) != '' && (formValue.start_date) ? moment(formValue.start_date).format('YYYY-MM-DD') : '';
      let bookingEndDate = (formValue.end_date) != '' && (formValue.end_date) ? moment(formValue.end_date).format('YYYY-MM-DD') : '';
      this.searchForm.patchValue(formValue)
      this.searchForm.patchValue({ start_date: bookingStartDate })
      this.searchForm.patchValue({ end_date: bookingEndDate })
      const params = this.buildQueryParams()
      this._appService.updateQueryParams(params)
      this._appService.getApiWithAuth(`/admin/reservation/list?type=reservation&page=${this.currentPage + 1}&page_size=${this.pageSize}&booking_type=${bookingType}&location_id=${formValue.location_id ? formValue.location_id : ""}&from_date=${bookingStartDate}&to_date=${bookingEndDate}&res_name=${formValue.resName ? formValue.resName : ""}&is_paginated=true&keyword=${formValue.user_email_mobile ? formValue.user_email_mobile : ''}${query}`).subscribe((res: any) => {
        const filteredData = res.data?.rows;

        // Step 2: Extract userIds from the filtered data
        // Step 2: Extract userIds from the filtered data and join them as a comma-separated string
        const userIds = filteredData.filter((row: any) => row.user_status === 0).map((row: any) => row.user_id).join(',');


        if (userIds.length > 0) {
          // Step 3: Call the /admin/deleted-users/list-by-id API to get the usernames
          this._appService.mergeDeletedUsersWithData(userIds,filteredData,this.dataSource,this.paginator,this.currentPage, res.data?.count)

        } else {
          // If no users with status = 0 are found
          this.dataSource.data = res.data?.rows
          this._appService.hideSpinner();
          setTimeout(() => {
            this.paginator.pageIndex = this.currentPage; // Update paginator's pageIndex to reflect currentPage
            this.paginator.length = res.data?.count;
          });
        }
      },
        (error) => {
          if (error?.error?.status_code) {
            this.router.navigateByUrl("/");
            localStorage.removeItem('authtoken');
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

  formReset = () => {
    this.currentPage = 0
    this.searchForm.reset()
    this.loadData()
    if (this.dialogData) {
      this.emptyObject()
    }
  }

  emptyObject = () => {
    Object.keys(this.dialogData).forEach(key => {
      this.dialogData[key] = '';
    });
  }

}



export interface CATEGORY {
  sr: string,
  name: string,
  image: string,
  type: string,
  Status: string,
  checked: boolean
}
