import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { ImagePreviewDialogComponent } from '../image-preview-dialog/image-preview-dialog.component';

@Component({
  selector: 'app-view-post-details',
  templateUrl: './view-post-details.component.html',
  styleUrls: ['./view-post-details.component.scss']
})
export class ViewPostDetailsComponent {
  postDetailsImage: any
  postDetails: any
  imageSrc: any;
  constructor(
    public _appService: AppService,
    private fb: FormBuilder,
    public router: Router,
    public dialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }


  ngOnInit() {
    console.log(this.data);

    this.loadData()
  }


  loadData() {
    this._appService.showSpinner();
    this._appService.getApiWithAuth(`/admin/feeds/details?feed_id=${this.data?.postData?.feed_id ? this.data?.postData?.feed_id : this.data?.postData?.feeds?.id}`).subscribe((res: any) => {
      this.postDetails = res.data?.rating;
      this.postDetailsImage = res.data?.rating?.images;
      console.log(this.postDetailsImage);


      this._appService.hideSpinner();
    }, (error) => {
      if (error?.error?.status_code) {
        this.router.navigateByUrl("/");
        localStorage.removeItem('authtoken');
      }
    });
  }



  previewImage(imageLink: any) {
    this.imageSrc = imageLink;
    const dialogRef = this.dialog.open(ImagePreviewDialogComponent, {
      hasBackdrop: false,
      data: {
        imageLink: imageLink,
      },
    });
    // this.dialog.open();
  }
}

