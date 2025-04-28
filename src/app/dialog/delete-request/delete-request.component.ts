import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app.service';
import { StoriesManagementComponent } from 'src/app/stories-management/stories-management.component';



@Component({
  selector: 'app-delete-request',
  templateUrl: './delete-request.component.html',
  styleUrls: ['./delete-request.component.scss']
})
export class DeleteRequestComponent {
  constructor(
    public dialogRef: MatDialogRef<StoriesManagementComponent>,
    public dialog: MatDialog,
    public _appService: AppService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit(): void {
    console.log(this.data);

  }

  deleteRequest() {
    let data = {
     
      status: 1
    }
    this.dialogRef.close({ event: 'close',data:data });
   
  }

  closeDialogBox(): void {
    this.dialogRef.close();
  }
}
