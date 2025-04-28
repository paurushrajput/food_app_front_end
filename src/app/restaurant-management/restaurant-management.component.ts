import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app.service';
import { FeedbackManagementComponent } from '../feedback-management/feedback-management.component';
import { ConfirmRequestComponent } from '../confirm-request/confirm-request.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmAutoBookingComponent } from '../dialog/confirm-auto-booking/confirm-auto-booking.component';
import { ViewFeedbackDetailsComponent } from '../dialog/view-feedback-details/view-feedback-details.component';
import { SlotListComponent } from '../dialog/slot-list/slot-list.component';
import { ConfirmDeactivateMessageComponent } from '../dialog/confirm-deactivate-message/confirm-deactivate-message.component';
import { CusinePopupComponent } from '../cusine-popup/cusine-popup.component';
import { ViewBookingComponent } from '../view-booking/view-booking.component';
import { ConfirmRestaurantPilotModeComponent } from '../dialog/confirm-restaurant-pilot-mode/confirm-restaurant-pilot-mode.component';
import { RejectReservationComponent } from '../reject-reservation/reject-reservation.component';
import { ViewDatesComponent } from '../dialog/view-dates/view-dates.component';
import { ViewRestaurantDetailsComponent } from '../dialog/view-restaurant-details/view-restaurant-details.component';
import { ViewPaxDetailsComponent } from '../dialog/view-pax-details/view-pax-details.component';
import { AddInstantPaymentComponent } from '../dialog/add-instant-payment/add-instant-payment.component';

