import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { NotificationTemplateComponent } from '../notification-template/notification-template.component';

@Component({
  selector: 'app-add-notification-template',
  templateUrl: './add-notification-template.component.html',
  styleUrls: ['./add-notification-template.component.scss']
})
export class AddNotificationTemplateComponent {

  selectedTemplate: any = {};
  submitted: any = false
  formInvalid: any = false
  entity_id: any
  templateImage: any
  image: any
  notiForm!: FormGroup;
  imageSize: any;
  constructor(public _appService: AppService,
    private route: Router, private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, public dialogRef: MatDialogRef<NotificationTemplateComponent>
  ) {
    this.buildForm()
  }

  ngOnInit(): void {
    console.log(this.data);

    this.selectedTemplate = this.data.templateData
    this.entity_id = this.data?.templateData?.uid
    if (this.data?.templateData?.uid)
      this.setFormvalues()
  }

  buildForm = () => {
    this.notiForm = this.fb.group({
      id: [''],
      title: ['', [Validators.required]],
      message: [''],
      image_id: ['',[Validators.required]],
      other_details: ['']
    })
  }

  onFileSelected(fileInput: any) {
    console.log(fileInput);
    if (fileInput.target.files.length > 0) {
      const file: File = fileInput.target.files[0]
      this.imageSize = this._appService.formatBytes(file.size);
      this.templateImage = file
      const reader = new FileReader();
      reader.onload = () => {
        this.image = reader.result as string;
      }
      reader.readAsDataURL(file)
    }
  }

  uploadImage() {
    if (this.templateImage) {
      let formData = new FormData();
      formData.append('file', this.templateImage)
      var promise = new Promise((resolve, reject) => {
        this._appService.postApiWithAuthentication(`/admin/media/image`, formData, 1).subscribe({
          next:
            (success: any) => {
              if (success.success == true) {
                console.log('22222222');

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
    const response = await this.uploadImage();
    if (this.selectedTemplate.uid != '') {
      let data = {
        template_id: this.selectedTemplate.uid,
        keyword: this.notiForm.value.title.replace(/ /g, "_").toLowerCase(),
        image_id: response,
        title: this.notiForm.value.title,
        message: this.notiForm.value.message,
        other_details: JSON.parse(this.notiForm.value.other_details)
      }
      this._appService.updateLoading(true)
      this._appService.putApiWithAuth(`/admin/notification-template/update`, data, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.status_code == 200) {
            this._appService.success('Updated Successfully')
            this.dialogRef.close({ event: 'close' });
          }
          else {
            this._appService.error(success.msg)
          }
        },
        error: (error: any) => {
          this._appService.updateLoading(false)
          console.log({ error })
        }
      })
    }
    else {
      let data = {
        // template_id: this.selectedTemplate.id,
        keyword: this.notiForm.value.title.replace(/ /g, "_").toLowerCase(),
        image_id: response,
        title: this.notiForm.value.title,
        message: this.notiForm.value.message,
        other_details: JSON.parse(this.notiForm.value.other_details)
      }
      this._appService.postApiWithAuth("/admin/notification-template/create", data, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.status_code == 200) {
            this._appService.success('Save Successfully')
            this.dialogRef.close({ event: 'close' });
          }
          else {
            this._appService.error(success.msg)
          }
        },
        error: (error: any) => {
          this._appService.updateLoading(false)
          console.log({ error })
        }
      })
    }
  }

  setFormvalues = () => {
    this.image = this.selectedTemplate.image
    
    this.notiForm.patchValue({
      title: this.selectedTemplate.title ? this.selectedTemplate.title : null,
      message: this.selectedTemplate.message ? this.selectedTemplate.message : null,
      image: this.selectedTemplate.image ? this.selectedTemplate.image : null,
      other_details: this.selectedTemplate.other_details ? JSON.stringify(this.selectedTemplate.other_details) : null,
      image_id:this.selectedTemplate.image
    })
  }

  closeDialogBox = () => {
     this.dialogRef.close({'status':'close'})
  }

}
