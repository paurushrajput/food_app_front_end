import { Component, Inject, Optional } from '@angular/core';
import { DealMngmtComponent } from '../deal-mngmt/deal-mngmt.component';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app.service';

@Component({
  selector: 'app-delete-deal',
  templateUrl: './delete-deal.component.html',
  styleUrls: ['./delete-deal.component.scss']
})
export class DeleteDealComponent {


  constructor(
    public dialogRef: MatDialogRef<DealMngmtComponent>,
    public dialog: MatDialog,
    public _appService: AppService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit(): void {
    console.log(this.data);

  }

  deleteRequest() {
    let data = {
      deal_id: this.data.dealData.id
    }
    this._appService.deleteApi(`/admin/deal/delete`, data, 1).subscribe((success: any) => {
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
