import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { StoriesManagementComponent } from 'src/app/stories-management/stories-management.component';


@Component({
  selector: 'app-add-stories',
  templateUrl: './add-stories.component.html',
  styleUrls: ['./add-stories.component.scss']
})

export class AddStoriesComponent {


  campaignData: any
  newStories!: FormGroup;
  bannerTypev1: any
  action: any = '1'
  photoUrl: any
  image: any
  bannerImage: any = ''
  imageURL: any = [];
  selectedStories: any;
  isValidFormSubmitted: any = true;
  durationValues: number[] = Array.from({ length: 31 }, (_, i) => i);
  imageSize: any;
  constructor(
    private route: Router,
    public _appService: AppService,
    private fb: FormBuilder,
    public dialog: MatDialog,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<StoriesManagementComponent>

  ) {
    this.newStories = this.fb.group({
      id: [''],
      // screen_type:[''],
      title: ['', [Validators.required]],
      type: ['', [Validators.required]],
      action: ['', [Validators.required]],
      duration: ['', Validators.required],
      image_id: ['', Validators.required],
      status: ['', Validators.required]

    })
  }


  ngOnInit(): void {
    // this.getCampaign()
    this.selectedStories = this.data.storiesData
    console.log(this.data.storiesData);
    if (this.selectedStories)
      this.setFormvalues()
  }

  checkAction() {
    this.action = this.newStories.value.actionType
  }

  checkBannerType() {
    this.bannerTypev1 = this.newStories.value.bannerType
  }

  closeDialogBox() {
     this.dialogRef.close({'status':'close'});
  }
  // getCampaign = () => {
  //   this._appService.showSpinner()
  //   this._appService.getApiWithAuth(`admin/campaign?page=${1}&perPage=${1000}&sortOrder=${-1}`).subscribe((res: any) => {
  //     this.campaignData = res.data.campaign;
  //     this._appService.hideSpinner()
  //   });
  // };
  onFileSelected(fileInput: any) {
    // console.log(fileInput.target.files[0].size);
    if (fileInput.target.files.length > 0) {
    const file: File = fileInput.target.files[0]
      this.imageSize = this._appService.formatBytes(file.size);
      this.bannerImage = file
      this.imageURL = ''
      const reader = new FileReader();
      reader.onload = () => {
        this.image = reader.result as string;
      }
      reader.readAsDataURL(file)
    }
  }

  uploadImage() {
    if (this.bannerImage) {
      let formData = new FormData();
      formData.append('file', this.bannerImage)
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
  async saveBanner() {
    this._appService.updateLoading(true)
    const response = await this.uploadImage();
    this.isValidFormSubmitted = false;
    this.newStories.value.image_id = response
    if (this.newStories.value.id) {
      this._appService.putApiWithAuth(`/admin/stories/update`, this.newStories.value, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.status_code == 200) {
            this.dialogRef.close({ event: 'close' });
            this._appService.success('Stories Updated Successfully')
          }
        },
        error: (error: any) => {
          this._appService.updateLoading(false)
          console.log({ error })
        }
      })
    } else {
      this._appService.postApiWithAuth(`/admin/stories/add`, this.newStories.value, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.status_code == 200) {
            this.dialogRef.close({ event: 'close' });
            this._appService.success('Stories Created Successfully')
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
    this.imageURL = this.selectedStories.image

    this.newStories.patchValue({
      id: this.selectedStories.id ? this.selectedStories.id : null,
      title: this.selectedStories.title,
      type: this.selectedStories.type.toString(),
      action: this.selectedStories.action,
      duration: this.selectedStories.duration,
      status: this.selectedStories.status.toString(),
        image_id: this.selectedStories.image,
        // screen_type:this.selectedStories.screen_type

    });
  };
}