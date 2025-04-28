import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { CategoryManagementComponent } from 'src/app/category-management/category-management.component';

@Component({
  selector: 'app-add-deal-category',
  templateUrl: './add-deal-category.component.html',
  styleUrls: ['./add-deal-category.component.scss']
})
export class AddDealCategoryComponent {

  sportsType: any = [];
  selectedCategory: any = {};
  submitted: any = false
  formInvalid: any = false
  entity_id: any
  categoryImage: any
  image: any
  categoryForm!: FormGroup;
  imageSize: any;
  constructor(public _appService: AppService,
    private route: Router, private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, public dialogRef: MatDialogRef<CategoryManagementComponent>
  ) {
    this.buildForm()
  }

  ngOnInit(): void {
    this.selectedCategory = this.data.categoryData
    this.entity_id = this.data.categoryData.id
    if (this.data.categoryData.id)
      this.setFormvalues()
  }

  buildForm = () => {
    this.categoryForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      icon: ['', [Validators.required]],
      // type: ['', [Validators.required]],
      status: ['', [Validators.required]]
    })
  }

  onFileSelected(fileInput: any) {
    console.log(fileInput);
    
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
  onInputChange(event:any) {
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

  saveCategory = async () => {
    this._appService.updateLoading(true)
    const response = await this.uploadImage();
    let data = {
      name: this.categoryForm.value.name,
      icon: response,
      type: 'deal',
      status: this.categoryForm.value.status,
    }
    if (this.categoryForm.value.id != '') {
      this._appService.putApiWithAuth(`/admin/categories/${this.data.categoryData.uid}`, data, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.status_code == 200) {
            this._appService.success('Updated Successfully')
            this.route.navigate(['/deal-category/list'])
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
      // const findName = this.data.response.some((element: any) => element.name == this.categoryForm.value.name);
      // if (findName) {
      //   return this._appService.err('Cuisine name already exist');
      // }
      console.log('ee')
      this._appService.postApiWithAuth("/admin/categories", data, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.status_code == 200) {
            this._appService.success('Save Successfully')
            this.route.navigate(['/deal-category/list'])
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
    console.log(this.selectedCategory);
    this.image = this.selectedCategory.icon
    this.categoryForm.patchValue({
      id: this.selectedCategory.id ? this.selectedCategory.id : null,
      name: this.selectedCategory.name ? this.selectedCategory.name : null,
       icon: this.selectedCategory.icon ? this.selectedCategory.icon : null,
      status: this.selectedCategory.status == 1 ? '1' : '0',
    })
  }

  closeDialogBox = () => {
     this.dialogRef.close({'status':'close'})
  }

}
