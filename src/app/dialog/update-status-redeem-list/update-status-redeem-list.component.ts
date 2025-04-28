import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { ViewGoodiesRedeemListComponent } from '../view-goodies-redeem-list/view-goodies-redeem-list.component';

@Component({
  selector: 'app-update-status-redeem-list',
  templateUrl: './update-status-redeem-list.component.html',
  styleUrls: ['./update-status-redeem-list.component.scss']
})
export class UpdateStatusRedeemListComponent {

submitted: any = false
  formInvalid: any = false
  bookingCancelForm!: FormGroup;
  constructor(
    private route: Router,
    private fb: FormBuilder, private formBuilder: FormBuilder,
    public _appService: AppService,
    public dialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ViewGoodiesRedeemListComponent>
  ) {
    this.buildForm();
  }
  ngOnInit(): void {
    console.log(this.data);

  }

  closeDialogBox() {
    this.dialogRef.close({ 'status': 'close' });
  }
  get f() { return this.bookingCancelForm.controls; }
  buildForm = () => {
    this.bookingCancelForm = this.fb.group({
      redeem_id: [this.data.redeemData?.id],
      message: ['', [Validators.required]],
      status: ['', [Validators.required]]
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
    this._appService.postApiWithAuth('/admin/store-redeem/update', this.bookingCancelForm.value, 1).subscribe({
      next: (success: any) => {
        this._appService.updateLoading(false)
        if (success.success) {
          this.dialogRef.close()
          this._appService.success(success.msg)
        } else {
          console.log('api error');
          this.dialogRef.close()
          this._appService.err(success.msg)
        }
      },
      error: (error: any) => {
        this._appService.updateLoading(false)
        console.log({ error });
        this.dialogRef.close()
        this._appService.err(error.error.msg)
      },
    });
  }
}
