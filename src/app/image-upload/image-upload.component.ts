import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { CategoryManagementComponent } from '../category-management/category-management.component';
import { ViewImageUrlComponent } from '../dialog/view-image-url/view-image-url.component';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent {



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
  }

  buildForm = () => {
    this.categoryForm = this.fb.group({
      icon: ['', [Validators.required]],
    })
  }


  closeDialogBox = () => {
    this.dialogRef.close({ 'status': 'close' })
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
  uploadImage() {
    if (this.categoryImage) {
      let formData = new FormData();
      formData.append('file', this.categoryImage)
      var promise = new Promise((resolve, reject) => {
        this._appService.postApiWithAuthentication(`/admin/media/image`, formData, 1).subscribe({
          next:
            (success: any) => {
              if (success.success == true) {
                this.viewUrl(success.data?.url)
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


  viewUrl(url: any) {
    const dialogRef = this.dialog.open(ViewImageUrlComponent, {
      hasBackdrop: false,
      width: '900px',
      data: url
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
