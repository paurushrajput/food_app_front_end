import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app.service';
import { GiftGoodiesManagementComponent } from 'src/app/gift-goodies-management/gift-goodies-management.component';

@Component({
  selector: 'app-delete-gifts',
  templateUrl: './delete-gifts.component.html',
  styleUrls: ['./delete-gifts.component.scss']
})
export class DeleteGiftsComponent {

 constructor(
    public dialogRef: MatDialogRef<GiftGoodiesManagementComponent>,
    public dialog: MatDialog,
    public _appService: AppService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit(): void {
    console.log(this.data);

  }

  deleteRequest() {
    this._appService.deleteApi(`/admin/nukhba-store/remove?store_id=${this.data.id}`, 0, 1).subscribe((success: any) => {
      if (success.success) {
        this._appService.success(success.msg)
         this.dialogRef.close({'status':'close'})
      } else {
        this._appService.error(success.msg)
      }
    })
  }

  closeDialogBox(): void {
    this.dialogRef.close();
  }
}
