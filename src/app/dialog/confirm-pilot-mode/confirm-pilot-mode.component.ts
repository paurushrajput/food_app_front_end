import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app.service';
import { UserManagementComponent } from 'src/app/user-management/user-management.component';

@Component({
  selector: 'app-confirm-pilot-mode',
  templateUrl: './confirm-pilot-mode.component.html',
  styleUrls: ['./confirm-pilot-mode.component.scss']
})
export class ConfirmPilotModeComponent {
  status: any
  constructor(
    public dialogRef: MatDialogRef<UserManagementComponent>,
    public dialog: MatDialog,
    public _appService: AppService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    console.log(this.data);

    this.status = this.data.status
  }

  changeStatus() {
    let data = {
      user_id: this.data.userData.id,
      is_pilot: this.data.status == 'live' ? 0 : 1
    }
    this._appService.putApiWithAuth(`/admin/users/update`, data, 1).subscribe((success: any) => {
      if (success.success) {
        this._appService.success(success.msg)
        this.dialogRef.close({ event: 'close' });
      } else {
        this._appService.error(success.msg)
      }
    })
  }

  closeDialogBox(): void {
    this.dialogRef.close();
  }
}
