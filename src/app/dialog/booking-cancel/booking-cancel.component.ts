import { Component, Inject, Optional } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { ReservationManagementComponent } from 'src/app/reservation-management/reservation-management.component';

@Component({
  selector: 'app-booking-cancel',
  templateUrl: './booking-cancel.component.html',
  styleUrls: ['./booking-cancel.component.scss']
})
export class BookingCancelComponent {
  submitted: any = false
  formInvalid: any = false
  bookingCancelForm!: FormGroup;
  
  constructor(
    private route: Router,
    private fb: FormBuilder, private formBuilder: FormBuilder,
    public _appService: AppService,
    public dialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ReservationManagementComponent>
  ) {
    this.buildForm();
  }
  ngOnInit(): void {
  }

  closeDialogBox() {
     this.dialogRef.close({'status':'close'});
  }
  get f() { return this.bookingCancelForm.controls; }
  buildForm = () => {
    this.bookingCancelForm = this.fb.group({
      reserve_ids: [this.data.bookingData],
      booking_cancel_reason: ['', [Validators.required]],
    
    });
  };
 

  submit() {
    if (this.bookingCancelForm.invalid) {
      this.formInvalid = true
      this.submitted = true
      return
    }
    this._appService.updateLoading(true)
    this.submitted = false;
    this._appService.postApiWithAuth('/admin/reservation/cancel', this.bookingCancelForm.value, 1).subscribe({
      next: (success: any) => {
        this._appService.updateLoading(false)
        if (success.success) {
          this.dialogRef.close({ event: 'close' });
          this._appService.success(success.msg)
        } else {
          console.log('api error');
          this.dialogRef.close({ event: 'close' });
          this._appService.err(success.msg)
        }
      },
      error: (error: any) => {
        this._appService.updateLoading(false)
        console.log({ error });
        this.dialogRef.close({ event: 'close' });
        this._appService.err(error.error.msg)
      },
    });
  }
}
