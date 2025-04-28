import { Component, Inject, Optional } from '@angular/core';
import { RejectReservationComponent } from '../reject-reservation/reject-reservation.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-poupup',
  templateUrl: './confirmation-poupup.component.html',
  styleUrls: ['./confirmation-poupup.component.scss']
})
export class ConfirmationPoupupComponent {
  constructor(
    public dialogRef: MatDialogRef<RejectReservationComponent>,
    public dialog: MatDialog,
  
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    
  }
  confirm(){
    this.dialogRef.close(true)
  }
  closeDialogBox(){
    this.dialogRef.close(false)
   
  }
}
