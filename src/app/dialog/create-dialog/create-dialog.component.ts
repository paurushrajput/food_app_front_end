import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { CampaignandnotificationManagementComponent } from 'src/app/campaignandnotification-management/campaignandnotification-management.component';
import { Component, ElementRef, Inject, Optional, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidationErrors, ValidatorFn, AbstractControl, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { MatDateRangePicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-create-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrls: ['./create-dialog.component.scss']
})
export class CreateDialogComponent {
  couponData: any
  campaignData: any
  userList: any
  selectedDialog: any = {};
  dialogImage: any
  submitted: any = false
  formInvalid: any = false
  entity_id: any
  restaurantData: any;
  image: any
  dialogForm!: FormGroup;
  imageSize: any;
  dealData: any
  constructor(public _appService: AppService,
    private route: Router, private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, public dialogRef: MatDialogRef<CampaignandnotificationManagementComponent>
  ) {
    this.buildForm()
  }

  @ViewChild('datetimePicker') datetimePicker: MatDateRangePicker<any> | undefined;
  @ViewChild('dateEndtimePicker') dateEndtimePicker: MatDateRangePicker<any> | undefined;
  // @ViewChild('dp1') dp1: MatDateRangePicker<any> | undefined;
  // @ViewChild('dp2') dp2: MatDateRangePicker<any> | undefined;
  @ViewChild('startInput') startInput: ElementRef | undefined;
  @ViewChild('endInput') endInput: ElementRef | undefined;
  // @ViewChild('startInput1') startInput1: ElementRef | undefined;
  // @ViewChild('endInput1') endInput1: ElementRef | undefined;

  ngAfterViewInit(): void {
    this.startInput?.nativeElement.addEventListener('click', () => this.datetimePicker?.open());
    this.endInput?.nativeElement.addEventListener('click', () => this.dateEndtimePicker?.open());
    // this.startInput1?.nativeElement.addEventListener('click', () => this.dp1?.open());
    // this.endInput1?.nativeElement.addEventListener('click', () => this.dp2?.open());
  }

  ngOnInit(): void {
    this.getCampaignList()
    this.getCouponList()
    this.getDealList()
    this.getRestaurantList()
    this.selectedDialog = this.data?.dialogData
    this.dialogForm.get('user_type')?.setValue(this.data?.status);
    this.updateValidators(this.dialogForm.get('action_type')?.value);
    console.log(this.selectedDialog);
    
    if (this.selectedDialog?.id) {
      this.setFormvalues()
      this.dialogForm.get('user_type')?.setValue(this.selectedDialog?.user_type.toString());
    }

  }

  buildForm = () => {
    this.dialogForm = this.fb.group({
      id: [''],
      title: [''],
      start_time: [''],
      end_time: [''],
      action_type: ['', [Validators.required]],
      user_type: ['', [Validators.required]],
      res_id: [''],
      action: [''],
      message: [''],
      user_id: [''],
      button_name: [''],
      campaign_id: [''],
      coupon_id: [''],
      on_boarding_start: [''],
      on_boarding_end: [''],
      is_coupon_used: ['0'],
      type: ['Dialog'],
      is_close: [''],
      image: ['', Validators.required],
      deal_id: [''],
    }, { validator: this.atLeastOneFieldRequired('is_close', 'button_name') })
    // Watch for changes to the action_type field
    this.dialogForm.get('action_type')?.valueChanges.subscribe(value => {
      this.updateValidators(value);
    });
  }
  atLeastOneFieldRequired(field1: string, field2: string) {
    return (formGroup: FormGroup) => {
      const control1 = formGroup.get(field1);
      const control2 = formGroup.get(field2);

      if (!control1 || !control2) {
        return null;
      }

      if (!control1.value && !control2.value) {
        control1.setErrors({ atLeastOneRequired: true });
        control2.setErrors({ atLeastOneRequired: true });
      } else {
        control1.setErrors(null);
        control2.setErrors(null);
      }

      return null;
    };
  }

