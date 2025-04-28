import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserManagementComponent } from 'src/app/user-management/user-management.component';

@Component({
  selector: 'app-add-user-email',
  templateUrl: './add-user-email.component.html',
  styleUrls: ['./add-user-email.component.scss']
})
export class AddUserEmailComponent {
email:any='';
constructor(
  
  public dialogRef: MatDialogRef<UserManagementComponent>,
   public dialog: MatDialog) {
  
}
close(){
this.dialogRef.close(true)
}
saveForm(){
  if(this.email)
  this.dialogRef.close({'status':true ,data:this.email})
}
}
