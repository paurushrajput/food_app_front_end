


import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app.service';
import { AddBannerComponent } from '../dialog/add-banner/add-banner.component';
import { DeleteRequestComponent } from '../dialog/delete-request/delete-request.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ImagePreviewDialogComponent } from '../dialog/image-preview-dialog/image-preview-dialog.component';
import { AddRemarkInfluncerComponent } from '../add-remark-influncer/add-remark-influncer.component';
import { ConfirmInfluncerRequestComponent } from '../dialog/confirm-influncer-request/confirm-influncer-request.component';
import { UpdateCommissionComponent } from '../update-commission/update-commission.component';

@Component({
  selector: 'app-influncer-management',
  templateUrl: './influncer-management.component.html',
  styleUrls: ['./influncer-management.component.scss']
})
export class InfluncerManagementComponent {
  imageSrc: any
  ELEMENT_DATA: CATEGORY[] = [];
  totalRows = 0;
  pageSize = 10;
  searchForm!: FormGroup;
  currentPage = 0;
  selectedCategory: any = {}
  pageSizeOptions: number[] = [10, 20, 300, 40, 100];
  displayedColumns: string[] = ['sr', 'fname', 'email', 'mobile', 'booking', 'campaign_id', 'onboard', 'last_login', 'last_seen', 'signedupUser', 'verifiedUser', 'commission_type', 'commission_percentage', 'pdf', 'status', 'action']
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
  changeStatus(userData: any = {}, status: any) {
    console.log(userData);
    const dialogRef = this.dialog.open(ConfirmInfluncerRequestComponent, {
      hasBackdrop: false,
      width: '50',
      height: '100',
      data: {
        userData: userData,
        status: status
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.saveRemark(userData, status)
      }
    });
  }
  addRemark(userData: any = {}, status: any) {
    console.log(userData);
    const dialogRef = this.dialog.open(AddRemarkInfluncerComponent, {
      hasBackdrop: false,
      width: '50',
      height: '100',
      data: {
        userData: userData,
        status: status
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.changeStatus(result.value, status)
      }
    });
  }
  updateCommission(elementdata:any) {
    const dialogRef = this.dialog.open(UpdateCommissionComponent, {
      hasBackdrop: false,
      width: '50',
      height: '100',
      data: {
        elementdata: elementdata,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadData()
      }
    });
  }
  saveRemark(data: any = {}, status: any) {
    this._appService.updateLoading(true)

    this._appService.putApiWithAuth(`/admin/influencers/update-status`, data, 1).subscribe({
      next: (success: any) => {
        this._appService.updateLoading(false)
        if (success.success) {
          this._appService.success('Updated Successfully')
          this.loadData()
        }
        else {
          this._appService.error(success.msg)
        }
      },
      error: (error: any) => {
        this._appService.updateLoading(false)
        console.log({ error })
        this._appService.err(error?.error?.msg)
      }
    })
  }
  dateCut(str: any) {
    if (str) {
      return str.slice(0, 9)
    } else {
      return 'N/A'
    }
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
  openPdf(pdfUrl: any) {
    window.open(pdfUrl, '_blank')
  }
  loadData() {
    this._appService.showSpinner()
    let type = this.searchForm.value.type ? this.searchForm.value.type : ''
    let size = this.searchForm.value.size ? this.searchForm.value.size : ''
    const params = this.buildQueryParams();
    this._appService.updateQueryParams(params);
    this._appService.getApiWithAuth(`/admin/influencers/list?type=${type}&size=${size}&page=${this.currentPage + 1}&page_size=${this.pageSize}&is_paginated=true`).subscribe((res: any) => {
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