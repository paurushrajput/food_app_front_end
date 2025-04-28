import { Component, ElementRef, Inject, Optional, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { DatTimePickerComponent } from 'src/app/common/date-time-picker/date-time-picker.component';
import { DealHistoryComponent } from 'src/app/deal-history/deal-history.component';

@Component({
  selector: 'app-deal-history-filter',
  templateUrl: './deal-history-filter.component.html',
  styleUrls: ['./deal-history-filter.component.scss']
})
export class DealHistoryFilterComponent {

  selectedFilter: any
  searchForm!: FormGroup;

  constructor(
    public router: Router,
    public dialogRef: MatDialogRef<DealHistoryComponent>,
    public _appService: AppService, private fb: FormBuilder, public dialog: MatDialog, @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.searchForm = this.fb.group({
      created_at_from_date: [''],
      created_at_to_date: [''],
      redeemed_at_from_date: [''],
      redeemed_at_to_date: [''],
      type: ['paid'],
      is_pilot: ['0'],
      booking_id: [''],
      status: ['']
    });
  }
  @ViewChild('picker') picker: MatDateRangePicker<any> | undefined;
  @ViewChild('startInput') startInput: ElementRef | undefined;
  @ViewChild('endInput') endInput: ElementRef | undefined;
  @ViewChild('picker2') picker2: MatDateRangePicker<any> | undefined;
  @ViewChild('startInput') startInput1: ElementRef | undefined;
  @ViewChild('endInput') endInput1: ElementRef | undefined;
  ngAfterViewInit(): void {
    this.startInput?.nativeElement.addEventListener('click', () => this.picker?.open());
    this.endInput?.nativeElement.addEventListener('click', () => this.picker?.open());
  }

  ngOnInit(): void {
    if (this.data.data != undefined) {
      this.selectedFilter = this.data.data
      this.setFormvalues()
    }
  }

  loadData() {
    this.closeDialog()
  }

  closeDialog() {
    this.dialogRef.close({ event: 'close', data: this.searchForm.value });
  }

  formReset = () => {
    this.searchForm.reset()
  }

  backFrom = () => {
    this.dialogRef.close({ event: 'close' });
  }

  setFormvalues = () => {
    this.searchForm.patchValue({
      is_pilot: this.selectedFilter.is_pilot ? this.selectedFilter.is_pilot : null,
      created_at_from_date: this.selectedFilter.created_at_from_date ? this.selectedFilter.created_at_from_date : null,
      created_at_to_date: this.selectedFilter.created_at_to_date ? this.selectedFilter.created_at_to_date : null,
      redeemed_at_from_date: this.selectedFilter.redeemed_at_from_date ? this.selectedFilter.redeemed_at_from_date : null,
      redeemed_at_to_date: this.selectedFilter.redeemed_at_to_date ? this.selectedFilter.redeemed_at_to_date : null,
      type: this.selectedFilter.type ? this.selectedFilter.type : null,
      booking_id: this.selectedFilter.booking_id ? this.selectedFilter.booking_id : null,
      status: this.selectedFilter.status ? this.selectedFilter.status : null,
    })
  }
}
