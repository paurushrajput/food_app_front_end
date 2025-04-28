
import { Component, ElementRef, Inject, Optional, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidationErrors, ValidatorFn, AbstractControl, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';

import { CouponManagementComponent } from '../coupon-management/coupon-management.component';
import { MatDateRangePicker } from '@angular/material/datepicker';
@Component({
  selector: 'app-add-coupon',
  templateUrl: './add-coupon.component.html',
  styleUrls: ['./add-coupon.component.scss']
})
export class AddCouponComponent {

  couponData: any = {};
  submitted: any = false
  formInvalid: any = false
  couponForm!: FormGroup;
  isEditMode: boolean = true;
  organisationData: any = [];
  userList: any;
  constructor(
    private fb: FormBuilder, private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CouponManagementComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, public _appService: AppService
  ) { }

  @ViewChild('datetimePicker') datetimePicker: MatDateRangePicker<any> | undefined;
  @ViewChild('startInput') startInput: ElementRef | undefined;
  @ViewChild('endInput') endInput: ElementRef | undefined;
  ngAfterViewInit(): void {
    this.startInput?.nativeElement.addEventListener('click', () => this.datetimePicker?.open());
  }

  ngOnInit(): void {
    this.couponData = this.data?.couponData;
    this.getOrganisationList()
    this.getUserList()
    this.isEditMode = !!this.couponData;

    this.buildForm();
    this.couponForm.get('type')?.valueChanges.subscribe(value => {
      this.updateValidators(value);
    });
    if (this.isEditMode) {
      this.setFormValues();
    }
  }

  buildForm(): void {
    this.couponForm = this.formBuilder.group({
      coupon_code: ['', Validators.required],
      discount_type: ['', Validators.required],
      type: ['', Validators.required],
      discount: ['', Validators.required],
      max_discount: ['', Validators.required],
      min_use: ['', Validators.required],
      max_use: ['', Validators.required],
      override_coupon_code: [''],
      uses_per_user: ['', Validators.required],
      expiration_at: [''],
      description: ['', Validators.required],
      expiration: ['', Validators.required],
      organization_id: [''],
      user_id: [''],
      rules: this.fb.array([]),
    }, { validator: this.discountValidation });
    this.addRules()

  }
  removeRule(index: number) {
    this.rulesArray.removeAt(index);
  }
  addRules() {
    this.rulesArray.push(this.formBuilder.control('', Validators.required));
  }
  get rulesArray() {
    return this.couponForm.get('rules') as FormArray;
  }
  updateValidators(selectedType: string): void {
    const organizationIdControl = this.couponForm.get('organization_id');
    const userIdControl = this.couponForm.get('user_id');

    if (selectedType === '1') {
      organizationIdControl?.setValidators(Validators.required);
      userIdControl?.clearValidators();
      this.couponForm.patchValue({ 'user_id': "" })
    } else if (selectedType === '3') {
      userIdControl?.setValidators(Validators.required);
      organizationIdControl?.clearValidators();
      this.couponForm.patchValue({ 'organization_id': "" })
    } else {
      organizationIdControl?.clearValidators();
      userIdControl?.clearValidators();
      this.couponForm.patchValue({ 'user_id': "" })
      this.couponForm.patchValue({ 'organization_id': "" })
    }

    // Update the validity of the controls
    organizationIdControl?.updateValueAndValidity();
    userIdControl?.updateValueAndValidity();
  }

  get f() { return this.couponForm.controls; }
  onCheckboxChange(event: any) {
    this.couponForm.get('override_coupon_code')?.setValue(event.target.checked);
  }

  toggleOverrideCouponCode(event: any) {
    if (event.checked) {
      this.couponForm.get('override_coupon_code')?.setValue(true);
    } else {
      this.couponForm.get('override_coupon_code')?.setValue(false);
    }
  }
  discountValidation(group: FormGroup): ValidationErrors | null {
    const discountControl = group.get('discount');
    const maxDiscountControl = group.get('max_discount');

    if (discountControl && maxDiscountControl) {
      const discount = discountControl.value;
      const maxDiscount = maxDiscountControl.value;

      if (discount > maxDiscount) {
        return { invalidDiscount: true };
      }
    }

    return null;
  }
  getOrganisationList() {

    this._appService.getApiWithAuth(`/admin/organizations/list`).subscribe({
      next: (success: any) => {
        if (success.status_code == 200) {
          console.log(success)
          this.organisationData = success.data.rows
        }

      },
      error: (error: any) => {
        console.log({ error })
      }
    })
  }
  filterKeyword: string = '';
  filteredUserList: any[] = [];


  // Call this function when the filter keyword changes
  onFilterChange($event: any) {
    // Filter the user list based on the keyword
    this.getUserList($event.target.value.toLowerCase())
  }
  getUserList(keyword: any = '') {
    this._appService.getApiWithAuth(`/admin/users/list?is_paginated=false&status=1&page=1&page_size=10&search=${keyword}`).subscribe((res: any) => {
      this.userList = res.data?.rows
      this.sortArray();
    },
      (error) => {
      })
  }
  sortArray() {
    this.userList.sort((a: any, b: any) => {
      // Compare the 'name' property of the objects
      return a.first_name.localeCompare(b.first_name);
    });
  }
  getTypesValue(value: any) {
    if (value == 'global') {
      return '2'
    } else if (value == 'organization') {
      return '1'
    }
    else if (value == 'agent') {
      return '6'
    }
    else if (value == 'campaign') {
      return '5'
    } else if (value == 'referral') {
      return '7'
    }
    else if (value == 'store') {
      return '4'
    }
    else
      return '3'
  }
  setFormValues(): void {
    console.log(this.couponData)
    this.couponForm.patchValue({
      uses_per_user: this.couponData.uses_per_user,
      organization_id: this.couponData?.organization_id,
      coupon_code: this.couponData.coupon_code,
      discount: this.couponData.discount,
      discount_type: this.couponData.discount_type.toLowerCase(),
      max_discount: this.couponData.max_discount,
      min_use: this.couponData.min_use,
      max_use: this.couponData.max_use,
      description: this.couponData.description,
      expiration: new Date(this.couponData.expiration_at * 1000),
      type: this.getTypesValue(this.couponData.type),
      user_id: this.couponData?.user_id,
      override_coupon_code: this.couponData.override_coupon_code
    });
    while (this.rulesArray.length !== 0) {
      this.removeRule(0);
    }

    // Add new rules
    for (const rule of this.couponData.rules) {
      this.addRules();
      this.rulesArray.at(this.rulesArray.length - 1).patchValue(rule); // Patch value for each rule
    }
  }


  saveCategory = async () => {
    //this.couponForm.value.expiration_at= Math.floor(new Date(this.couponForm.expiration.value).getTime()/1000)
    this.couponForm.patchValue({ expiration_at: Math.floor(new Date(this.couponForm.value.expiration).getTime() / 1000) })
    if (this.couponForm.valid) {
      const formData = this.couponForm.value;
      this._appService.updateLoading(true)
      if (!this.isEditMode) {
        this._appService.postApiWithAuth(`/admin/coupons/add`, formData, 1).subscribe({
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
            console.log({ error })
            this._appService.updateLoading(false)
            this._appService.err(error?.error?.msg)

          }
        })
      } else {
        formData.coupon_id = this.couponData.id;
        this._appService.putApiWithAuth(`/admin/coupons/update`, formData, 1).subscribe({
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
    }

  }



  closeDialogBox = () => {
    this.dialogRef.close(false)
  }

}
