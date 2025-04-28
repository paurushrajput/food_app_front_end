import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app.service';
import { DealHistoryComponent } from 'src/app/deal-history/deal-history.component';

@Component({
  selector: 'app-redeem-otp',
  templateUrl: './redeem-otp.component.html',
  styleUrls: ['./redeem-otp.component.scss']
})
export class RedeemOtpComponent {
  otpForm!: FormGroup;
 constructor(
    public dialog: MatDialog,private fb: FormBuilder,
    public _appService: AppService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<DealHistoryComponent>

  ) { }

   
  ngOnInit(): void {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }
  redeemotp() {
    console.log(this.data)
    if (this.otpForm.valid) {
    let data = {
      "id":this.data.id,
      "otp": this.otpForm.value.otp,
      "branch_id": this.data.branch_id
    }
    this._appService.deleteApi(`/admin/deal/redeemed`, data, 1).subscribe((success: any) => {
      if (success.success) {
        this._appService.success(success.msg)
         this.dialogRef.close({'status':'close'})
      } else {
        this._appService.error(success.msg)
      }
    })
  }
  }

  closeDialogBox(): void {
    this.dialogRef.close();
  }
}
