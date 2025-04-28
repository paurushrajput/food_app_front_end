import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app.service';
import { CouponRedeemComponent } from 'src/app/coupon-redeem/coupon-redeem.component';

@Component({
  selector: 'app-delete-redeem',
  templateUrl: './delete-redeem.component.html',
  styleUrls: ['./delete-redeem.component.scss']
})
export class DeleteRedeemComponent {
  constructor(
    public dialogRef: MatDialogRef<CouponRedeemComponent>,
    public dialog: MatDialog,
    public _appService: AppService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit(): void {
    console.log(this.data);
  }

  deleteRequest() {
    // let data = {
    //   "store_id": this.data.redeemData.id,
    //   "title": this.data.redeemData.title
    // }
    this._appService.deleteApi(`/admin/nukhba-store/remove?store_id=${this.data.redeemData.id}`, 0, 1).subscribe((success: any) => {
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
