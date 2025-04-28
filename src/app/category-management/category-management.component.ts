import { Component } from '@angular/core';
import { AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app.service';
import { AddCategoryComponent } from '../dialog/add-category/add-category.component';
import { HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantManagementComponent } from '../restaurant-management/restaurant-management.component';
import { ImagePreviewDialogComponent } from '../dialog/image-preview-dialog/image-preview-dialog.component';
import { switchMap } from 'rxjs';
import { ImageUploadComponent } from '../image-upload/image-upload.component';
@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss']
})

export class CategoryManagementComponent {
  @HostBinding('style.height') height = '56px';
  ELEMENT_DATA: CATEGORY[] = [];
  totalRows = 0;
  pageSize = 10;
  categoryResp: any;
  searchForm!: FormGroup;
  currentPage = 0;
  imageSrc: any;
  selectedCategory: any = {}
  pageSizeOptions: number[] = [10, 20, 300, 40, 100];
  displayedColumns: string[] = ['sr', 'name', 'image', 'restro', 'status', 'action'];
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
      name: [this.route.snapshot.queryParamMap.get('name') || ''],
      status: [this.route.snapshot.queryParamMap.get('status') || ''],
      type: [this.route.snapshot.queryParamMap.get('type') || ''],
      // startDate: [''],
      // endDate: [''],
    });
  }
  clearData() {
    this.searchTextNotEmpty = false
    this.searchForm.reset()
    this.currentPage = 0
    this.loadData()
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
  onSearch(searchText: string) {
    // Handle search logic here
    this.searchForm.patchValue({ name: searchText })
    this.currentPage = 0
    this.loadData();
  }
  searchData() {
    this.currentPage = 0
    this.loadData();

  }

  onClearSearch() {
    this.searchForm.patchValue({ name: "" })
    this.currentPage = 0
    this.loadData();
    // Handle clear search logic here
  }

  ngAfterViewChecked(): void {
    // new addin_pad();
  }

  checkSearchText(event: KeyboardEvent) {

    this.searchTextNotEmpty = this.searchForm.value?.name?.trim().length > 0;
    if (event.key === "Enter") {
      // If the search text is not empty, then loadData is called
      if (this.searchTextNotEmpty) {
        this.currentPage = 0
        this.loadData();
      }
      // Prevent any further execution
      return;
    }
    // If it's not Enter key, no need to load data, just update the searchTextNotEmpty flag
    this.searchTextNotEmpty = this.searchForm.value?.name?.trim().length > 0;
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
  loadData() {
    this._appService.showSpinner()
    let status = this.searchForm.value.status ? this.searchForm.value.status : ''
    let name = this.searchForm.value.name ? this.searchForm.value.name : ''
    const params = this.buildQueryParams();
    this._appService.updateQueryParams(params);

    this._appService.getApiWithAuth(`/admin/categories?keyword=${name}&type=cuisine&page=${this.currentPage + 1}&page_size=${this.pageSize}&status=${status}&is_paginated=true&sortBy=created_at&order=desc`).subscribe((res: any) => {
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

  previewImage(imageLink: any, id: any) {
    this.imageSrc = imageLink;
    const dialogRef = this.dialog.open(ImagePreviewDialogComponent, {
      hasBackdrop: false,
      data: {
        imageLink: imageLink,
        id: id
      },

      // height: '600px',
      // width: '600px',
    });
    // this.dialog.open();
  }


  showEditForm(category: any) {
    this.selectedCategory = category
    this.addCategory(category, this.categoryResp);
  }

  addCategory(categoryData: any = {}, resp: any) {
    const dialogRef = this.dialog.open(AddCategoryComponent, {
      hasBackdrop: false,
      width: '575px',
      // height: '80px',
      data: {
        categoryData: categoryData,
        // response: resp
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

  imageUpload() {
    const dialogRef = this.dialog.open(ImageUploadComponent, {
      hasBackdrop: false,
      width: '575px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.currentPage = 0
        this.loadData()
      }
    });
  }

  viewRestaurant(categoryData: any = {}) {
    const dialogRef = this.dialog.open(RestaurantManagementComponent, {
      hasBackdrop: false,
      width: '80%',
      height: '80%',
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

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }

  formReset = () => {
    this.searchForm.reset()
    this.loadData()
    this.currentPage = 0
    // window.location.reload()
  }
}



export interface CATEGORY {
  sr: string,
  name: string,
  image: string,
  type: string,
  Status: string,
}