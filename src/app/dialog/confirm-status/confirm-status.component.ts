import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app.service';
import { UserManagementComponent } from 'src/app/user-management/user-management.component';

@Component({
  selector: 'app-confirm-status',
  templateUrl: './confirm-status.component.html',
  styleUrls: ['./confirm-status.component.scss']
})
export class ConfirmStatusComponent {
  status: any
  constructor(
    public dialogRef: MatDialogRef<UserManagementComponent>,
    public dialog: MatDialog,
    public _appService: AppService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.status = this.data.status
  }

  changeStatus() {
    let data = {
      user_id: this.data.userData.id,
      status: this.data.status
    }
    
    this._appService.putApiWithAuth(`/admin/users/status`, data, 1).subscribe((success: any) => {
      if(success.success){
        this._appService.success(success.msg)
        this.dialogRef.close({ event: 'close' });
      }else{
        this._appService.error(success.msg)
      }
    })
  }

  closeDialogBox(): void {
    this.dialogRef.close();
  }
}