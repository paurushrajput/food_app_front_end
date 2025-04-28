import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { ViewSuggestedPriceComponent } from '../dialog/view-suggested-price/view-suggested-price.component';
import { ViewSuggestedCuisinesComponent } from '../dialog/view-suggested-cuisines/view-suggested-cuisines.component';
import { FavoriteDishesComponent } from '../dialog/favorite-dishes/favorite-dishes.component';
import { UpdateSuggestedPriceComponent } from '../dialog/update-suggested-price/update-suggested-price.component';
import { ConfirmRestaurantComponent } from '../dialog/confirm-restaurant/confirm-restaurant.component';
import { CusinePopupComponent } from '../cusine-popup/cusine-popup.component';

@Component({
  selector: 'app-social-restaurant-management',
  templateUrl: './social-restaurant-management.component.html',
  styleUrls: ['./social-restaurant-management.component.scss']
})
export class SocialRestaurantManagementComponent {



  ELEMENT_DATA: CATEGORY[] = [];
  totalRows = 0;
  pageSize = 10;
  id: any
  searchForm!: FormGroup;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 20, 40, 100, 300];
  displayedColumns: string[] = ['sr', 'restaurant_name', 'phone', 'address', 'price_level', 'restaurant_cuisines', 'rating', 'review_count', 'details'];
  dataSource: MatTableDataSource<CATEGORY> = new MatTableDataSource();
  selectedLocation: any = {}
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  teamData: any;
  apiUrl: any;
  searchTextNotEmpty: any;
  isChecked: boolean = true;
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
  cityList: any;
  verifiedData: any = '';
  cityId: any = '';
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
      resId: [''],
      status: [this.route.snapshot.queryParamMap.get('status') || ''],
      city_id: ['', [Validators.required]]
    });
    this.searchForm.get('status')?.valueChanges.subscribe((status) => {
      const cityControl = this.searchForm.get('city_id');
      if (status === 'places') {
        cityControl?.setValidators([Validators.required]);
      } else {
        cityControl?.clearValidators();
      }
      cityControl?.updateValueAndValidity();
    });
  }

  openCuisinePopup(cuisines: string[]) {
    this.dialog.open(CusinePopupComponent, {
      width: '400px',
      data: { cuisines: cuisines }
    });
  }
  buildQueryParams() {

    const name = this.searchForm.value.name || '';
    const city_id = this.searchForm.value.city_id || ''
    const status = this.searchForm.value.status || '';
    return {
      name,
      city_id,
      status,
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
      city_id: params.get('city_id') || '',
      status: params.get('status') || ''
    });


    this.currentPage = params.get('page') ? +params.get('page')! - 1 : 0;
    this.pageSize = +params.get('pageSize')! || 10;
    this.getcitiesList()
    this.loadData()
  }

  ngAfterViewChecked(): void {
    // new addin_pad();
  }
  searchData() {


    this.currentPage = 0
    this.loadData()
  }
  getcitiesList() {
    this._appService.showSpinner();
    this._appService.getApiWithAuth(`/admin/social/get-cities-list`).subscribe((res: any) => {
      this.cityList = res.data.rows.rows
    });
  }

  loadData() {
    this._appService.showSpinner();
    this._appService.getApiWithAuth(`/admin/social/restaurant-list?page=${this.currentPage + 1}&page_size=${this.pageSize}&city_id=${this.searchForm.value.city_id ? this.searchForm.value.city_id : ''}&keyword=${this.searchForm.value.name ? this.searchForm.value.name : ''}&status=${this.searchForm.value.status ? this.searchForm.value.status : ''}`).subscribe((res: any) => {
      this.dataSource.data = res.data?.rows
      this.verifiedData = res.data?.rows[0];
      this.cityId = this.searchForm.value?.city_id ? this.searchForm.value.city_id : ''
      this._appService.hideSpinner();
      setTimeout(() => {
        this.paginator.pageIndex = this.currentPage; // Update paginator's pageIndex to reflect currentPage
        this.paginator.length = res.data?.count?.total;
      });
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

  viewSuggestedPriceList(postData: any = {}) {
    const dialogRef = this.dialog.open(ViewSuggestedPriceComponent, {
      hasBackdrop: false,
      width: '800px',
      data: {
        postData: postData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadData()
      }
    });
  }

  viewSuggestedCuisineList(postData: any = {}) {
    const dialogRef = this.dialog.open(ViewSuggestedCuisinesComponent, {
      hasBackdrop: false,
      width: '800px',
      data: {
        postData: postData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadData()
      }
    });
  }

  cusinesUpdate(postData: any = {}) {
    const dialogRef = this.dialog.open(FavoriteDishesComponent, {
      hasBackdrop: false,
      width: "575px",
      data: {
        postData: postData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result && result.status != 'close') {
        this.loadData()
      }
    });
  }

  priceUpdate(postData: any = {}) {
    const dialogRef = this.dialog.open(UpdateSuggestedPriceComponent, {
      hasBackdrop: false,
      width: "575px",
      data: {
        postData: postData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      // if (result && result.status != 'close') {
      this.loadData()
      // }
    });
  }
  approveRestaurantCities(postData: any = {}) {
    const dialogRef = this.dialog.open(ConfirmRestaurantComponent, {
      hasBackdrop: false,
      width: "575px",
      data: {
        restaurantData: postData,
        status: "Approved"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result && result.status != 'close') {
        this.loadData()
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

