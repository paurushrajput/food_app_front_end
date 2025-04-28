
import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app.service';
import { UserManagementComponent } from 'src/app/user-management/user-management.component';
@Component({
  selector: 'app-add-remove-nukhba-user',
  templateUrl: './add-remove-nukhba-user.component.html',
  styleUrls: ['./add-remove-nukhba-user.component.scss']
})
export class AddRemoveNukhbaUserComponent {
  constructor(
    public dialogRef: MatDialogRef<UserManagementComponent>,
    public dialog: MatDialog,
    public _appService: AppService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  closeDialogBox(){
    this.dialogRef.close(false)
  }
  changeStatus(){
    this.dialogRef.close(true)
  }
}
