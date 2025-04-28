import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { SocialRestaurantManagementComponent } from 'src/app/social-restaurant-management/social-restaurant-management.component';

@Component({
  selector: 'app-update-suggested-price',
  templateUrl: './update-suggested-price.component.html',
  styleUrls: ['./update-suggested-price.component.scss']
})
export class UpdateSuggestedPriceComponent {

  priceData: any
  submitted: any = false
  formInvalid: any = false
  bookingCancelForm!: FormGroup;
  constructor(
    private route: Router,
    private fb: FormBuilder, private formBuilder: FormBuilder,
    public _appService: AppService,
    public dialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<SocialRestaurantManagementComponent>
  ) {
    this.buildForm();
  }
  ngOnInit(): void {
    console.log(this.data);
    
    this.getPriceList()

  }

  closeDialogBox() {
    this.dialogRef.close({ 'status': 'close' });
  }
  get f() { return this.bookingCancelForm.controls; }
  buildForm = () => {
    this.bookingCancelForm = this.fb.group({
      res_id: [this.data.postData?.restaurant_uid],
      price_uid: ['', [Validators.required]],
    });
  };


  getPriceList = () => {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/social/price-list`).subscribe((res: any) => {
      this.priceData = res.data.rows;
      this._appService.hideSpinner()

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
    this._appService.postApiWithAuth('/admin/social/approve-suggested-prices', this.bookingCancelForm.value, 1).subscribe({
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
