import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app.service';
import { ConfirmDeactivateMessageComponent } from '../confirm-deactivate-message/confirm-deactivate-message.component';
import { RestaurantManagementComponent } from 'src/app/restaurant-management/restaurant-management.component';

@Component({
  selector: 'app-confirm-deactivate',
  templateUrl: './confirm-deactivate.component.html',
  styleUrls: ['./confirm-deactivate.component.scss']
})
export class ConfirmDeactivateComponent {

  status: any;
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public _appService: AppService,
    public dialog: MatDialog,public dialogRef: MatDialogRef<RestaurantManagementComponent>
  ) {
  }

  ngOnInit() {
    this.status = this.data.restaurantData.status
    if (this.status == 'active') {
      this.status = 'Deactivate'
    } else {
      this.status = 'Activate'
    }
  }

  closeDialogBox(): void {
     this.dialogRef.close({'status':'close'})
  }

  confirmDeactivate() {
    let data = this.data
    const dialogRef = this.dialog.open(ConfirmDeactivateMessageComponent, {
      hasBackdrop: false,
      width: '570px',
      data: {
        restaurantData: data,
        status: this.status
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

