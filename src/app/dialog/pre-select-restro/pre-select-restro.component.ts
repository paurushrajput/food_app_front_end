import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app.service';
import { DealMngmtComponent } from 'src/app/deal-mngmt/deal-mngmt.component';

@Component({
  selector: 'app-pre-select-restro',
  templateUrl: './pre-select-restro.component.html',
  styleUrls: ['./pre-select-restro.component.scss']
})
export class PreSelectRestroComponent {
  text: any
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
    this.selectedDeal = this.data;
    this.text = this.selectedDeal.pre_select_branch == 1 ? 'Disable' : 'Enable'
    if (this.data)
      this.setFormvalues()
  }

  buildForm = () => {
    this.dealOption = this.fb.group({
      id: [''],
      pre_select_branch: []
    })
  }

  updateDeal() {
    let data = {
      deal_id: this.data.id,
      pre_select_branch: Number(this.selectedDeal.pre_select_branch == 1 ? 0 : 1)
    }
    this._appService.putApiWithAuth(`/admin/deal/update`, data, 1).subscribe((success: any) => {
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
