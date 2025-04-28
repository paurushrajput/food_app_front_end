import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app.service';
import { ReservationManagementComponent } from 'src/app/reservation-management/reservation-management.component';

@Component({
  selector: 'app-confirm-auto-booking',
  templateUrl: './confirm-auto-booking.component.html',
  styleUrls: ['./confirm-auto-booking.component.scss']
})
export class ConfirmAutoBookingComponent {

  status: any
  constructor(
    public dialogRef: MatDialogRef<ReservationManagementComponent>,
    public dialog: MatDialog,
    public _appService: AppService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    if (this.data?.restaurantData?.auto_booking == '0') {
      this.status = 'Activate'
    } else {
      this.status = 'Deactivate'
    }

  }

  changeStatus() {
    let status
    if (this.status == 'Activate') {
      status = '1'
    } else {
      status = '0'
    }
    let data = {
      res_id: this.data?.restaurantData?.id,
      auto_booking: status
    }
    this._appService.putApiWithAuth(`/admin/restaurant/auto-booking`, data, 1).subscribe((success: any) => {
      if (success.success) {
        this._appService.success(success.msg)
        this.dialogRef.close({ event: 'close' });
      } else {
        this._appService.error(success.msg)
      }
    }, (error: any) => {
      this._appService.err(error.error.msg),
        this.dialogRef.close({ event: 'close' });
    })
  }

  closeDialogBox(): void {
    this.dialogRef.close();
  }
}