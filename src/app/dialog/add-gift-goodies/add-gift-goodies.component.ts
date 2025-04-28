import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { CategoryManagementComponent } from 'src/app/category-management/category-management.component';
import { AddMediaComponent } from '../add-media/add-media.component';

@Component({
  selector: 'app-add-gift-goodies',
  templateUrl: './add-gift-goodies.component.html',
  styleUrls: ['./add-gift-goodies.component.scss']
})
export class AddGiftGoodiesComponent {
  termsData: any = []
  imageURL: any = [];
  imageData: any = [];
  tournamentImage: any[] = [];

  isValidFormSubmitted: any = false;
  sportsType: any = [];
  selectedCategory: any = {};
  submitted: any = false
  formInvalid: any = false
  entity_id: any
  categoryImage: any
  image: any
  categoryForm!: FormGroup;
  couponData: any
  imageSize: any;
  formBuilder: any;
  constructor(public _appService: AppService,
    private route: Router, private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, public dialogRef: MatDialogRef<CategoryManagementComponent>
  ) {
    this.buildForm()
  }

  ngOnInit(): void {
    this.getCouponList()
    this.selectedCategory = this.data
    this.termsData = this.data?.details?.terms_and_conditions || []
    if (this.data)
      this.setFormvalues()
  }

  buildForm = () => {
    this.categoryForm = this.fb.group({
      id: [''],
      title: ['', [Validators.required]],
      image_id: ['', [Validators.required]],
      description: ['', [Validators.required]],
      points: ['', [Validators.required]],
      type: [''],
      coupon_id: [''],
      status: [''],
      terms_and_conditions: this.fb.array([]),
    })
  }


  get termsArray() {
    return this.categoryForm.get('terms_and_conditions') as FormArray;
  }
  removeRule(index: number) {
    this.termsArray.removeAt(index);
  }
  addRules() {
    this.termsArray.push(this.fb.control('', Validators.required));
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

  getCouponList = () => {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/coupons/list?is_paginated=false&status=1&is_deleted=0&type=4`).subscribe((res: any) => {
      this.couponData = res.data.rows;
      this._appService.hideSpinner()
    });
  };

  removeImagesArr: any = []

  removeImage(index: number, element: any) {
    if (!this.categoryForm.value.id) {
      this.imageSize -= this.tournamentImage[index].size;
    } else {
      this.removeImagesArr?.push(this.selectedCategory.image_arr.find((image: any) => image.url === element).uid)
    }
    this.tournamentImage.splice(index, 1);
    this.imageURL.splice(index, 1);
  }

  update = async () => {
    let imageBannerIds = this.imageData.length > 0 ? this.imageData?.map((item: any) => item.id) : [];
    if (this.selectedCategory.id && this.selectedCategory?.images.length > 0) {
      // imageBannerIds = imageBannerIds?.concat(this.selectedDeal.image_arr.map((image: any) => image.uid));
      if (imageBannerIds.length > 0) {
        imageBannerIds = imageBannerIds?.reduce((unique: any[], id: any) => {
          if (!unique.includes(id)) {
            unique.push(id); // Add to the array only if it's not already there
          }
          return unique;
        }, []);
      }

    }
    if (this.removeImagesArr.length > 0) {
      imageBannerIds = imageBannerIds.filter((id: any) => !this.removeImagesArr.includes(id));
    }
    this._appService.updateLoading(true)
    const response = await this.uploadImage();
    this.isValidFormSubmitted = true;
    let data = {
      title: this.categoryForm.value.title,
      // image_id: response,
      points: this.categoryForm.value.points,
      description: this.categoryForm.value.description,
      coupon_id: this.categoryForm.value.coupon_id,
      type: this.categoryForm.value.type,
      status: 1,
      terms_and_conditions: this.categoryForm.value.terms_and_conditions
    }
    if (imageBannerIds.length > 0) {
      Object.assign(data, { image_id: imageBannerIds });
    }
    if (this.data.id != '' && this.data.id != undefined) {
      Object.assign(data, { store_id: this.data?.id });
      this._appService.putApiWithAuth(`/admin/nukhba-store/update`, data, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.status_code == 200) {
            this._appService.success('Updated Successfully')
            this.route.navigate(['/gift-goodies/list'])
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
      this._appService.postApiWithAuth("/admin/nukhba-store/add", data, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.status_code == 200) {
            this._appService.success('Save Successfully')
            this.route.navigate(['/gift-goodies/list'])
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



  onFileSelectedv2(fileInput: any) {

    const dialogRef = this.dialog.open(AddMediaComponent, {
      hasBackdrop: false,
      width: '800px',
      // height: '80px',
      data: {
        selectImage: true,
        preselectedItemId: this.imageURL.length > 0 ? this.imageURL : "",
        type: "deals",
        multiple: true
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result && result.status) {
        this.imageData = result.value
        this.imageURL = this.imageData.map((item: any) => item.image);
        // console.log(this.imageData )
      }
    });

  }

  setFormvalues = () => {
    console.log(this.termsData);
    if (this.selectedCategory.images) {
      let allImage = this.selectedCategory.images
      const urls = allImage.map((obj:any) => obj.image);
      this.imageURL = urls;
    }
    for (const rule of this.termsData) {
      this.addRules();
      this.termsArray.at(this.termsArray.length - 1).patchValue(rule); // Patch value for each rule
    }
    this.categoryForm.patchValue({
      id: this.selectedCategory.id ? this.selectedCategory.id : null,
      title: this.selectedCategory.title ? this.selectedCategory.title : null,
      description: this.selectedCategory.description ? this.selectedCategory.description : null,
      points: this.selectedCategory.points ? this.selectedCategory.points : null,
      coupon_id: this.selectedCategory.coupon_id ? this.selectedCategory.coupon_id : null,
      type: this.selectedCategory.type ? this.selectedCategory.type == 'coupon' ? '1' : '2' : null,
    })
  }

  closeDialogBox = () => {
    this.dialogRef.close({ 'status': 'close' })
  }

}
