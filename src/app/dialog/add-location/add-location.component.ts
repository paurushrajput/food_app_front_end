import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { LocationManagementComponent } from 'src/app/location-management/location-management.component';
import { AddMediaComponent } from '../add-media/add-media.component';
@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss']
})
export class AddLocationComponent {
  submitted: any = false
  formInvalid: any = false
  selectedLocation: any = {};
  entity_id: any
  countryData: any
  locationImage: any
  image: any
  cityData: any
  locationForm!: FormGroup;
  imageSize: any;
  imageData: any;
  constructor(public _appService: AppService,
    private route: Router, private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, public dialogRef: MatDialogRef<LocationManagementComponent>
  ) {
    this.buildForm()
  }

  ngOnInit(): void {
    // this.getCountryData()
    this.selectedLocation = this.data.locationData
    this.entity_id = this.data.locationData.id
    let data = {
      value: this.data.locationData?.country_id ? this.data.locationData.country_id : "231"
    }
    if (this.entity_id) {
      this.setFormvalues()
    }
    // if (data)
    //   this.getCityData(data)
  }

  getCountryData = () => {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/list-countries`).subscribe((res: any) => {
      this.countryData = res.data;
      this._appService.hideSpinner()
    });
  };

  getCityData = (data: any) => {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/cities/${data.value}?is_paginated=false`).subscribe((res: any) => {
      this.cityData = res.data.rows;
      this._appService.hideSpinner()
    });
  };

  buildForm = () => {
    this.locationForm = this.fb.group({
      uid: [''],
      name: ['', [Validators.required]],
      icon: ['',[Validators.required]],
      country_id: [231],
      city_id: [32],
      operational: [1],
      status: ['']
    })
  }

  onFileSelected(fileInput: any) {
    // if (fileInput.target.files.length > 0) {
    //   const file: File = fileInput.target.files[0]
    //   this.imageSize = this._appService.formatBytes(file.size);
    //   this.locationImage = file
    //   const reader = new FileReader();
    //   reader.onload = () => {
    //     this.image = reader.result as string;
    //   }
    //   reader.readAsDataURL(file)
    // }
    const dialogRef = this.dialog.open(AddMediaComponent, {
      hasBackdrop: false,
      width: '800px',
      // height: '80px',
      data: {
        selectImage:true,
        preselectedItemId: this.image ? this.image : "",
        multiple:false,
        type:"location"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.status}`);
      if (result && result.status) {
        console.log(result)
        this.imageData=result.value
      this.image=result.value.image
      this.locationForm.patchValue({icon:result.value.id})     }
    });
    
  }
  onInputChange(event:any) {
    const input = event.target.value;
    const withoutSpecialChars = input.replace(/[^\w\s]/gi, ''); // Remove special characters
    if (input !== withoutSpecialChars) {
      console.log(withoutSpecialChars)
      this.locationForm.get('name')?.setValue(withoutSpecialChars);
    }
  }

  uploadImage() {
    if (this.locationImage) {
      let formData = new FormData();
      formData.append('file', this.locationImage)
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

  saveLocation = async () => {
    this._appService.updateLoading(true)
    // const response = await this.uploadImage()
    const response = this.imageData?this.imageData.id:"";
    let data = {
      name: this.locationForm.value.name,
      icon: response,
      city_id: this.locationForm.value.city_id?Number(this.locationForm.value.city_id):32,
      country_id: this.locationForm.value.country_id ? this.locationForm.value.country_id : 231,
      operational: Number(this.locationForm.value.operational),
      status: this.locationForm.value.status,
    }
    if (this.data.locationData?.uid) {
      this._appService.putApiWithAuth(`/admin/location/${this.data.locationData.uid}`, data, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.success) {
            this._appService.success('Updated Successfully')
            this.route.navigate(['/location/list'])
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
    else {
      this._appService.postApiWithAuth("/admin/location", data, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.success) {
            this._appService.success('Save Successfully')
            this.route.navigate(['/location/list'])
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
    console.log(this.selectedLocation);
    
    this.image = this.selectedLocation.icon
    this.locationForm.patchValue({
      uid: this.selectedLocation.uid ? this.selectedLocation.uid : null,
      name: this.selectedLocation.name ? this.selectedLocation.name : null,
       icon: this.selectedLocation.icon ? this.selectedLocation.icon : null,
      operational: this.selectedLocation.operational ? this.selectedLocation.operational.toString() : null,
      country_id: this.selectedLocation.country_id ? this.selectedLocation.country_id.toString() : null,
      city_id: this.selectedLocation.city_id ? this.selectedLocation.city_id.toString() : null,
      status: this.selectedLocation.status == 1 ? '1' : '0',
    })
  }

  closeDialogBox = () => {
    this.dialogRef.close({'status':'close'})
  }

}
