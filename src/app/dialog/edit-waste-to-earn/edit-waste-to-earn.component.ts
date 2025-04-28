import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { CategoryManagementComponent } from 'src/app/category-management/category-management.component';

@Component({
  selector: 'app-edit-waste-to-earn',
  templateUrl: './edit-waste-to-earn.component.html',
  styleUrls: ['./edit-waste-to-earn.component.scss']
})
export class EditWasteToEarnComponent {
  isValidFormSubmitted: any = false;
  sportsType: any = [];
  selectedCategory: any = {};
  submitted: any = false
  formInvalid: any = false
  entity_id: any
  categoryImage: any
  image: any
  categoryForm!: FormGroup;
  restaurantData: any
  imageSize: any;
  constructor(public _appService: AppService,
    private route: Router, private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, public dialogRef: MatDialogRef<CategoryManagementComponent>
  ) {
    this.buildForm()
  }

  ngOnInit(): void {
    console.log(this.data);
    this.getRestaurantList()
    this.selectedCategory = this.data
    if (this.data)
      this.setFormvalues()
  }

  buildForm = () => {
    this.categoryForm = this.fb.group({
      id: [''],
      title: ['', [Validators.required]],
      icon: ['', [Validators.required]],
      link: ['', [Validators.required]],
      coins: ['', [Validators.required]],
      button_name: ['', [Validators.required]],
      coin_currency: ['', [Validators.required]],
      type: [''],
      res_id: ['']
    })
  }

  onFileSelected(fileInput: any) {
    if (fileInput.target.files.length > 0) {
      const file: File = fileInput.target.files[0]
      this.imageSize = this._appService.formatBytes(file.size);
      this.categoryImage = file
      const reader = new FileReader();
      reader.onload = () => {
        this.image = reader.result as string;
      }
      reader.readAsDataURL(file)
    }
  }

  onInputChange(event: any) {
    const input = event.target.value;
    const withoutSpecialChars = input.replace(/[^\w\s]/gi, ''); // Remove special characters
    if (input !== withoutSpecialChars) {
      console.log(withoutSpecialChars)
      this.categoryForm.get('name')?.setValue(withoutSpecialChars);
    }
  }

  uploadImage() {
    if (this.categoryImage) {
      let formData = new FormData();
      formData.append('file', this.categoryImage)

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

  getRestaurantList = () => {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/merchants/restaurants?is_paginated=false&restaurant_type=approved`).subscribe((res: any) => {
      this.restaurantData = res.data.rows;
      this._appService.hideSpinner()
    });
  };
  update = async () => {
    this._appService.updateLoading(true)
    const response = await this.uploadImage();
    this.isValidFormSubmitted = true;
    let action = this.categoryForm.value.link
    if (this.categoryForm.value.type == 'shareapp') {
      action = 'www.google.com'
    }
    let data = {
      title: this.categoryForm.value.title,
      icon: response,
      action: action,
      coins: this.categoryForm.value.coins,
      button_name: this.categoryForm.value.button_name,
      res_id: this.categoryForm.value.res_id,
      coin_currency: this.categoryForm.value.coin_currency,
      type: this.categoryForm.value.type,
      status: this.data.payload?.[this.data.index]?.status
    }
    if (this.data.id != '' && this.data.id != undefined) {
      Object.assign(data, { id: this.data?.id });
      this._appService.putApiWithAuth(`/admin/ways-to-earn/update`, data, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.status_code == 200) {
            this._appService.success('Updated Successfully')
            this.route.navigate(['/ways/earn'])
            this.dialogRef.close({ event: 'close' });
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
      this._appService.postApiWithAuth("/admin/ways-to-earn/create", data, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.status_code == 200) {
            this._appService.success('Save Successfully')
            this.route.navigate(['/ways/list'])
            this.dialogRef.close({ event: 'close' });
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

  setFormvalues = () => {
    const params = new URLSearchParams(this.selectedCategory.action);
    const res_id = params.get("res_id");
    this.image = this.selectedCategory.icon
    this.categoryForm.patchValue({
      id: this.selectedCategory.id ? this.selectedCategory.id : null,
      title: this.selectedCategory.title ? this.selectedCategory.title : null,
      button_name: this.selectedCategory.button_name ? this.selectedCategory.button_name : null,
      coins: this.selectedCategory.coins ? this.selectedCategory.coins : null,
      link: this.selectedCategory.action ? this.selectedCategory.action : null,
      coin_currency: this.selectedCategory.coin_currency ? this.selectedCategory.coin_currency : null,
      type: this.selectedCategory.type ? this.selectedCategory.type : null,
      res_id: res_id ? res_id : null,
    })
  }

  closeDialogBox = () => {
    this.dialogRef.close({ 'status': 'close' })
  }

}
