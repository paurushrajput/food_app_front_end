import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { AddLocationComponent } from '../dialog/add-location/add-location.component';
import { ViewFeedbackDetailsComponent } from '../dialog/view-feedback-details/view-feedback-details.component';
import { AddDealComponent } from '../dialog/add-deal/add-deal.component';
import { ViewUserDealComponent } from '../dialog/view-user-deal/view-user-deal.component';
import { DealFiltersComponent } from '../dialog/deal-filters/deal-filters.component';
import * as moment from 'moment/moment';
import { DeleteDealComponent } from '../delete-deal/delete-deal.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DealOptionUpdateComponent } from '../dialog/deal-option-update/deal-option-update.component';
import { PreSelectRestroComponent } from '../dialog/pre-select-restro/pre-select-restro.component';
import { DealEnableDisableComponent } from '../dialog/deal-enable-disable/deal-enable-disable.component';
import { DealEnableCreditsComponent } from '../dialog/deal-enable-credits/deal-enable-credits.component';


@Component({
  selector: 'app-deal-mngmt',
  templateUrl: './deal-mngmt.component.html',
  styleUrls: ['./deal-mngmt.component.scss']
})
export class DealMngmtComponent {
  isChecked: boolean = true;
  dialogData: any;
  ELEMENT_DATA: CATEGORY[] = [];
  totalRows = 0;
  pageSize = 10;
  id: any
  searchForm!: FormGroup;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 20, 40, 100, 300];
  displayedColumns: string[] = ['sr', 'title', 'desc', 'startTime', 'endTime', 'resName', 'isPilot', 'type', 'userDeal', 'action','actionV1'];
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
      title: [''],
      from_date: [''],
      to_date: [''],
      days_validity: ['']
    });
  }

  buildQueryParams() {

    const title = this.searchForm.value.title || '';
    const days_validity = this.searchForm.value.days_validity || '';
    const from_date = this.searchForm.value.from_date || '';
    const to_date = this.searchForm.value.to_date || '';
    return {
      title,
      days_validity,
      from_date,
      to_date,
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
      title: params.get('title') || '',
      days_validity: params.get('days_validity') || '',
      from_date: params.get('from_date') || '',
      to_date: params.get('to_date') || '',
    });

    this.currentPage = params.get('page') ? +params.get('page')! - 1 : 0;
    this.pageSize = +params.get('pageSize')! || 10;
    this.loadData()
  }

  ngAfterViewChecked(): void {
    // new addin_pad();
  }

  onToggleChange(event: any, element: any) {
    this.isChecked = element.status == 1 ? true : false
    if (event.checked) {
      this.updateDeal(1, element.id)
    } else {
      this.updateDeal(0, element.id)
    }
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


  dealFilter() {
    const dialogRef = this.dialog.open(DealFiltersComponent, {
      hasBackdrop: false,
      width: "450px",
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

  dealOptions(data:any) {
    const dialogRef = this.dialog.open(DealOptionUpdateComponent, {
      hasBackdrop: false,
      width: "450px",
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      // if (result.data) {
        this.currentPage = 0
        this.dialogData = result.data;
        this.loadDatav2()
      // }
    });
  }


  preRestroSelect(data:any) {
    const dialogRef = this.dialog.open(PreSelectRestroComponent, {
      hasBackdrop: false,
      width: "450px",
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      // if (result.data) {
        this.currentPage = 0
        this.dialogData = result.data;
        this.loadDatav2()
      // }
    });
  }

  dealCredits(data:any) {
    const dialogRef = this.dialog.open(DealEnableCreditsComponent, {
      hasBackdrop: false,
      width: "450px",
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      // if (result.data) {
        this.currentPage = 0
        this.dialogData = result.data;
        this.loadDatav2()
      // }
    });
  }

  enable_disable_deal(data:any) {
    const dialogRef = this.dialog.open(DealEnableDisableComponent, {
      hasBackdrop: false,
      width: "450px",
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      // if (result.data) {
        this.currentPage = 0
        this.dialogData = result.data;
        this.loadDatav2()
      // }
    });
  }

  dateCutv2(str: any) {
    if (str) {
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
  
  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.dataSource.data, event.previousIndex, event.currentIndex);
    this.dataSource.data.forEach((item, index) => {
      item.sequence = index + 1
    });
    this.updateBackendWithNewOrder(this.dataSource.data)
  }

  private updateBackendWithNewOrder(data: any): void {
    const filteredData = data.map(function (item: { id: any; sequence: any; }) {
      return {
        id: item.id,
        sequence: item.sequence
      };
    });
    this._appService.putApiWithAuth("/admin/deal/update-sequence", { "deals": data }, 1)
      .subscribe(
        response => {
          this._appService.success('Deal sequence updated successfully')
          this.loadData()
        },
        error => {
          // Handle error appropriately, e.g., show a notification to the user
        }
      );
  }

  addDeal(dealData: any = {}) {
    const dialogRef = this.dialog.open(AddDealComponent, {
      hasBackdrop: false,
      width: "1200px",
      // height: '80px',
      data: {
        dealData: dealData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
       console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
      this.loadData()
      }
    });
  }

  viewDeal(dealData: any = {}) {
    const dialogRef = this.dialog.open(ViewUserDealComponent, {
      hasBackdrop: false,
      // width: '80px',
      // height: '80px',
      data: {
        dealData: dealData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadData()
      }
    });
  }

  showEditForm(deal: any) {
    this.addDeal(deal);
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

  updateDeal(status: any, deal_id: any) {
    let payload = {
      deal_id: deal_id,
      status: status
    }
    let msg = ''
    if (status == 1) {
      msg = 'Deal Enable Successfully'
    } else {
      msg = 'Deal Disable Successfully'
    }
    this._appService.putApiWithAuth(`/admin/deal/update`, payload, 1).subscribe({
      next: (success: any) => {
        this._appService.updateLoading(false);
        if (success.status_code === 200) {
          this.loadData()
          this._appService.success(msg);
        } else {
          this._appService.err(success.msg);
        }
      },
      error: (error: any) => {
        this._appService.updateLoading(false);
        this._appService.err(error?.error?.msg);
      }
    });
  }
  loadData() {
    this._appService.showSpinner();
    let formValue = this.searchForm.value;
    if (formValue) {
      let title = formValue?.title ? formValue?.title : ''
      let from_date = (formValue?.from_date) != '' && (formValue?.from_date) ? moment(formValue?.from_date).format('YYYY-MM-DD') : '';
      let to_date = (formValue?.to_date) != '' && (formValue?.to_date) ? moment(formValue?.to_date).format('YYYY-MM-DD') : '';
      let validity = formValue?.days_validity ? Number(formValue?.days_validity) : ''
      this._appService.showSpinner();
      const params = this.buildQueryParams()
      this._appService.updateQueryParams(params)
      this._appService.getApiWithAuth(`/admin/deal/list?title=${title}&from_date=${from_date}&to_date=${to_date}&days_validity=${validity}&page=${this.currentPage + 1}&page_size=${this.pageSize}&is_paginated=true`).subscribe((res: any) => {
      this.dataSource.data = res.data?.rows;
      this._appService.hideSpinner();
      setTimeout(() => {
        this.paginator.pageIndex = this.currentPage; // Update paginator's pageIndex to reflect currentPage
        this.paginator.length = res.data?.count;
      });
    }, (error) => {
      if (error?.error?.success == false) {
        this._appService.hideSpinner();
        this._appService.err(error?.error?.msg)
      }
      if (error?.error?.status_code == 401) {
        this._appService.hideSpinner();
        localStorage.removeItem('authtoken')
        this.router.navigateByUrl("/");
      }
    })
  }
  }


  loadDatav2() {
    let formValue = this.dialogData;
    if (formValue) {
      let title = formValue?.title ? formValue?.title : ''
      let from_date = (formValue?.from_date) != '' && (formValue?.from_date) ? moment(formValue?.from_date).format('YYYY-MM-DD') : '';
      let to_date = (formValue?.to_date) != '' && (formValue?.to_date) ? moment(formValue?.to_date).format('YYYY-MM-DD') : '';
      let validity = formValue?.days_validity ? Number(formValue?.days_validity) : ''
      this._appService.showSpinner();
      this.searchForm.patchValue(formValue)
      this.searchForm.patchValue({from_date:from_date})
      this.searchForm.patchValue({to_date:to_date})
      const params = this.buildQueryParams()
      this._appService.updateQueryParams(params)
      this._appService.getApiWithAuth(`/admin/deal/list?title=${title}&from_date=${from_date}&to_date=${to_date}&days_validity=${validity}&page=${this.currentPage + 1}&page_size=${this.pageSize}&is_paginated=true`).subscribe((res: any) => {
        this.dataSource.data = res.data?.rows;
        this._appService.hideSpinner();
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage; // Update paginator's pageIndex to reflect currentPage
          this.paginator.length = res.data?.count;
        });
      }, (error) => {
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

  formReset = () => {
    this.currentPage = 0
    this.id = ''
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

  deleteDeal(element: any) {
    const dialogRef = this.dialog.open(DeleteDealComponent, {
      hasBackdrop: false,
      // width: '80px',
      // height: '80px',
      data: {
        dealData: element,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadDatav2()
    });
  }

}



export interface CATEGORY {
  sequence: number;
  sr: string,
  name: string,
  image: string,
  type: string,
  Status: string,
}
