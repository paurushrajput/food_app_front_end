import { Component, ElementRef, Inject, Optional, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { BannerManagementComponent } from 'src/app/banner-management/banner-management.component';
import { AddMediaComponent } from '../add-media/add-media.component';

@Component({
  selector: 'app-add-banner',
  templateUrl: './add-banner.component.html',
  styleUrls: ['./add-banner.component.scss']
})
export class AddBannerComponent {

  bannerForm!: FormGroup;
  campaignData: any
  newBanner!: FormGroup;
  bannerTypev1: any
  action: any = '1'
  photoUrl: any
  image: any=""
  bannerImage: any
  imageURL: any = [];
  selectedBanner: any;
  restaurantData: any;
  gameData: any;
  isValidFormSubmitted: any = false;
  imageSize: any;
  entity_id: any
  minStartDate: Date;
  minEndDate: Date;
  imageData: any='';
  constructor(
    private route: Router,
    public _appService: AppService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<BannerManagementComponent>

  ) {
    this.newBanner = this.fb.group({
      id: [''],
      // image: ['', [Validators.required]],
      action: [''],
      screen_type: ['home', [Validators.required]],
      banner_type: [''],
      gameId: [''],
      res_id: [''],
      banner_size: [''],
      start_time: [''],
      end_time: [''],
      status: [''],
      icon:['']
    })
    this.minStartDate = new Date();
    this.minEndDate = new Date();
    this.minEndDate.setDate(this.minEndDate.getDate() + 1);
  }
  @ViewChild('datetimePicker') datetimePicker: MatDateRangePicker<any> | undefined;
  @ViewChild('dateEndtimePicker') dateEndtimePicker: MatDateRangePicker<any> | undefined;
  @ViewChild('startInput') startInput: ElementRef | undefined;
  @ViewChild('endInput') endInput: ElementRef | undefined;
  ngAfterViewInit(): void {
    this.startInput?.nativeElement.addEventListener('click', () => this.datetimePicker?.open());
    this.endInput?.nativeElement.addEventListener('click', () => this.dateEndtimePicker?.open());
  }

  ngOnInit(): void {
    // this.getCampaign()
    this.getGameList()
    this.getRestaurantList()
    this.selectedBanner = this.data.bannerData
    this.entity_id = this.data.bannerData.id
    if (this.selectedBanner)
      this.setFormvalues()
  }

  checkAction() {
    this.action = this.newBanner.value.actionType
  }

  checkBannerType() {
    this.bannerTypev1 = this.newBanner.value.bannerType
  }

  closeDialogBox() {
    this.dialogRef.close({ 'status': 'close' });
  }
  // getCampaign = () => {
  //   this._appService.showSpinner()
  //   this._appService.getApiWithAuth(`admin/campaign?page=${1}&perPage=${1000}&sortOrder=${-1}`).subscribe((res: any) => {
  //     this.campaignData = res.data.campaign;
  //     this._appService.hideSpinner()
  //   });
  // };
  onFileSelected(fileInput: any) {
    // if (fileInput.target.files.length > 0) {
    //   const file: File = fileInput.target.files[0]
    //   this.imageSize = this._appService.formatBytes(file.size);
    //   this.bannerImage = file
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
        type:"banner"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.status}`);
      if (result && result.status) {
        console.log(result)
        this.imageData=result.value
      this.image=result.value.image
      }
    });
  }

  // uploadImage() {
  //   if (this.bannerImage) {
  //     let formData = new FormData();
  //     formData.append('file', this.bannerImage)
  //     var promise = new Promise((resolve, reject) => {
  //       this._appService.postApiWithAuthentication(`/admin/media/image`, formData, 1).subscribe({
  //         next:
  //           (success: any) => {
  //             if (success.success == true) {
  //               // this._appService.success('Image upload successfully')
  //               return resolve(success.data.media_id)
  //             }
  //           },
  //         error: (error: any) => {
  //           this._appService.err(error?.error?.msg)
  //         }
  //       })
  //     });
  //     return promise
  //   } else {
  //     return null
  //   }

  // }

  getGameList = () => {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/tournaments/get-game-list`).subscribe((res: any) => {
      this.gameData = res.data;
      this._appService.hideSpinner()
    });
  };

  getRestaurantList = () => {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/merchants/restaurants?is_paginated=false&restaurant_type=approved`).subscribe((res: any) => {
      this.restaurantData = res.data.rows;
      this._appService.hideSpinner()
    });
  };


  changeDiv() {
    if (this.newBanner.value.banner_type == 'restaurant') {
      this.getRestaurantList()
    }
    if (this.newBanner.value.banner_type == 'game') {
      this.getGameList()
    }
  }
  async saveBanner() {
    // if(this.newBanner.invalid){
    //   return
    // }
    this._appService.updateLoading(true)
    if (this.selectedBanner.id) {
    //  const response = await this.uploadImage();
 
    const response=this.imageData?this.imageData.id:""
      this.isValidFormSubmitted = true;
      let data
      if (response) {
        data = {
          "id": this.selectedBanner.id,
          "banner_type": this.newBanner.value.banner_type,
          "image_id": response,
          "res_id": this.newBanner.value.res_id,
          "action": this.newBanner.value.action,
          "banner_size": this.newBanner.value.banner_size,
          "start_time": this.newBanner.value.start_time.getTime() / 1000,
          "end_time": this.newBanner.value.end_time.getTime() / 1000,
          "status": this.newBanner.value.status,
          "screen_type": this.newBanner.value.screen_type

        }
      } else {
        data = {
          "id": this.selectedBanner.id,
          "banner_type": this.newBanner.value.banner_type,
          "res_id": this.newBanner.value.res_id,
          "action": this.newBanner.value.action,
          "banner_size": this.newBanner.value.banner_size,
          "start_time": this.newBanner.value.start_time.getTime() / 1000,
          "end_time": this.newBanner.value.end_time.getTime() / 1000,
          "status": this.newBanner.value.status,
          "screen_type": this.newBanner.value.screen_type
        }
      }
      this._appService.putApiWithHeaderAuth(`/admin/banner/update`, data, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.status_code == 200) {
            this.dialogRef.close({ event: 'close' });
            this._appService.success('Banner Updated Successfully')
          }
        },
        error: (error: any) => {
          this._appService.updateLoading(false)
          console.log({ error })
        }
      })
    } else {
      const response =this.imageData?this.imageData.id:""
      this.isValidFormSubmitted = true;
      // let data = this.newBanner.value
      let action = this.newBanner.value.action
      if (this.newBanner.value.banner_type == 'shareapp') {
        action = 'www.google.com'
      }
      let data = {
        "banner_type": this.newBanner.value.banner_type,
        "image_id": response,
        "res_id": this.newBanner.value.res_id,
        "action": action,
        "banner_size": this.newBanner.value.banner_size,
        "start_time": this.newBanner.value.start_time.getTime() / 1000,
        "end_time": this.newBanner.value.end_time.getTime() / 1000,
        "screen_type": this.newBanner.value.screen_type
      }
      this._appService.postApiWithAuth(`/admin/banner/create`, data, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.status_code == 200) {
            this.dialogRef.close({ event: 'close' });
            this._appService.success('Banner Created Successfully')
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
    this.image = this.selectedBanner.banner_url
    // this.actions = this.selectedBanner.action.split('?screen=') != undefined && this.selectedBanner.action.split('?screen=').length > 1 ? this.selectedBanner.action.split('?screen=')[1] : this.selectedBanner.actionScreen == null ? this.selectedBanner.action : this.selectedBanner.actionScreen;
    this.newBanner.patchValue({
      id: this.selectedBanner.id ? this.selectedBanner.id : null,
      banner_type: this.selectedBanner.banner_type ? this.selectedBanner.banner_type : null,
      image: this.selectedBanner.banner_url ? this.selectedBanner.banner_url : null,
      banner_size: this.selectedBanner.banner_size ? this.selectedBanner.banner_size : null,
      res_id: this.selectedBanner.restaurant_id ? this.selectedBanner.restaurant_id : null,
      actionType: this.action,
      start_time: new Date(this.selectedBanner.start_time * 1000),
      end_time: new Date(this.selectedBanner.end_time * 1000),
      status: this.selectedBanner.status?this.selectedBanner.status.toString():"",
      screen_type: this.selectedBanner.screen_type,
      action: this.selectedBanner.action ? this.selectedBanner.action : null,
    });
  };
}
