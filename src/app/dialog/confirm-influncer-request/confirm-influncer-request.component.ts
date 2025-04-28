import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app.service';
import { UserManagementComponent } from 'src/app/user-management/user-management.component';

@Component({
  selector: 'app-confirm-influncer-request',
  templateUrl: './confirm-influncer-request.component.html',
  styleUrls: ['./confirm-influncer-request.component.scss']
})
export class ConfirmInfluncerRequestComponent  {
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
    this.dialogRef.close({'value':this.data,"status":true});
    
  }

  closeDialogBox(): void {
    this.dialogRef.close();
  }
}