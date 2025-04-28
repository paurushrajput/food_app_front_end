import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app.service';
import { CouponManagementComponent } from 'src/app/coupon-management/coupon-management.component';

@Component({
  selector: 'app-delete-coupon',
  templateUrl: './delete-coupon.component.html',
  styleUrls: ['./delete-coupon.component.scss']
})
export class DeleteCouponComponent {

  constructor(
    public dialogRef: MatDialogRef<CouponManagementComponent>,
    public dialog: MatDialog,
    public _appService: AppService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit(): void {
    console.log(this.data);

  }

  deleteRequest() {
    this._appService.deleteApi(`/admin/coupons/remove?coupon_id=${this.data.couponData.id}`, 0, 1).subscribe((success: any) => {
      if (success.success) {
        this._appService.success(success.msg)
         this.dialogRef.close({'status':'close'})
      } else {
        this._appService.error(success.msg)
      }
    })
  }

  closeDialogBox(): void {
    this.dialogRef.close();
  }
}
