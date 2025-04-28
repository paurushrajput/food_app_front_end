import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { RestaurantManagementComponent } from 'src/app/restaurant-management/restaurant-management.component';

@Component({
  selector: 'app-add-instant-payment',
  templateUrl: './add-instant-payment.component.html',
  styleUrls: ['./add-instant-payment.component.scss']
})
export class AddInstantPaymentComponent {
  selectedinstant: any;
  instantPaymentForm!: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<RestaurantManagementComponent>,
    public dialog: MatDialog,
    private route: Router, private fb: FormBuilder,
    public _appService: AppService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.buildForm()
  }

  ngOnInit(): void {
    this.selectedinstant = this.data.restaurantData
    if (this.data.restaurantData) {
      this.setFormvalues()
    }
  }

  buildForm = () => {
    this.instantPaymentForm = this.fb.group({
      id: [''],
      enable_instant_payment: ['', [Validators.required]],
      instant_pay_amt_pct: ['', [Validators.required]],
      rev_msg_template: ['', [Validators.required]],
      voucher_applicable: ['', [Validators.required]]
    })
  }

  addInstantPayment() {
    let data = {
      res_id: this.data?.restaurantData?.id,
      enable_instant_payment: Number(this.instantPaymentForm.value.enable_instant_payment),
      rev_msg_template: Number(this.instantPaymentForm.value.rev_msg_template),
      voucher_applicable: Number(this.instantPaymentForm.value.voucher_applicable),
      instant_pay_amt_pct: this.instantPaymentForm.value.instant_pay_amt_pct,
    }
    this._appService.putApiWithAuth(`/admin/restaurant/update`, data, 1).subscribe((success: any) => {
      if (success.success) {
        this._appService.success(success.msg)
        this.dialogRef.close({ event: 'close' });
      } else {
        this._appService.error(success.msg)
        this.dialogRef.close({ event: 'close' });
      }
    }, (error) => {
      this._appService.err(error?.error?.msg)
    })
  }

  closeDialogBox(): void {
    this.dialogRef.close();
  }

  setFormvalues = () => {
    this.instantPaymentForm.patchValue({
      id: this.selectedinstant.id ? this.selectedinstant.id : null,
      enable_instant_payment: this.selectedinstant.enable_instant_payment == 1 ? '1' : '0',
      voucher_applicable: this.selectedinstant.voucher_applicable == 1 ? '1' : '0',
      rev_msg_template: this.selectedinstant.rev_msg_template == 1 ? '1' : '0',
      instant_pay_amt_pct: this.selectedinstant.instant_pay_amt_pct ? this.selectedinstant.instant_pay_amt_pct : null,
    })
  }
}
