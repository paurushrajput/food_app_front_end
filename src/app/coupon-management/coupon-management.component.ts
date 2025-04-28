import { Component } from '@angular/core';
import { AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app.service';

import { HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteCouponComponent } from '../dialog/delete-coupon/delete-coupon.component';
import { AddCouponComponent } from '../add-coupon/add-coupon.component';
import { CampaignandnotificationManagementComponent } from '../campaignandnotification-management/campaignandnotification-management.component';
@Component({
  selector: 'app-coupon-management',
  templateUrl: './coupon-management.component.html',
  styleUrls: ['./coupon-management.component.scss']
})
export class CouponManagementComponent {
  @HostBinding('style.height') height = '56px';
  ELEMENT_DATA: CATEGORY[] = [];
  totalRows = 0;
  pageSize = 10;
  searchForm!: FormGroup;
  currentPage = 0;
  imageSrc: any;
  selectedCategory: any = {}
  pageSizeOptions: number[] = [10, 20, 300, 40, 100];
  displayedColumns: string[] = ['sr', 'expiration_at', 'couponCode', 'max_use', 'min_use', 'max_discount', 'organization_id', 'uses_per_user', 'type', 'description', 'discount', 'discountType', 'used', 'unused', 'status', 'action'];
  dataSource: MatTableDataSource<CATEGORY> = new MatTableDataSource();
  selectedContest: any = {}
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  teamData: any;
  apiUrl: any;
  controls: any = {
    name: {
      controls: 'name',
      placeholder: 'Enter name',
      label: 'Search By Name'
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
  constructor(
    public _appService: AppService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
  ) {
    this.searchForm = this.fb.group({
      discount_type: [this.route.snapshot.queryParamMap.get('discount_type') || ''],
      status: [this.route.snapshot.queryParamMap.get('status') || ''],
      type: [this.route.snapshot.queryParamMap.get('type') || ''],
      campaign_title:[this.route.snapshot.queryParamMap.get('campaign_title') || '']
      // startDate: [''],
      // endDate: [''],
    });
  }
  clearData() {
    this.searchTextNotEmpty = false
    this.searchForm.reset()
    this.loadData()
  }

  buildQueryParams() {

    const discount_type = this.searchForm.value.discount_type || '';
    const type = this.searchForm.value.type || '';
    const campaign_title = this.searchForm.value.campaign_title || '';
    const status = this.searchForm.value.status || '';
    return {
      status,
      campaign_title,
      type,
      discount_type,
      page: this.currentPage + 1,
      pageSize: this.pageSize
    };
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  searchData(){
    this.currentPage=0
    this.loadData()
  }
  ngOnInit() {
    const params = this.route.snapshot.queryParamMap;
    this.searchForm.patchValue({
      status: params.get('status') || '',


    });

    this.currentPage = params.get('page') ? +params.get('page')! - 1 : 0;
    this.pageSize = +params.get('pageSize')! || 10;
    this.loadData()
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

  ngAfterViewChecked(): void {
    // new addin_pad();
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

  loadData() {
    this._appService.showSpinner()
    let searchQuery = `?page=${this.currentPage + 1}&page_size=${this.pageSize}&is_paginated=true`
    let status = this.searchForm.value.status ? this.searchForm.value.status : ''
    let discount_type = this.searchForm.value.discount_type ? this.searchForm.value.discount_type : ''
    let type = this.searchForm.value.type ? this.searchForm.value.type : ''
    let campagin_title=this.searchForm.value.campaign_title?this.searchForm.value.campaign_title:""
    const params = this.buildQueryParams();
    this._appService.updateQueryParams(params);
    if (status && status !=3) {
      searchQuery += `&status=${status}&is_deleted=0`
    }
    if (status && status ==3) {
      searchQuery += `&is_deleted=1`
    }
    if (discount_type) {
      searchQuery += `&discount_type=${discount_type}`
    }
    if (type) {
      searchQuery += `&type=${type}`
    }
    if(campagin_title){
       searchQuery += `&campaign_title=${campagin_title}`
    }
    this._appService.getApiWithAuth(`/admin/coupons/list${searchQuery}`).subscribe((res: any) => {
      this.dataSource.data = res.data?.rows
      this._appService.hideSpinner()
      setTimeout(() => {
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length = res.data?.count;
      });
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



  showEditForm(couponData: any) {
    this.addCoupon(couponData);
  }

  addCoupon(couponData: any = '') {
    const dialogRef = this.dialog.open(AddCouponComponent, {
      hasBackdrop: false,
      width: '575px',
      // height: '80px',
      data: {
        couponData: couponData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
       console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadData()
      }
    });
  }

  viewuser(couponData: any = '') {
    const dialogRef = this.dialog.open(CampaignandnotificationManagementComponent, {
      hasBackdrop: false,
      width: '80%',
      height: '80%',
      data: {
        couponData: couponData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
       console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadData()
      }
    });
  }

  deleteCoupon(couponData: any = '') {
    const dialogRef = this.dialog.open(DeleteCouponComponent, {
      hasBackdrop: false,
      // width: '575px',
      // height: '80px',
      data: {
        couponData: couponData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
       console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadData()
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