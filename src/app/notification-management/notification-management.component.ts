import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { SendNotificationComponent } from '../dialog/send-notification/send-notification.component';
@Component({
  selector: 'app-notification-management',
  templateUrl: './notification-management.component.html',
  styleUrls: ['./notification-management.component.scss']
})
export class NotificationManagementComponent {


  ELEMENT_DATA: CATEGORY[] = [];
  totalRows = 0;
  pageSize = 10;
  id: any
  searchForm!: FormGroup;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 20, 30, 40, 100];
  displayedColumns: string[] = ['sr', 'date', 'title', 'topic', 'device', 'image', 'message', 'actionUrl', 'actionType'];
  dataSource: MatTableDataSource<CATEGORY> = new MatTableDataSource();
  selectedLocation: any = {}
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  teamData: any;
  apiUrl: any;
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public _appService: AppService,
    public dialog: MatDialog,
    public router: Router,

  ) {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.loadData()
  }

  ngAfterViewChecked(): void {
  }

  sendNoti(notiData: any = {}) {
    const dialogRef = this.dialog.open(SendNotificationComponent, {
      hasBackdrop: false,
      width: "575px",
      data: {
        notiData: notiData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
       console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadData()
      }
    });
  }

  loadData() {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/notifications/list?page=${this.currentPage + 1}&page_size=${this.pageSize}&is_paginated=true`).subscribe((res: any) => {
      this.dataSource.data = res.data?.row
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
      })
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }

  formReset = () => {
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
