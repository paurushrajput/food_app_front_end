import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { SettingManagementComponent } from 'src/app/setting-management/setting-management.component';

@Component({
  selector: 'app-add-setting',
  templateUrl: './add-setting.component.html',
  styleUrls: ['./add-setting.component.scss']
})
export class AddSettingComponent {


  newSetting!: FormGroup;
  submitted: any = false
  formInvalid: any = false
  selectedSetting: any = {};
  imageURL: any = "";
  thumbnailUrl: any = "";
  image: any = "";
  gameData: any;
  breakupData: any;
  ruleData: any;
  appImages: any;
  entity_id: any

  constructor(
    private route: Router,
    public _appService: AppService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<SettingManagementComponent>
  ) {
    this.newSetting = this.fb.group({
      id: [''],
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      url: ['', [Validators.required]],
      image: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.selectedSetting = this.data?.settingData;
    this.entity_id = this.data.settingData.id
    if (this.data.settingData.id)
      this.setFormvalues()
  }

  closeDialogBox() {
     this.dialogRef.close({'status':'close'});
  }

  uploadImage() {
    if (this.appImages) {
      let formData = new FormData();
      formData.append('file', this.appImages)
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
      return null;
    }
  }



  saveSetting = async () => {
    this._appService.updateLoading(true)
    const imageBanner = await this.uploadImage();
    if (this.newSetting.value.id != '' && this.newSetting.value.id != null) {
      let data
      if (imageBanner != null) {
        data = {
          settings_id: this.newSetting.value.id,
          title: this.newSetting.value.title,
          description: this.newSetting.value.description,
          url: this.newSetting.value.url,
          image: imageBanner
        }
      } else {
        data = {
          settings_id: this.newSetting.value.id,
          title: this.newSetting.value.title,
          description: this.newSetting.value.description,
          url: this.newSetting.value.url
        }
      }
      this._appService
        .putApiWithAuth(`/admin/app-settings/`, data, 1)
        .subscribe({
          next: (success: any) => {
            this._appService.updateLoading(false)
            console.log(success);
            if (success.status_code == 200) {
              this.dialogRef.close({ event: 'close' });
            } else {
              console.log('api error');
            }
          },
          error: (error: any) => {
            this._appService.updateLoading(false)
            console.log({ error });
          },
        });
    } else {
      this.submitted = true
      if (this.newSetting.invalid) {
        this.formInvalid = true
        this._appService.updateLoading(false)
        return
      }
      let data = {
        title: this.newSetting.value.title,
        image: imageBanner,
        description: this.newSetting.value.description,
        url: this.newSetting.value.url
      }
      this._appService.postApiWithAuth('/admin/app-settings/', data, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.status_code == 200) {
            this.dialogRef.close({ event: 'close' });
            this._appService.success(success.msg)
          } else {
            this._appService.err(success.msg)
            console.log('api error');
          }
        },
        error: (error: any) => {
          this._appService.updateLoading(false)
          console.log({ error });
        },
      });
    }
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file: File = event.target.files[0];
      const reader = new FileReader();
      this.appImages = file;
      reader.onload = () => {
        this.image = reader.result as string;
      }
      reader.readAsDataURL(file)
    }
  }

  setFormvalues = () => {
    this.image = this.selectedSetting.image
    this.newSetting.patchValue({
      id: this.selectedSetting.id ? this.selectedSetting.id : null,
      title: this.selectedSetting.title ? this.selectedSetting.title : null,
      description: this.selectedSetting.description ? this.selectedSetting.description : null,
      url: this.selectedSetting.url ? this.selectedSetting.url : null,
      image: this.selectedSetting.image ? this.selectedSetting.image : null,
    });
    
  };

}