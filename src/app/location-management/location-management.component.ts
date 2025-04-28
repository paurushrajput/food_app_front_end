import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app.service';
import { AddLocationComponent } from '../dialog/add-location/add-location.component';
import { RestaurantManagementComponent } from '../restaurant-management/restaurant-management.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ImagePreviewDialogComponent } from '../dialog/image-preview-dialog/image-preview-dialog.component';

@Component({
  selector: 'app-location-management',
  templateUrl: './location-management.component.html',
  styleUrls: ['./location-management.component.scss']
})
export class LocationManagementComponent {
  ELEMENT_DATA: CATEGORY[] = [];
  totalRows = 0;
  pageSize = 10;
  imageSrc: any;
  searchForm!: FormGroup;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 20, 300, 40, 100];
  displayedColumns: string[] = ['sr', 'name', 'image', 'restro', 'restaurant', 'status', 'action'];
  dataSource: MatTableDataSource<CATEGORY> = new MatTableDataSource();
  selectedLocation: any = {}
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  teamData: any;
  apiUrl: any;
  searchTextNotEmpty: any;
  controls: any = {
    name: {
      controls: 'name',
      placeholder: 'Enter Name',
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
  constructor(
    public _appService: AppService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
  ) {
    this.searchForm = this.fb.group({
      name: [this.route.snapshot.queryParamMap.get('name') || ''],
      status: [this.route.snapshot.queryParamMap.get('status') || ''],

      // startDate: [''],
      // endDate: [''],
    });
  }

  buildQueryParams() {

    const name = this.searchForm.value.name || '';
    const status = this.searchForm.value.status || '';
    return {
      name,
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
      status: params.get('status') || '',
      type: params.get('type') || ''
    });

    this.currentPage = params.get('page') ? +params.get('page')! - 1 : 0;
    this.pageSize = +params.get('pageSize')! || 10;
    this.loadData()

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

  onSearch(searchText: string) {
    // Handle search logic here
    this.searchForm.patchValue({ name: searchText })

    this.loadData();
  }
  searchData() {
    this.currentPage = 0
    this.loadData();

  }
  onClearSearch() {
    this.searchForm.patchValue({ name: "" })
    this.loadData();
    // Handle clear search logic here
  }

  addLocation(locationData: any = {}) {
    const dialogRef = this.dialog.open(AddLocationComponent, {
      hasBackdrop: false,
      width: '575px',
      // height: '100',
      data: {
        locationData: locationData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.currentPage = 0
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

    let status = this.searchForm.value.status ? this.searchForm.value.status : '';
    const params = this.buildQueryParams();
    this._appService.updateQueryParams(params);
    this._appService.getApiWithAuth(`/admin/location?status=${status}&page=${this.currentPage + 1}&page_size=${this.pageSize}&isPaginated=true&sortBy=created_at&order=desc&keyword=${this.searchForm.value.name ? this.searchForm.value.name : ''}`).subscribe((res: any) => {
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

  previewImage(imageLink: any, id: any) {

    this.imageSrc = imageLink;
    const dialogRef = this.dialog.open(ImagePreviewDialogComponent, {
      data: {
        imageLink: imageLink,
        id: id
      },
      // height: '600px',
      // width: '600px',
    });
    // this.dialog.open();
  }

  pageChanged(event: PageEvent) {

    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }

  viewRestaurant(locationData: any = {}) {
    const dialogRef = this.dialog.open(RestaurantManagementComponent, {
      hasBackdrop: false,
      width: '80%',
      height: '80%',
      data: {
        locationData: locationData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadData()
      }
    });
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