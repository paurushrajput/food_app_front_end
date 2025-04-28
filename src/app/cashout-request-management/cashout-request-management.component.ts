import { Component, ElementRef, Inject, Optional, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app.service';
import { UpdateCashoutRequestComponent } from '../dialog/update-cashout-request/update-cashout-request.component';
import { MatDateRangePicker } from '@angular/material/datepicker';
import * as moment from 'moment';

@Component({
  selector: 'app-cashout-request-management',
  templateUrl: './cashout-request-management.component.html',
  styleUrls: ['./cashout-request-management.component.scss']
})
export class CashoutRequestManagementComponent {

  restaurant_pax_details: any
  admin_users: any = []
  ELEMENT_DATA: CATEGORY[] = [];
  totalRows = 0;
  pageSize = 10;
  id: any
  searchForm!: FormGroup;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 20, 300, 40, 100];
  displayedColumns: string[] = ['sr', 'created_at','uName','uEmail', 'usable_amount', 'points', 'amount', 'is_expired', 'status', 'actionv2'];
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
      from_date: [''],
      to_date: [''],
    });
  }



  checkSearchText(event: KeyboardEvent) {
    // console.log(this.searchForm.value)
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
  @ViewChild('picker') picker: MatDateRangePicker<any> | undefined;
  @ViewChild('startInput') startInput: ElementRef | undefined;
  @ViewChild('endInput') endInput: ElementRef | undefined;

  ngAfterViewInit() {
    this.startInput?.nativeElement.addEventListener('click', () => this.picker?.open());
    this.endInput?.nativeElement.addEventListener('click', () => this.picker?.open());
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
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

  updateRequest(cashoutData: any = {}) {
    const dialogRef = this.dialog.open(UpdateCashoutRequestComponent, {
      hasBackdrop: false,
      width: '575px',
      data: cashoutData
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadData()
      }
    });
  }

  loadData() {
    let formValue = this.searchForm.value
    let bookingStartDate = (formValue.from_date) != '' && (formValue.from_date) ? moment(formValue.from_date).format('YYYY-MM-DD') : '';
    let bookingEndDate = (formValue.to_date) != '' && (formValue.to_date) ? moment(formValue.to_date).format('YYYY-MM-DD') : '';
    // const params = this.buildQueryParams();
    // this._appService.updateQueryParams(params);
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/points/list-cashout-request?from_date=${bookingStartDate}&to_date${bookingEndDate}&page=${this.currentPage + 1}&page_size=${this.pageSize}`).subscribe((res: any) => {
      this.dataSource.data = res.data?.rows
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
}



export interface CATEGORY {
  sr: string,
  name: string,
  image: string,
  type: string,
  Status: string,
}