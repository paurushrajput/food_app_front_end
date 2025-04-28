import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { LocationManagementComponent } from 'src/app/location-management/location-management.component';

@Component({
  selector: 'app-send-notification',
  templateUrl: './send-notification.component.html',
  styleUrls: ['./send-notification.component.scss']
})
export class SendNotificationComponent {
  submitted: any = false
  formInvalid: any = false
  restaurantData: any
  image: any
  notiImage: any
  notiForm!: FormGroup;
  imageSize: any;
  constructor(public _appService: AppService,
    private route: Router, private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, public dialogRef: MatDialogRef<LocationManagementComponent>
  ) {
    this.buildForm()
  }

  ngOnInit(): void {
    this.getRestaurantList()
  }

  buildForm = () => {
    this.notiForm = this.fb.group({
      id: [''],
      topic: ['', [Validators.required]],
      title: ['', [Validators.required]],
      deviceType: [[], [Validators.required]],
      type: ['', [Validators.required]],
      image: ['', [Validators.required]],
      message: ['', [Validators.required]],
      htmlDescription: [''],
      description: ['', [Validators.required]],
      actionUrl: ['', [Validators.required]],
      actionType: ['', [Validators.required]],
      // actionButton: ['', [Validators.required]],
      res_id: ['']
    });
  }

  onFileSelected(fileInput: any) {
    if (fileInput.target.files.length > 0) {
    const file: File = fileInput.target.files[0]
      this.imageSize = this._appService.formatBytes(file.size);
      this.notiImage = file
      const reader = new FileReader();
      reader.onload = () => {
        this.image = reader.result as string;
      }
      reader.readAsDataURL(file)
    }
  };

  uploadImage() {
    if (this.notiImage) {
      let formData = new FormData();
      formData.append('file', this.notiImage)
      var promise = new Promise((resolve, reject) => {
        this._appService.postApiWithAuthentication(`/admin/media/image`, formData, 1).subscribe(
          (success: any) => {
            if (success.success == true) {
              return resolve(success.data.media_id)
            }
          })
      });
      return promise
    } else {
      return null
    }
  };

  getRestaurantList = () => {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/merchants/restaurants?is_paginated=false&restaurant_type=approved`).subscribe((res: any) => {
      this.restaurantData = res.data.rows;
      this._appService.hideSpinner()
    });
  };

  sendNotification = async () => {
    const selectedValues: number[] = this.notiForm.value.deviceType.map((value: string) => parseInt(value, 10));
this.submitted=true
this._appService.updateLoading(true)
    const response = await this.uploadImage()
    let data = {
      topic: this.notiForm.value.topic,
      title: this.notiForm.value.title,
      device_type: selectedValues,
      type: 1,
      // image: response,
      image: response,
      message: this.notiForm.value.message,
      html_description: this.notiForm.value.description,
      description: this.notiForm.value.description,
      action_url: this.notiForm.value.actionUrl,
      action_type: this.notiForm.value.actionType,
      res_id: this.notiForm.value.res_id,
      // action_button_name: this.notiForm.value.actionButton,
    }
    console.log(data)
    this._appService.postApiWithAuth("/admin/notifications/send", data, 1).subscribe({
      next: (success: any) => {
        this._appService.updateLoading(false)
        if (success.success) {
          this._appService.success(success.msg)
          this.route.navigate(['/notification/list'])
          this.dialogRef.close({ event: 'close' });
        }
      },
      error: (error: any) => {
        this._appService.updateLoading(false)
        console.log({ error })
      }
    })
  };

  closeDialogBox = () => {
     this.dialogRef.close({'status':'close'})
  };
}
