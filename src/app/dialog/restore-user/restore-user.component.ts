import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { DeleteUsersComponent } from 'src/app/delete-users/delete-users.component';

@Component({
  selector: 'app-restore-user',
  templateUrl: './restore-user.component.html',
  styleUrls: ['./restore-user.component.scss']
})
export class RestoreUserComponent {
  constructor(
    public dialog: MatDialog,
    public service: AppService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<DeleteUsersComponent>

  ) { }

  ngOnInit(): void {
  }

  restoreuser() {
    let data = {
      "id": this.data.userData.id,
      "status": 0
    }
    this.service.putApiWithAuth(`/admin/deleted-users/update`, data).subscribe((success: any) => {
      if (success.success) {
        this.service.success('user restore successfully')
         this.dialogRef.close({'status':'close'})
      } else {
        this.service.error(success.msg)
      }
    })

  }

  closeDialogBox(): void {
     this.dialogRef.close({'status':'close'})
  }
}