@Component({
  selector: 'app-restaurant-management',
  templateUrl: './restaurant-management.component.html',
  styleUrls: ['./restaurant-management.component.scss']
})
export class RestaurantManagementComponent {
  restaurant_pax_details: any
  admin_users: any = []
  ELEMENT_DATA: CATEGORY[] = [];
  totalRows = 0;
  pageSize = 10;
  id: any
  searchForm!: FormGroup;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 20, 300, 40, 100];
  displayedColumns: string[] = ['sr', 'name', 'location', 'pax', 'payment', 'category', 'actionv2', 'status', 'option'];
  dataSource: MatTableDataSource<CATEGORY> = new MatTableDataSource();
  selectedLocation: any = {}
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  teamData: any;
  searchTextNotEmpty: any;
  apiUrl: any;
  controls: any = {
    name: {
      controls: 'name',
      placeholder: 'Search By Name/Email/Location',
      label: 'Search By Name/Email/Location'
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
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public _appService: AppService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute
  ) {
    this.searchForm = this.fb.group({
      name: [this.route.snapshot.queryParamMap.get('name') || ''],
      is_pilot: [this.route.snapshot.queryParamMap.get('is_pilot') || '0'],
      res_status: [this.route.snapshot.queryParamMap.get('res_status') || '']
      // startDate: [''],
      // endDate: [''],
    });
  }
  openCuisinePopup(cuisines: string[]) {
    this.dialog.open(CusinePopupComponent, {
      width: '400px',
      data: { cuisines: cuisines }
    });
  }
  viewBoking(bookingData: any) {
    const dialogRef = this.dialog.open(ViewBookingComponent, {
      hasBackdrop: false,
      width: '700px',
      data: {
        bookingData: bookingData
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  changePilotStatus(resData: any = {}, status: any) {
    console.log(resData);
    const dialogRef = this.dialog.open(ConfirmRestaurantPilotModeComponent, {
      hasBackdrop: false,
      width: '50',
      // height: '100',
      data: {
        resData: resData,
        status: status,
        admin_users: this.admin_users
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadData()
      }
    });
  }



  viewDates(date: any, subject: any) {
    const dialogRef = this.dialog.open(ViewDatesComponent, {
      hasBackdrop: false,
      width: '400px',
      // height: '100',
      data: { date: date, name: subject }
    });
    dialogRef.afterClosed().subscribe(result => {
      //  console.log(`Dialog result: ${result.status}`);
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    const params = this.route.snapshot.queryParamMap;
    this.searchForm.patchValue({
      name: params.get('name') || '',
      res_status: params.get('res_status') || '',
      is_pilot: params.get('is_pilot') || '0'
    });

    this.currentPage = params.get('page') ? +params.get('page')! - 1 : 0;
    this.pageSize = +params.get('pageSize')! || 10;
    this.loadData()
  }

  ngAfterViewChecked(): void {
    // new addin_pad();
  }

  isTruncated: boolean[] = [];
  toggleTruncation(index: number) {
    // Toggle the clicked state for the clicked row
    this.isTruncated[index] = !this.isTruncated[index];
  }
  searchData() {
    this.currentPage = 0
    this.loadData();

  }
  buildQueryParams() {

    const name = this.searchForm.value.name || '';
    const res_status = this.searchForm.value.res_status || '';
    const is_pilot = this.searchForm.value.is_pilot || '';
    return {
      name,
      res_status,
      is_pilot,
      page: this.currentPage + 1,
      pageSize: this.pageSize
    };
  }
  loadData() {
    let restaurantId = ''
    let categoryId = ''
    let locationId = ''
    let merchantId = ''
    if (this.data?.merchantData) {
      restaurantId = this.data?.merchantData.id ? this.data?.merchantData.id : ''
    }
    if (this.data?.categoryData) {
      categoryId = this.data?.categoryData.uid ? this.data?.categoryData.uid : ''
    }
    if (this.data?.locationData) {
      locationId = this.data?.locationData.uid ? this.data?.locationData.uid : ''
    }
    if (this.data?.merchantData) {
      merchantId = this.data?.merchantData.id ? this.data?.merchantData.id : ''
    }
    let name = this.searchForm.value.name ? this.searchForm.value.name : ''
    const params = this.buildQueryParams();
    this._appService.updateQueryParams(params);
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/merchants/restaurants?is_pilot=${this.searchForm.value.is_pilot ? this.searchForm.value.is_pilot : ''}&res_status=${this.searchForm.value.res_status}&page=${this.currentPage + 1}&page_size=${this.pageSize}&cat_id=${categoryId}&loc_id=${locationId}&mer_id=${merchantId}&keyword=${name}`).subscribe((res: any) => {
      this.dataSource.data = res.data?.rows
      this.restaurant_pax_details = res.data.restaurant_pax_details
      this.admin_users = res.data.admin_users
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

  reviewDetails(feedbackData: any = {}) {
    const dialogRef = this.dialog.open(ViewFeedbackDetailsComponent, {
      hasBackdrop: false,
      width: '700px',
      data: {
        feedbackData: feedbackData
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  slotList(restaurantData: any = {}) {
    const dialogRef = this.dialog.open(SlotListComponent, {
      hasBackdrop: false,
      width: '1200px',
      // height: '90%',
      data: {
        restaurantData: restaurantData
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  viewFeedback(restaurantData: any = {}) {
    // this.router.navigate([`/feedback/list/${restaurantData.id}`]);
    const dialogRef = this.dialog.open(FeedbackManagementComponent, {
      hasBackdrop: false,
      // width: '100',
      // height: '90%',
      data: {
        restaurantData: restaurantData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadData()
      }
    });
  }

  approveRequest(restaurantData: any = {}, prefix = '') {
    const dialogRef = this.dialog.open(ConfirmRequestComponent, {
      hasBackdrop: false,
      width: '575px',
      data: {
        restaurantData: restaurantData,
        restaurant_pax_details: this.restaurant_pax_details,
        admin_users: this.admin_users,
        prefix: prefix
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadData()
      }
    });
  }
  rejectRequest(restaurantData: any = {}) {
    const dialogRef = this.dialog.open(RejectReservationComponent, {
      hasBackdrop: false,
      width: '570px',
      data: {
        restaurantData: restaurantData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadData()
      }
    });
  }

  addInstantPayment(restaurantData: any = {}) {
    const dialogRef = this.dialog.open(AddInstantPaymentComponent, {
      hasBackdrop: false,
      width: '570px',
      data: {
        restaurantData: restaurantData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadData()
      }
    });
  }
  autoBooking(restaurantData: any = {}) {
    const dialogRef = this.dialog.open(ConfirmAutoBookingComponent, {
      hasBackdrop: false,
      width: '570px',
      data: {
        restaurantData: restaurantData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadData()
      }
    });
  }

  confirmDeactivate(restaurantData: any = {}) {
    const dialogRef = this.dialog.open(ConfirmDeactivateMessageComponent, {
      hasBackdrop: false,
      width: '570px',
      data: {
        restaurantData: restaurantData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadData()
      }
    });
  }


  viewRestroDetails(restaurantData: any = {}) {
    const dialogRef = this.dialog.open(ViewRestaurantDetailsComponent, {
      hasBackdrop: false,
      width: '570px',
      data: {
        restaurantData: restaurantData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadData()
      }
    });
  }


  viewDialog(resData: any = {}) {
    const dialogRef = this.dialog.open(ViewPaxDetailsComponent, {
      hasBackdrop: false,
      width: '400px',
      data: {
        resData: resData
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
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