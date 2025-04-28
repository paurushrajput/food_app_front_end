import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app.service';
import { CATEGORY } from '../location-management/location-management.component';
import { BookingCancelComponent } from '../dialog/booking-cancel/booking-cancel.component';
import { RestaurantManagementComponent } from '../restaurant-management/restaurant-management.component';

@Component({
  selector: 'app-view-booking',
  templateUrl: './view-booking.component.html',
  styleUrls: ['./view-booking.component.scss']
})
export class ViewBookingComponent {
  displayedColumns: string[] = ['sr', 'cname', 'cemail', 'cmobile', 'resName', 'bookingDate', 'pax', 'id', 'status','action'];
  dataSource: MatTableDataSource<CATEGORY> = new MatTableDataSource();
  currentPage:any=0
  pageSize:any=10
  reviewData: any = []
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  apiUrl: any;
  selectedIds: any
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, public _appService: AppService,public dialogRef: MatDialogRef<RestaurantManagementComponent>
  ) { }
  ngOnInit(): void {
    this.loadData(this.data.bookingData?.id)
  }
  onSelectAllCheckboxClick() {
    // Update the state of all checkboxes based on the state of "Select All" checkbox
    this.dataSource.data.map((item: any) => {
      item.checked = this.selectAllValue;
    });
    if (this.selectAllValue) {
      this.selectedIds = this.dataSource.data
        .filter((item: any) => item.status?.text !== 'Cancelled by Admin')
        .map((item: any) => item.id)
        .join(',');
      const dialogRef = this.dialog.open(BookingCancelComponent, {
        hasBackdrop: false,
        // width: '80px',
        // height: '80px',
        data: {
          bookingData: this.selectedIds,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        this.loadData(this.data.bookingData.id)
        this.selectAllValue = false
      });
    } else {
      this.selectedIds = '';
    }
  }
  checkboxValue: any = false
  selectAllValue: boolean = false;
  onCheckboxClick(bookingData: any) {
    // Make your API call here
    console.log(bookingData)
    if (bookingData.checked) {
      const dialogRef = this.dialog.open(BookingCancelComponent, {
        hasBackdrop: false,
        // width: '80px',
        // height: '80px',
        data: {
          bookingData: bookingData.id,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        this.loadData(this.data.bookingData.id)
      });

    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  pageSizeOptions: number[] = [10, 20, 300, 40, 100];
  totalRows = 0;
  loadData(resId: any) {
    this._appService.getApiWithAuth(`/admin/reservation/list?booking_type=all&page=${this.currentPage + 1}&page_size=${this.pageSize}&res_uid=${resId}&is_paginated=true`).subscribe((res: any) => {
      this.dataSource.data = res.data?.rows
      this._appService.hideSpinner()
      setTimeout(() => {
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length = res.data?.count;
      });
      // this.isLoading = false;
    },
      (error) => {
       
      })
  }
  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData(this.data.bookingData.id);
  }
  closeDialogBox() {
     this.dialogRef.close({'status':'close'})
  }
}
