import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app.service';
import { SocialRestaurantManagementComponent } from 'src/app/social-restaurant-management/social-restaurant-management.component';


@Component({
  selector: 'app-confirm-restaurant',
  templateUrl: './confirm-restaurant.component.html',
  styleUrls: ['./confirm-restaurant.component.scss']
})
export class ConfirmRestaurantComponent {
  status: any
  constructor(
    public dialogRef: MatDialogRef<SocialRestaurantManagementComponent>,
    public dialog: MatDialog,
    public _appService: AppService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.status = this.data.status
  }

  changeStatus() {
    
    if(this.data.restaurantData?.city_id){
      let data = {
        cityId: this.data.restaurantData.city_id,
        approved: this.data.status =='Approved'?1:0
      }
     
      this._appService.postApiWithAuth(`/admin/social/approve-cities`, data, 1).subscribe((success: any) => {
        if(success.success){
          this._appService.success(success.msg)
          this.dialogRef.close({ event: 'close' });
        }else{
          this._appService.error(success.msg)
        }
      })
    }else{
      this._appService.success("Please assign city id")
          this.dialogRef.close({ event: 'close' });
    }
  
  }

  closeDialogBox(): void {
    this.dialogRef.close();
  }
}