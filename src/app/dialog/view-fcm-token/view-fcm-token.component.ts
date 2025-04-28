import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app.service';
import { UserManagementComponent } from 'src/app/user-management/user-management.component';

@Component({
  selector: 'app-view-fcm-token',
  templateUrl: './view-fcm-token.component.html',
  styleUrls: ['./view-fcm-token.component.scss']
})
export class ViewFcmTokenComponent {
  constructor(
    public dialogRef: MatDialogRef<UserManagementComponent>,
    public dialog: MatDialog,
    public _appService: AppService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
}
