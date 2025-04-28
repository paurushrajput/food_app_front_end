import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app.service';
import { CouponManagementComponent } from 'src/app/coupon-management/coupon-management.component';

@Component({
  selector: 'app-add-redeem',
  templateUrl: './add-redeem.component.html',
  styleUrls: ['./add-redeem.component.scss']
})
export class AddRedeemComponent {
  couponData: any
  redeemImage: any
  redeemData: any = {};
  submitted: any = false
  formInvalid: any = false
  couponForm!: FormGroup;
  isEditMode: boolean = true;
  organisationData: any = [];
  userList: any;
  image: any
  imageSize: any;
  constructor(
    private fb: FormBuilder, private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CouponManagementComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, public _appService: AppService
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.getCouponApi()
    this.redeemData = this.data?.redeemData;
    this.isEditMode = !!this.redeemData;
    this.buildForm();
    if (this.isEditMode) {
      this.setFormValues();
    }
  }

  buildForm(): void {
    this.couponForm = this.formBuilder.group({
      image: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      type: ['', Validators.required],
      points: ['', Validators.required],
      status: ['', Validators.required],
      coupon_id: ['', Validators.required]
    }, {});
  }

  setFormValues(): void {
    this.image = this.redeemData.image
    this.couponForm.patchValue({
      title: this.redeemData.title,
      organization_id: this.redeemData?.organization_id,
      description: this.redeemData.description,
      type: this.redeemData.type == 'coupon' ? '1' : '2',
      points: this.redeemData.points,
      coupon_id: this.redeemData.coupon_id,
      status: this.redeemData.status.toString(),
    });
  }


  onFileSelected(fileInput: any) {
    if (fileInput.target.files.length > 0) {
      const file: File = fileInput.target.files[0]
      this.imageSize = this._appService.formatBytes(file.size);
      this.redeemImage = file
      const reader = new FileReader();
      reader.onload = () => {
        this.image = reader.result as string;
      }
      reader.readAsDataURL(file)
    }
  }

  uploadImage() {
    if (this.redeemImage) {
      let formData = new FormData();
      formData.append('file', this.redeemImage)

      var promise = new Promise((resolve, reject) => {
        this._appService.postApiWithAuthentication(`/admin/media/image`, formData, 1).subscribe({
          next:
            (success: any) => {
              if (success.success == true) {
                return resolve(success.data.media_id)
              }
            },
          error: (error: any) => {
            this._appService.err(error?.error?.msg)
          }
        })
      });
      return promise
    } else {
      return null
    }

  }

  saveCategory = async () => {
    this._appService.updateLoading(true)
    const response = await this.uploadImage();

    // if (this.couponForm.valid) {
    if (!this.isEditMode) {
      let data = {
        title: this.couponForm.value.title,
        description: this.couponForm.value.description,
        type: Number(this.couponForm.value.type),
        coupon_id: this.couponForm.value.coupon_id,
        // coupon_id: null,
        image_id: response,
        points: Number(this.couponForm.value.points),
        status: Number(this.couponForm.value.status)
      }
      this._appService.postApiWithAuth(`/admin/nukhba-store/add`, data, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.status_code == 200) {
            this._appService.success('Updated Successfully')
            this.dialogRef.close(true);
          }
          else {
            this._appService.error(success.msg)
          }
        },
        error: (error: any) => {
          this._appService.updateLoading(false)
          console.log({ error })
          this._appService.err(error?.error?.msg)
        }
      })
    } else {
      let data = {
        title: this.couponForm.value.title,
        description: this.couponForm.value.description,
        type: this.couponForm.value.type,
        coupon_id: this.couponForm.value.coupon_id,
        // coupon_id: null,
        image_id: response,
        points: Number(this.couponForm.value.points),
        status: Number(this.couponForm.value.status),
        store_id: this.redeemData.id
      }
      this._appService.putApiWithAuth(`/admin/nukhba-store/update`, data, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.status_code == 200) {
            this._appService.success('Updated Successfully')
            this.dialogRef.close(true);
          }
          else {
            this._appService.error(success.msg)
          }
        },
        error: (error: any) => {
          this._appService.updateLoading(false)
          console.log({ error })
          this._appService.err(error?.error?.msg)
        }
      })

    }
    // }

  }


  getCouponApi = () => {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/coupons/list?is_paginated=false`).subscribe((res: any) => {
      this.couponData = res.data.rows;
      this._appService.hideSpinner()
    });
  };

  closeDialogBox = () => {
    this.dialogRef.close(false)
  }

}
