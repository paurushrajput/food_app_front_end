import { Component, ElementRef, Inject, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CATEGORY } from '../view-leaderboard/view-leaderboard.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { DatTimePickerComponent } from 'src/app/common/date-time-picker/date-time-picker.component';
import { AddSlotTemplateComponent } from '../add-slot-template/add-slot-template.component';

@Component({
  selector: 'app-slot-list',
  templateUrl: './slot-list.component.html',
  styleUrls: ['./slot-list.component.scss']
})
export class SlotListComponent {
  ELEMENT_DATA: any = [];
  totalRows = 0;
  pageSize = 10;
  id: any
  slotsData: any
  searchForm!: FormGroup;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 20, 300, 40, 100];
  displayedColumns: string[] = ['start_time', 'end_time', 'discount', 'seats_allocated', 'seats_left', 'max_guest_per_booking', 'status', 'date'];
  dataSource: MatTableDataSource<CATEGORY> = new MatTableDataSource();
  selectedLocation: any = {}
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  teamData: any;
  apiUrl: any;
  response: any = [];
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
  reservatinos: any;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public _appService: AppService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<SlotListComponent>
  ) {
    this.searchForm = this.fb.group({

      from_date: [''],
      to_date: [''],
      radio_type: [''],


    });
  }

  onDateRangeChange(event: {startDate: Date, endDate: Date}) {
    
   this.searchForm.value.from_date=event.startDate
   this.searchForm.value.to_date=event.endDate
   
  }
  changeTemplate(){
  
    const dialogRef = this.dialog.open(AddSlotTemplateComponent, {
      hasBackdrop: false,
      width: '1200px',
      data: {
        data:this.data.restaurantData
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      
     
    });
    this.dialogRef.close({ event: 'close' });
    //this.dialog.closeAll()
  }

  @ViewChild(DatTimePickerComponent) dateTimePicker: DatTimePickerComponent | undefined;
  @ViewChild('picker') picker: MatDateRangePicker<any> | undefined;
  @ViewChild('startInput') startInput: ElementRef | undefined;
  @ViewChild('endInput') endInput: ElementRef | undefined;
  ngAfterViewInit(): void {
    this.startInput?.nativeElement.addEventListener('click', () => this.picker?.open());
    this.endInput?.nativeElement.addEventListener('click', () => this.picker?.open());
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {

    this.loadData('1')
  }

  ngAfterViewChecked(): void {
    // new addin_pad();
  }
  // admin/restaurant/get-slots?page=1&page_size=10&is_paginated=true&sort_by=created_at&order=desc&from_date=2024-02-29&to_date=&res_id=4d024a4e-cefe-11ee-aff1-063795028a54
  loadData(type: any) {
 
    if (type == '2') {
      this.currentPage = 0
    }
    this.searchForm.value.from_date = this.searchForm.value.from_date ? this.datePipe.transform(this.searchForm.value.from_date, 'yyyy-MM-dd') : "";
    this.searchForm.value.to_date = this.searchForm.value.to_date ? this.datePipe.transform(this.searchForm.value.to_date, 'yyyy-MM-dd') : "";
    this._appService.showSpinner()
    let apiUrl = `/admin/restaurant/get-slots?page=${this.currentPage + 1}&page_size=${this.pageSize}&is_paginated=true&sort_by=created_at&order=asc&res_id=${this.data.restaurantData.id}&from_date=${this.searchForm.value.from_date}&to_date=${this.searchForm.value.to_date}`
    const currentDate = new Date()
    if (this.searchForm.value.radio_type === 'day')
      apiUrl += `&day=${currentDate.getDate()}`;
    if (this.searchForm.value.radio_type === 'month')
      apiUrl += `&month=${currentDate.getMonth() + 1}`;
    if (this.searchForm.value.radio_type === 'year')
      apiUrl += `&year=${currentDate.getFullYear()}`;

    this._appService.getApiWithAuth(apiUrl).subscribe((res: any) => {
      this.slotsData = res.data?.rows
      this.reservatinos = res.data?.reservatinos
      this._appService.hideSpinner()
      setTimeout(() => {
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length = res.data?.count;
      });
      // this.isLoading = false;
    })
  }
  formatStartDate(event: any): void {
    // Format the start date as 'dd--MM-yyyy'
    this.formatDate(event.target.value, 'from_date');
  }

  formatEndDate(event: any): void {
    // Format the end date as 'dd--MM-yyyy'
    this.formatDate(event.target.value, 'to_date');
  }

  formatDate(dateString: string, controlName: string): void {
    const fromDateTimestamp1 = this.datePipe.transform(dateString, 'yyyy-MM-dd');
    this.searchForm.controls[controlName].setValue(fromDateTimestamp1);
  }
  calculateProgressPercentage(slot: any): number {
    if (slot.seats_left > 0) {
     
      return (((slot.seats_allocated - slot.seats_left) / (slot.seats_allocated)) * 100);
    } else {
    

      // Handle the case when there are no seats left to avoid division by zero
      return 100;
    }
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData('1');
  }

  formReset = () => {
    this.searchForm.reset()
    this.loadData('2')
    this.dateTimePicker?.reset();
    //  window.location.reload()
  }
}
