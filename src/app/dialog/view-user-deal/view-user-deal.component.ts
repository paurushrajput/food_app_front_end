import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { AddDealComponent } from '../add-deal/add-deal.component';
import { AddLocationComponent } from '../add-location/add-location.component';
import { ViewFeedbackDetailsComponent } from '../view-feedback-details/view-feedback-details.component';
import { ViewTxnDetailsComponent } from '../view-txn-details/view-txn-details.component';

@Component({
  selector: 'app-view-user-deal',
  templateUrl: './view-user-deal.component.html',
  styleUrls: ['./view-user-deal.component.scss']
})
export class ViewUserDealComponent {


  ELEMENT_DATA: CATEGORY[] = [];
  totalRows = 0;
  pageSize = 10;
  id: any
  searchForm!: FormGroup;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 20, 40, 100, 300];
  // displayedColumns: string[] = ['sr', 'username', 'deal', 'option', 'quantity', 'total_price','purchaseDate','expiryDate', 'status'];
  displayedColumns: string[] = ['sr', 'purchaseDate', 'dealId', 'restro', 'username', 'deal', 'type', 'is_pilot', 'quantity', 'total_price', 'redeemed_date', 'expiryDate','selected','statusCode','status1','action1'];
  dataSource: MatTableDataSource<CATEGORY> = new MatTableDataSource();
  selectedLocation: any = {}
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  teamData: any;
  apiUrl: any;
  searchTextNotEmpty: any;
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
      name: [''],
      status: ['']
    });
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    console.log(this.data.dealData)
    this.loadData()
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
        // this.dialogData = result.data;
        this.loadData()
      }
    });
  }

  searchData() {
    this.currentPage = 0
    this.loadData()
  }
  loadData() {
    let query = ''
    let name = this.searchForm.value.name;
    let status = this.searchForm.value.status
    if (name) {
      query += `&username=${name}`
    }
    if (status) {
      query += `&order_status_code=${status}`
    }
    this._appService.showSpinner();
    this._appService.getApiWithAuth(`/admin/deal/user-deal-list?page=${this.currentPage + 1}&page_size=${this.pageSize}&deal_id=${this.data.dealData.id}&is_paginated=true${query}`).subscribe((res: any) => {
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
