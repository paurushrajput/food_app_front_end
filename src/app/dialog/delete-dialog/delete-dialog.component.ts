import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app.service';
import { DialogManagementComponent } from 'src/app/dialog-management/dialog-management.component';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent {


  constructor(
    public dialogRef: MatDialogRef<DialogManagementComponent>,
    public dialog: MatDialog,
    public _appService: AppService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit(): void {
    console.log(this.data);
  }

  deleteRequest() {
    let data = {
      'id': this.data.dialogData.id
    }
    this._appService.deleteApi(`/admin/dialog/delete`, data, 1).subscribe((success: any) => {
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
