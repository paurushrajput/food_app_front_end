import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app.service';
import { MerchantManagementComponent } from 'src/app/merchant-management/merchant-management.component';

@Component({
  selector: 'app-force-pass-update',
  templateUrl: './force-pass-update.component.html',
  styleUrls: ['./force-pass-update.component.scss']
})
export class ForcePassUpdateComponent {

  constructor(
    public dialog: MatDialog,
    public service: AppService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<MerchantManagementComponent>

  ) { }

  ngOnInit(): void {
  }

  passwordForceUpdate() {
    let data = {
      mer_id: this.data.merchantData.id,
      force_update_pass: "1"
    }
    this.service.putApiWithAuth(`/admin/merchants/update-merchant`, data).subscribe((success: any) => {
      if (success.success) {
        this.service.success(success.msg)
         this.dialogRef.close({'status':'close'})
      } else {
        this.service.error(success.msg)
      }
    })

  }

  closeDialogBox(): void {
     this.dialogRef.close({'status':'close'})
  }
}