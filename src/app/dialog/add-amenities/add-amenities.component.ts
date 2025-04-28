import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { CategoryManagementComponent } from 'src/app/category-management/category-management.component';
import { AddMediaComponent } from '../add-media/add-media.component';

@Component({
  selector: 'app-add-amenities',
  templateUrl: './add-amenities.component.html',
  styleUrls: ['./add-amenities.component.scss']
})
export class AddAmenitiesComponent {

  sportsType: any = [];
  selectedAmenities: any = {};
  submitted: any = false
  formInvalid: any = false
  entity_id: any
  categoryImage: any
  image: any
  amenitiesForm!: FormGroup;
  imageSize: any;
  imageData: any="";
  constructor(public _appService: AppService,
    private route: Router, private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, public dialogRef: MatDialogRef<CategoryManagementComponent>
  ) {
    this.buildForm()
  }

  ngOnInit(): void {
    this.selectedAmenities = this.data.amenitiesData
    this.entity_id = this.data.amenitiesData.id
    if (this.data.amenitiesData.id)
      this.setFormvalues()
  }

  buildForm = () => {
    this.amenitiesForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      icon: ['', [Validators.required]],
      status: ['']
    })
  }

  onFileSelected(fileInput: any) {
    // if (fileInput.target.files.length > 0) {
    //   const file: File = fileInput.target.files[0]
    //   this.imageSize = this._appService.formatBytes(file.size);
    //   this.categoryImage = file
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
        type:"amenities"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.status}`);
      if (result && result.status) {
        console.log(result)
        this.imageData=result.value
      this.image=result.value.image
      this.amenitiesForm.patchValue({icon:this.image})
      }
    });
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
  onInputChange(event:any) {
    const input = event.target.value;
    const withoutSpecialChars = input.replace(/[^\w\s]/gi, ''); // Remove special characters
    if (input !== withoutSpecialChars) {
      console.log(withoutSpecialChars)
      this.amenitiesForm.get('name')?.setValue(withoutSpecialChars);
    }
  }
  saveCategory = async () => {
    this._appService.updateLoading(true)
    const response = this.imageData?this.imageData.id:""
    if (this.amenitiesForm.value.id != '') {
      console.log(response);
      let data
      if (response) {
        data = {
          name: this.amenitiesForm.value.name,
          icon: response,
          status: this.amenitiesForm.value.status,
          id: this.data?.amenitiesData?.id,
        }
      } else {
        data = {
          name: this.amenitiesForm.value.name,
          // icon: response,
          status: this.amenitiesForm.value.status,
          id: this.data?.amenitiesData?.id,
        }
      }
      this._appService.putApiWithAuth(`/admin/amenities/update`, data, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.status_code == 200) {
            this._appService.success(success.msg)
            this.route.navigate(['/amenities/list'])
            this.dialogRef.close({ event: 'close' });
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
      console.log('ee')
      let data = {
        name: this.amenitiesForm.value.name,
        icon: response,
        status: this.amenitiesForm.value.status,
      }
      this._appService.postApiWithAuth("/admin/amenities/add", data, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.status_code == 200) {
            this._appService.success(success.msg)
            this.route.navigate(['/amenities/list'])
            this.dialogRef.close({ event: 'close' });
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
    }

  }

  setFormvalues = () => {
    console.log(this.selectedAmenities);
    this.image = this.selectedAmenities.icon
    this.amenitiesForm.patchValue({
      id: this.selectedAmenities.id ? this.selectedAmenities.id : null,
      name: this.selectedAmenities.name ? this.selectedAmenities.name : null,
      type: this.selectedAmenities.type ? this.selectedAmenities.type : null,
      status: this.selectedAmenities.status == 1 ? '1' : '0',
      icon: this.selectedAmenities.icon ? this.selectedAmenities.icon : null,
    })
  }

  closeDialogBox = () => {
    this.dialogRef.close({'status':'close'})
  }

}
