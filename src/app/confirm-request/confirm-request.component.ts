import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app.service';
import { RestaurantManagementComponent } from '../restaurant-management/restaurant-management.component';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-request',
  templateUrl: './confirm-request.component.html',
  styleUrls: ['./confirm-request.component.scss']
})
export class ConfirmRequestComponent {
  prefix: any
  comission: any = 50;
  adminUsers: any = []
  restaurant_pax_list: any = []
  fixed_per_booking: any = []
  selectedCategory: any;
  approveForm!: FormGroup;
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
    let customArray = this.data.admin_users[0]
    this.adminUsers = Object.keys(customArray).map(key => {
      return { key: key, value: customArray[key] };
    });
    let customArrayv1 = this.data?.restaurant_pax_details?.fixed_per_pax
    this.restaurant_pax_list = Object.keys(customArrayv1).map(key => {
      return { key: key, value: customArrayv1[key] };
    });
    let customArrayv2 = this.data?.restaurant_pax_details?.fixed_per_booking
    this.fixed_per_booking = Object.keys(customArrayv2).map(key => {
      return { key: key, value: customArrayv2[key] };
    });
    // this.fixed_per_booking = this.data?.restaurant_pax_details?.fixed_per_booking
    this.selectedCategory = this.data.restaurantData
    this.prefix = this.data.prefix
    if (!this.selectedCategory?.pax_details?.varies_per_pax) {
      for (let index = 1; index <= 7; index++) {
        this.addDetails(JSON.stringify(index), ''); // Create a new form group
      }
    }
    if (this.data.restaurantData)
      this.setFormvalues()
  }

  buildForm = () => {
    this.approveForm = this.fb.group({
      id: [''],
      pax_details: ['', [Validators.required]],
      auto_booking: ['', [Validators.required]],
      approve: ['approved', [Validators.required]],
      booking_fee_required: ['0', [Validators.required]],
      pax_commission_type: ['', [Validators.required]],
      fixed_per_pax: ['', [Validators.required]],
      fixed_per_booking: [this.fixed_per_booking, [Validators.required]],
      details: this.fb.array([]),
      approved_by: ['', [Validators.required]],
      on_boarded_by: ['', [Validators.required]],
      restaurant_type: ['', [Validators.required]],
      otp_required: ['', [Validators.required]],
      enable_instant_payment: ['', [Validators.required]],
      instant_pay_amt_pct: ['', [Validators.required]],
      rev_msg_template: ['', [Validators.required]],
      voucher_applicable: ['', [Validators.required]],
      credits_applicable: ['', [Validators.required]]
    })
  }


  get pax_details() {
    return this.approveForm.controls['details'] as FormArray;
  }

  addDetails(num_person = '', amount = '') {
    const details = this.fb.group({
      num_person: [num_person, Validators.required],
      amount: [amount, Validators.required],
    });
    this.pax_details.push(details);
  }

  removeDetails(index: number, id: any) {
    const control = <FormArray>this.approveForm.get('details');
    control.removeAt(index);
  }

  toArray(end: any) {
    return end ? Array.from({ length: end }, (_, index) => index + 1) : [];
  }

  approveRestaurant() {
    let data = {}
    let pax_details = {}
    if (this.approveForm.value.pax_commission_type == '1') {
      Object.assign(pax_details, { 'fixed_per_pax': Number(this.approveForm.value.fixed_per_pax) });
    } else if (this.approveForm.value.pax_commission_type == '2') {
      Object.assign(pax_details, { 'varies_per_pax': this.approveForm.value.details });
    } else {
      Object.assign(pax_details, { 'fixed_per_booking': Number(this.approveForm.value.fixed_per_booking) });
    }
    if (this.data.restaurantData.on_boarded_by == null && this.data.restaurantData.approved_by == null) {
      Object.assign(data, { 'approved_by': Number(this.approveForm.value.approved_by) });
      Object.assign(data, { 'on_boarded_by': Number(this.approveForm.value.on_boarded_by) });
    }
    if (this.data.restaurantData.approval_status != "pending") {
      data = {
        ...data,
        res_id: this.data?.restaurantData?.id,
        commission_currency: 'AED',
        auto_booking: this.approveForm.value.auto_booking,
        booking_fee_required: Number(this.approveForm.value.booking_fee_required),
        pax_commission_type: this.approveForm.value.pax_commission_type,
        otp_required: Number(this.approveForm.value.otp_required),
        restaurant_type: this.approveForm.value.restaurant_type,
        pax_details: pax_details,
        enable_instant_payment: Number(this.approveForm.value.enable_instant_payment),
        rev_msg_template: Number(this.approveForm.value.rev_msg_template),
        voucher_applicable: Number(this.approveForm.value.voucher_applicable),
        instant_pay_amt_pct: this.approveForm.value.instant_pay_amt_pct,
        credits_applicable: this.approveForm.value.credits_applicable,
      }
    } else {
      data = {
        ...data,
        res_id: this.data?.restaurantData?.id,
        commission_currency: 'AED',
        auto_booking: this.approveForm.value.auto_booking,
        approve: '1',						//0, 1
        restaurant_type: this.approveForm.value.restaurant_type,
        booking_fee_required: Number(this.approveForm.value.booking_fee_required),
        otp_required: Number(this.approveForm.value.otp_required),
        pax_details: pax_details,
        enable_instant_payment: Number(this.approveForm.value.enable_instant_payment),
        rev_msg_template: Number(this.approveForm.value.rev_msg_template),
        voucher_applicable: Number(this.approveForm.value.voucher_applicable),
        instant_pay_amt_pct: this.approveForm.value.instant_pay_amt_pct,
        credits_applicable: this.approveForm.value.credits_applicable,
      }
    }
    if (!this.data.restaurantData.restaurant_type && this.data.restaurantData.restaurant_type == null) {
      Object.assign(data, { 'restaurant_type': Number(this.approveForm.value.restaurant_type) });
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
    this.approveForm.patchValue({
      id: this.selectedCategory.id ? this.selectedCategory.id : null,
      //approve: this.selectedCategory.approval_status ? this.selectedCategory.approval_status : null,
      auto_booking: this.selectedCategory.auto_booking == 1 ? '1' : '0',
      on_boarded_by: this.selectedCategory.on_boarded_by ? this.selectedCategory.on_boarded_by.toString() : null,
      approved_by: this.selectedCategory.approved_by ? this.selectedCategory.approved_by.toString() : null,
      pax_commission_type: this.selectedCategory.pax_commission_type ? this.selectedCategory.pax_commission_type.toString() : null,
      fixed_per_pax: this.selectedCategory?.pax_details?.fixed_per_pax ? this.selectedCategory?.pax_details?.fixed_per_pax.toString() : null,
      fixed_per_booking: this.selectedCategory?.pax_details?.fixed_per_booking ? this.selectedCategory?.pax_details?.fixed_per_booking.toString() : null,
      restaurant_type: this.selectedCategory.restaurant_type ? this.selectedCategory.restaurant_type.toString() : '0',
      booking_fee_required: this.selectedCategory.booking_fee_required ? this.selectedCategory.booking_fee_required.toString() : '0',
      otp_required: this.selectedCategory.otp_required ? this.selectedCategory.otp_required.toString() : '0',
      enable_instant_payment: this.selectedCategory.enable_instant_payment == 1 ? '1' : '0',
      voucher_applicable: this.selectedCategory.voucher_applicable == 1 ? '1' : '0',
      rev_msg_template: this.selectedCategory.rev_msg_template == 1 ? '1' : '0',
      credits_applicable: this.selectedCategory.credits_applicable == 1 ? '1' : '0',
      instant_pay_amt_pct: this.selectedCategory.instant_pay_amt_pct ? this.selectedCategory.instant_pay_amt_pct : null,
    })
    if (this.selectedCategory?.pax_details?.varies_per_pax) {
      for (const data of this.selectedCategory?.pax_details?.varies_per_pax) {
        this.addDetails(data.num_person, data.amount); // Create a new form group
      }
    }
  }
}
