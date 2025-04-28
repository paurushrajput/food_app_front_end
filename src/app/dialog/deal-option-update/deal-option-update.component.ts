import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { DealMngmtComponent } from 'src/app/deal-mngmt/deal-mngmt.component';

@Component({
  selector: 'app-deal-option-update',
  templateUrl: './deal-option-update.component.html',
  styleUrls: ['./deal-option-update.component.scss']
})
export class DealOptionUpdateComponent {
  selectedDeal: any
  restaurantData: any
  dealOption!: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<DealMngmtComponent>,
    public dialog: MatDialog, private fb: FormBuilder,
    public _appService: AppService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.buildForm()
  }

  ngOnInit(): void {
    this.getRestaurantList()
    this.selectedDeal = this.data;
    if (this.data)
      this.setFormvalues()
  }

  buildForm = () => {
    this.dealOption = this.fb.group({
      id: [''],
      device_check: ['0'],
      is_locked: ['0'],
      sold_out: ['0'],
      referral: [],
      referral_mobile_verified: [],
      count: [],
      template: [],
      booking_fee_required: [],
      type: [],
      restaurant_id: []
    })
  }

  getChangedValues(form: FormGroup): any {
    const changedValues: any = {};
    try {
      Object.keys(form.controls).forEach(key => {
        const control = form.get(key);
        if (control?.dirty) {
          changedValues[key] = control.value;
        }
      });
      return changedValues;
    } catch (error) {
      console.log(error);

    }
  }

  updateDeal() {
    const changes = this.getChangedValues(this.dealOption);
    console.log(changes, '=====');
    changes.deal_id = this.data.id
    // let data = {
    //   deal_id: this.data.id,
    //   device_check: Number(this.dealOption.value.device_check),
    //   is_locked: Number(this.dealOption.value.is_locked),
    //   sold_out: Number(this.dealOption.value.sold_out),
    // }
    let booking = {
      count: Number(this.dealOption.value.count),
      template: Number(this.dealOption.value.template),
      restaurant_id: this.dealOption.value.type == 1 ? this.selectedDeal.restaurant_id : this.dealOption.value.restaurant_id,
      booking_fee_required: Number(this.dealOption.value.booking_fee_required)
    }
    if (this.dealOption.value.is_locked == 1) {
      Object.assign(changes, {
        lock_conditions: {
          referral: Number(this.dealOption.value.referral),
          referral_mobile_verified: Number(this.dealOption.value.referral_mobile_verified),
          booking: booking
        },
      });
    } else {
      Object.assign(changes, {
        lock_conditions: {
          referral: Number(this.dealOption.value.referral),
          referral_mobile_verified: Number(this.dealOption.value.referral_mobile_verified),
          booking: booking
        },
      });
    }
    this._appService.putApiWithAuth(`/admin/deal/update`, changes, 1).subscribe((success: any) => {
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

  getRestaurantList = () => {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/merchants/restaurants?is_paginated=false&type=reservation&restaurant_type=approved`).subscribe((res: any) => {
      this.restaurantData = res.data.rows;
      this._appService.hideSpinner()
    });
  };

  setFormvalues = () => {
    console.log(this.selectedDeal.device_check);
    this.dealOption.patchValue({
      id: this.selectedDeal.id ? this.selectedDeal.id : null,
      device_check: this.selectedDeal.device_check.toString(),
      is_locked: this.selectedDeal.is_locked.toString(),
      sold_out: this.selectedDeal.sold_out.toString(),
      count: this.selectedDeal?.lock_conditions?.booking?.count ? this.selectedDeal?.lock_conditions?.booking?.count : 0,
      campaign_id: this.selectedDeal?.campaign?.uid ? this.selectedDeal?.campaign?.uid : ''
    });
    if (this.selectedDeal.is_locked == 1) {
      this.dealOption.patchValue({
        referral: this.selectedDeal?.lock_conditions?.referral.toString(),
        referral_mobile_verified: this.selectedDeal?.lock_conditions?.referral_mobile_verified.toString(),
        template: this.selectedDeal?.lock_conditions?.booking?.template.toString(),
        booking_fee_required: this.selectedDeal?.lock_conditions?.booking?.booking_fee_required.toString(),
        type: this.selectedDeal?.lock_conditions?.booking?.restaurant_uid == this.selectedDeal?.restaurant_id ? '1' : '0',
        restaurant_id: this.selectedDeal?.lock_conditions?.booking?.restaurant_uid ? this.selectedDeal?.lock_conditions?.booking?.restaurant_uid : null,
      });
    }
  }
}