  private updateValidators(actionType: string): void {
    const actionControl = this.dialogForm.get('action');
    // const dealIdControl = this.dialogForm.get('deal_id');
    const resIdControl = this.dialogForm.get('res_id');

    // Reset validators
    actionControl?.clearValidators();
    // dealIdControl?.clearValidators();
    resIdControl?.clearValidators();

    // Apply validators based on actionType value
    if (actionType === '4') {
      actionControl?.setValidators([Validators.required]);
    } else if (actionType === '1') {
      resIdControl?.setValidators([Validators.required]);
    }

    // Update validation status
    actionControl?.updateValueAndValidity();
    // dealIdControl?.updateValueAndValidity();
    resIdControl?.updateValueAndValidity();
  }
  getRestaurantList = () => {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/merchants/restaurants?is_paginated=false&restaurant_type=approved`).subscribe((res: any) => {
      this.restaurantData = res.data.rows;
      this._appService.hideSpinner()
    });
  };


  getDealList = () => {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/deal/list?is_paginated=false&status=1`).subscribe((res: any) => {
      this.dealData = res.data.rows;
      this._appService.hideSpinner()
    });
  };

  getCouponList = () => {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/coupons/list?is_paginated=false&is_expired=0&is_deleted=0`).subscribe((res: any) => {
      this.couponData = res.data.rows;
      this._appService.hideSpinner()
    });
  };

  isHighlighted(type: any): boolean {
    if (type) {
      return type.is_pilot == 1 ? true : false
    } else {
      return false
    }
  }

  getCampaignList = () => {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/campaign/get?is_paginated=false&is_expired=0`).subscribe((res: any) => {
      this.campaignData = res.data.rows;
      this._appService.hideSpinner()
    });
  };

  onFileSelected(fileInput: any) {
    console.log(fileInput);

    if (fileInput.target.files.length > 0) {
      const file: File = fileInput.target.files[0]
      this.imageSize = this._appService.formatBytes(file.size);
      this.dialogImage = file
      const reader = new FileReader();
      reader.onload = () => {
        this.image = reader.result as string;
      }
      reader.readAsDataURL(file)
    }
  }

  uploadImage() {
  
    if (this.dialogImage) {
      let formData = new FormData();
      formData.append('file', this.dialogImage)

      var promise = new Promise((resolve, reject) => {
        this._appService.postApiWithAuthentication(`/admin/media/image`, formData, 1).subscribe({
          next:
            (success: any) => {
              if (success.success == true) {
                // this._appService.success('Image upload successfully')
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

  saveDialog = async () => {
    this.submitted = true
    console.log(this.dialogForm.controls)
    Object.keys(this.dialogForm.controls).forEach(field => {
      const control = this.dialogForm.get(field);
      if (control && control.invalid) {
        console.log(`Field '${field}' is invalid.`, control.errors);
      }
    });
    if (this.dialogForm.invalid) {
      return
    }
    const response = await this.uploadImage();
    let data = {
      "title": this.dialogForm.value.title,
      "image": response,
      "is_close": this.dialogForm.value.is_close,
      "message": this.dialogForm.value.message,
      "action": this.dialogForm.value.action,
      "action_type": Number(this.dialogForm.value.action_type),
      "user_type": Number(this.dialogForm.value.user_type),
      'button_name': this.dialogForm.value.button_name,
      'deal_id': this.dialogForm.value.deal_id ? this.dialogForm.value.deal_id : '',
      'type': this.dialogForm.value.type == 'Dialog' ? 1 : 2
    }
    if (this.dialogForm.value.type != 'Notification') {
      Object.assign(data, { 'start_time': this.dialogForm.value.start_time != '' && this.dialogForm.value.start_time ? this.dialogForm.value.start_time.getTime() / 1000 : '' });
      Object.assign(data, { 'end_time': this.dialogForm.value.end_time != '' && this.dialogForm.value.end_time ? this.dialogForm.value.end_time.getTime() / 1000 : '' });
    }
    if (this.dialogForm.value.action_type == 1) {
      Object.assign(data, { 'res_id': [this.dialogForm.value.res_id] });
    }

    if (this.dialogForm.value.user_type == '0' && this.dialogForm.value.campaign_id != '' || this.dialogForm.value.coupon_id != '') {
      Object.assign(data, { 'campaign_id': this.dialogForm.value.campaign_id });
      Object.assign(data, { 'coupon_id': this.dialogForm.value.coupon_id });
      Object.assign(data, { 'is_coupon_used': Number(this.dialogForm.value.is_coupon_used) });
      Object.assign(data, { 'on_boarding_start': (this.dialogForm.value.on_boarding_start) != '' && (this.dialogForm.value.on_boarding_start) ? moment(this.dialogForm.value.on_boarding_start).format('YYYY-MM-DD') : '' });
      Object.assign(data, { 'on_boarding_end': (this.dialogForm.value.on_boarding_end) != '' && (this.dialogForm.value.on_boarding_end) ? moment(this.dialogForm.value.on_boarding_end).format('YYYY-MM-DD') : '' });
    }
    if (this.dialogForm.value.user_type == '0' && this.dialogForm.value.on_boarding_start != '' && this.dialogForm.value.on_boarding_end != '') {
      Object.assign(data, { 'on_boarding_start': (this.dialogForm.value.on_boarding_start) != '' && (this.dialogForm.value.on_boarding_start) ? moment(this.dialogForm.value.on_boarding_start).format('YYYY-MM-DD') : '' });
      Object.assign(data, { 'on_boarding_end': (this.dialogForm.value.on_boarding_end) != '' && (this.dialogForm.value.on_boarding_end) ? moment(this.dialogForm.value.on_boarding_end).format('YYYY-MM-DD') : '' });
    }
    if (this.dialogForm.value.user_type == '0' && this.dialogForm.value.campaign_id == '' && this.dialogForm.value.coupon_id == '' && this.dialogForm.value.on_boarding_start == '' && this.dialogForm.value.on_boarding_end == '') {
      Object.assign(data, { 'user_ids': [this.selectedDialog.id] });
    }
    if (this.dialogForm.value.action_type == 3) {
      data["action"] = 'www.google.com';
    }
    // if (this.dialogForm.value.id != '') {
    //   Object.assign(data, { 'id': this.selectedDialog.id });
    //   this._appService.putApiWithAuth(`/admin/dialog/update`, data, 1).subscribe({
    //     next: (success: any) => {
    //       if (success.status_code == 200) {
    //         this._appService.success('Updated Successfully')
    //         this.dialogRef.close({ event: 'close' });
    //       }
    //       else {
    //         this._appService.error(success.msg)
    //       }
    //     },
    //     error: (error: any) => {
    //       console.log({ error })
    //       this._appService.err(error?.error?.msg)
    //     }
    //   })
    // }
    // else {
    this._appService.postApiWithAuth("/admin/dialog/add", data, 1).subscribe({
      next: (success: any) => {
        this.submitted = false
        if (success.status_code == 200) {

          this._appService.success(success.msg)
          this.dialogRef.close({ event: 'close' });
        }
        else {
          this._appService.error(success.msg)
        }
      },
      error: (error: any) => {
        console.log({ error })
        this._appService.err(error?.error?.msg)
      }
    })
    // }
  }

  resetForm() {
    this.dialogForm.patchValue({
      title: '',
      start_time: '',
      end_time: '',
      action_type: '',
      res_id: '',
      action: '',
      message: '',
      user_id: '',
      button_name: '',
      campaign_id: '',
      coupon_id: '',
      on_boarding_start: '',
      on_boarding_end: '',
      is_close:""
      // is_coupon_used: ''
    });
    // this.dialogForm.reset()
    this.dialogImage=""
    this.image=""
    this.imageSize=""
  }
  setFormvalues = () => {
    this.image=this.selectedDialog.image
    this.dialogForm.patchValue({
      id: this.selectedDialog.id ? this.selectedDialog.id : null,
      title: this.selectedDialog.title ? this.selectedDialog.title : null,
      start_time:this.selectedDialog.start_time? new Date(this.selectedDialog.start_time * 1000):"",
      end_time: this.selectedDialog.end_time?new Date(this.selectedDialog.end_time * 1000):"",
      action_type: this.selectedDialog?.details?.action_type ? this.selectedDialog?.details?.action_type.toString() : null,
      user_type: this.selectedDialog.user_type ? this.selectedDialog.user_type.toString() : null,
      res_id: this.selectedDialog.res_id ? this.selectedDialog.res_id : null,
      action: this.selectedDialog?.details?.action ? this.selectedDialog?.details?.action : null,
      message: this.selectedDialog.message ? this.selectedDialog.message : null,
      is_close: this.selectedDialog.is_close ? this.selectedDialog.is_close.toString() : null,
      type: this.selectedDialog.type ? this.selectedDialog.type == '1' ? 'Dialog' : 'Notification' : null,
    })
  }

  closeDialogBox = () => {
    this.dialogRef.close({ event: 'close' });
  }

}
