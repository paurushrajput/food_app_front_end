import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app.service';
import { AddBannerComponent } from '../dialog/add-banner/add-banner.component';
import { AddMediaComponent } from '../dialog/add-media/add-media.component';
import { DeleteRequestComponent } from '../dialog/delete-request/delete-request.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ImagePreviewDialogComponent } from '../dialog/image-preview-dialog/image-preview-dialog.component';

@Component({
  selector: 'app-banner-management',
  templateUrl: './banner-management.component.html',
  styleUrls: ['./banner-management.component.scss']
})
export class BannerManagementComponent {
  imageSrc: any
  ELEMENT_DATA: CATEGORY[] = [];
  totalRows = 0;
  pageSize = 10;
  searchForm!: FormGroup;
  currentPage = 0;
  selectedCategory: any = {}
  pageSizeOptions: number[] = [10, 20, 300, 40, 100];
  displayedColumns: string[] = ['sr', 'image', 'actionName', 'start_time', 'end_time', 'screen_type', 'status','action' ];
  dataSource: MatTableDataSource<CATEGORY> = new MatTableDataSource();
  selectedContest: any = {}
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  teamData: any;
  apiUrl: any;
  controls: any = {
    name: {
      controls: 'name',
      placeholder: 'Search Name',
      label: 'Enter Name'
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
      type: [this.route.snapshot.queryParamMap.get('type') || ''],
      size: [this.route.snapshot.queryParamMap.get('size') || ''],
      // startDate: [''],
      // endDate: [''],
    });
  }
  buildQueryParams() {

    const type = this.searchForm.value.type || '';
    const size = this.searchForm.value.size || '';
    return {
      type,
      size,
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
      type: params.get('type') || '',
      size: params.get('size') || '',

    });

    this.currentPage = params.get('page') ? +params.get('page')! - 1 : 0;
    this.pageSize = +params.get('pageSize')! || 10;
    this.loadData()
  }

  ngAfterViewChecked(): void {
    // new addin_pad();
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

  loadData() {
    this._appService.showSpinner()
    let type = this.searchForm.value.type ? this.searchForm.value.type : ''
    let size = this.searchForm.value.size ? this.searchForm.value.size : ''
    const params = this.buildQueryParams();
    this._appService.updateQueryParams(params);
    this._appService.getApiWithAuth(`/admin/banner/list?type=${type}&size=${size}&page=${this.currentPage + 1}&page_size=${this.pageSize}&is_paginated=true`).subscribe((res: any) => {
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

  showEditForm(category: any) {
    this.selectedCategory = category
    this.addCategory(category);
  }

  addCategory(bannerData: any = {}) {
    const dialogRef = this.dialog.open(AddBannerComponent, {
      hasBackdrop: false,
      width: '800px',
      // height: '80px',
      data: {
        bannerData: bannerData,
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
  addMedia(bannerData: any = {}) {
    const dialogRef = this.dialog.open(AddMediaComponent, {
      hasBackdrop: false,
      width: '800px',
      // height: '80px',
      data: {
        bannerData: bannerData,
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
  deleteBanner(element: any) {
    const dialogRef = this.dialog.open(DeleteRequestComponent, {
      hasBackdrop: false,
      // width: '80px',
      // height: '80px',
      data: {
        text: 'Banner',
        label: 'Delete',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.data}`);
      if (result && result.data.status == 1) {
        let data = {
          id: element.id
        }
        this._appService.deleteApi(`/admin/banner/delete`, data, 1).subscribe((success: any) => {
          if (success.success) {
            this._appService.success(success.msg)
            this.loadData()
          } else {
            this._appService.error(success.msg)
            this.loadData()
          }
        })
      }


    });
  }
  searchData() {
    this.currentPage = 0
    this.loadData()
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