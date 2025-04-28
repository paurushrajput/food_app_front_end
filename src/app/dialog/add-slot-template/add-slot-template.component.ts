import { Component, ElementRef, Inject, Optional, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CATEGORY } from '../view-leaderboard/view-leaderboard.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AppService } from 'src/app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { DatTimePickerComponent } from 'src/app/common/date-time-picker/date-time-picker.component';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-add-slot-template',
  templateUrl: './add-slot-template.component.html',
  styleUrls: ['./add-slot-template.component.scss']
})
export class AddSlotTemplateComponent {
  slotForm: any;
  startTime: any = [];
  endTime: any = [];
  fromDate: Date = new Date();
  endDate: Date = new Date();
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public _appService: AppService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {
    this.slotForm = this.fb.group({
      slots: this.fb.array([this.createSlot()]),
      restaurant_id: ['']
    });
    this.slotForm.patchValue({ 'restaurant_id': data.data.id })
    this.createDefaultSlotBreakup('00:00', '23:59')
  }
  isFormReadyToSubmit = false;
  onDateRangeChange(event: { startDate: Date, endDate: Date }) {

    this.fromDate = event.startDate
    this.endDate = event.endDate

   

  }
  createDefaultSlotBreakup(startTime: any, endTime: any) {
    let currentDateTime = DateTime.fromObject({
      hour: parseInt(startTime.split(':')[0], 10),
      minute: parseInt(startTime.split(':')[1], 10),
    });
    const endDateTime = DateTime.fromObject({
      hour: parseInt(endTime.split(':')[0], 10),
      minute: parseInt(endTime.split(':')[1], 10),
    });
    while (currentDateTime < endDateTime) {
      const currentEndTime = currentDateTime.plus({ minutes: 30 });
      let startData = {
        time: currentDateTime.toFormat('HH:mm'),
        value: currentDateTime.toFormat('h:mm a')
      }
      let endData = {
        time: currentEndTime.toFormat('HH:mm'),
        value: currentEndTime.toFormat('h:mm a')
      }
      this.startTime.push(startData)
      this.endTime.push(endData)
      // Create 12 time slots with 30-minute increments
      currentDateTime = currentEndTime;
    }

  }



  ngOnInit(): void { }

  get slots(): FormArray {
    return this.slotForm.get('slots') as FormArray;
  }

  filterEmptyValues(data: any): any {
    const filteredData = JSON.parse(JSON.stringify(data)); // Clone the data object
  
    Object.keys(filteredData).forEach(key => {
      if (Array.isArray(filteredData[key])) {
        // If it's an array (like 'slots'), recursively filter each item in the array
        filteredData[key] = filteredData[key].map((item:any) => this.filterEmptyValues(item));
      } else if (filteredData[key] === '' || filteredData[key] == null || filteredData[key] === undefined) {
        // Remove the field if it's blank
        delete filteredData[key];
      }
    });
  
    return filteredData;
  }
  createSlot(): FormGroup {
    return this.fb.group({
      start_date: [this.fromDate, Validators.required],
      end_date: [this.endDate, Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      otp_required: [0],
      rev_msg_template: [0],
      max_guest_per_booking: ["", Validators.required],
      discount: [""],
      voucher_applicable: [0],
      booking_fee_required: [0],
      auto_booking: [0],
      amount: [''],
      total_capacity: ['', Validators.required],
      commission_type:[1]
    });
  }

  addSlot(): void {
    this.slots.push(this.createSlot());
  }

  removeSlot(index: number): void {
    this.slots.removeAt(index);
  }

  onSubmit(): void {

    const fromDate = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd');
    const toDate = this.datePipe.transform(this.endDate, 'yyyy-MM-dd');

    // Iterate through the slots FormArray
    this.slots.controls.forEach((slot: any) => {
      slot.patchValue({
        start_date: fromDate,
        end_date: toDate
      });
    });
    
    this.isFormReadyToSubmit = true;
   
    if (this.slotForm.valid) {
      const filteredFormData = this.filterEmptyValues(this.slotForm.value);
      this._appService.putApiWithAuth(`/admin/restaurant/update-slots`,filteredFormData, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.status_code == 200) {
            this._appService.success('Updated Successfully')

            this.dialog.closeAll();
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
  }
  closeDialogBox() {
    this.dialog.closeAll()
  }

}
