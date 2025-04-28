import { Component, HostBinding, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { AddCategoryComponent } from '../dialog/add-category/add-category.component';
import { ImagePreviewDialogComponent } from '../dialog/image-preview-dialog/image-preview-dialog.component';
import { RestaurantManagementComponent } from '../restaurant-management/restaurant-management.component';
import { AddDealCategoryComponent } from '../dialog/add-deal-category/add-deal-category.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { sequence } from '@angular/animations';


@Component({
  selector: 'app-deal-category-management',
  templateUrl: './deal-category-management.component.html',
  styleUrls: ['./deal-category-management.component.scss']
})
export class DealCategoryManagementComponent {
  filteredData: { id: string, sequence: number }[] = [];
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
      name: [''],
      status: [''],
      type: [''],

      // startDate: [''],
      // endDate: [''],
    });
  }
  clearData() {
    this.searchTextNotEmpty = false
    this.searchForm.reset()
    this.loadData()
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.loadData()
  }

  onSearch(searchText: string = '') {
    // Handle search logic here
    // this.searchForm.patchValue({ name: searchText })
    this.currentPage = 0
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

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.dataSource.data, event.previousIndex, event.currentIndex);
    this.dataSource.data.forEach((item: any, index) => {
      item.sequence = index + 1
      // item.sequence = index + 1; // Assuming sequence starts from 1
      // delete item.image;
    });
    this.updateBackendWithNewOrder(this.dataSource.data)
  }

  private updateBackendWithNewOrder(data: any): void {
    data.forEach((item:any) => {
      this.filteredData.push({ id: item.uid, sequence: item.sequence });
    });
    this._appService.putApiWithAuth("/admin/categories/update-sequence", { "categories": this.filteredData }, 1)
      .subscribe(
        response => {
          this._appService.success('Deal Categories updated successfully')
          this.loadData()
        },
        error => {
          // Handle error appropriately, e.g., show a notification to the user
        }
      );
  }

  loadData() {
    this._appService.showSpinner()
    let status = this.searchForm.value.status ? this.searchForm.value.status : ''
    let name = this.searchForm.value.name ? this.searchForm.value.name : ''
    // if (type || name) {
    //   this.currentPage = 0
    // }
    this._appService.getApiWithAuth(`/admin/categories?keyword=${name}&page=${this.currentPage + 1}&page_size=${this.pageSize}&status=${status}&is_paginated=true&type=deal&sortBy=created_at&order=desc`).subscribe((res: any) => {
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

  previewImage(imageLink: any) {

    this.imageSrc = imageLink;
    const dialogRef = this.dialog.open(ImagePreviewDialogComponent, {
      hasBackdrop: false,
      data: { imageLink },
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
    const dialogRef = this.dialog.open(AddDealCategoryComponent, {
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