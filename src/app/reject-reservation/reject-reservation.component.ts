import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app.service';
import { RestaurantManagementComponent } from '../restaurant-management/restaurant-management.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationPoupupComponent } from '../confirmation-poupup/confirmation-poupup.component';

@Component({
  selector: 'app-reject-reservation',
  templateUrl: './reject-reservation.component.html',
  styleUrls: ['./reject-reservation.component.scss']
})
export class RejectReservationComponent {
  comission: any = 50;
  selectedCategory: any;
  requestForm!: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<RestaurantManagementComponent>,
    public dialog: MatDialog,
    private route: Router, private fb: FormBuilder,
    public _appService: AppService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.buildForm()
  }

  ngOnInit(): void {
    this.selectedCategory = this.data.restaurantData
    if (this.data)
      this.setFormvalues()
  }

  buildForm = () => {
    this.requestForm = this.fb.group({
      id: [''],

      reject_reason: ['', [Validators.required]],
      approve: ['rejected', [Validators.required]],

    })
  }

  toArray(end: any) {
    return end ? Array.from({ length: end }, (_, index) => index + 1) : [];
  }
confirmationPopup(){
  const dialogRef = this.dialog.open(ConfirmationPoupupComponent, {
    hasBackdrop: false,
    // width: '80px',
    // height: '80px',
    data: {
      title: "Are you sure you want to reject this restaurant ?",
      submitTitle:"Reject"
    }
  });
  dialogRef.afterClosed().subscribe(result => {
    console.log(`Dialog result: ${result}`);
   if(result){
    this.rejectRestaurant()
   }
  });
}
  rejectRestaurant() {
    let data = {
      res_id: this.data?.restaurantData?.id,
      reject_reason: this.requestForm.value.reject_reason,
      approve: 0,
    }

    this._appService.putApiWithAuth(`/admin/restaurant/update`, data, 1).subscribe((success: any) => {
      if (success.success) {
        this._appService.success(success.msg)
        this.dialogRef.close({ event: 'close' });
      } else {
        this._appService.error(success.msg)
        this.dialogRef.close({ event: 'close' });
      }
    }, (error) => {
      this._appService.err(error?.error?.msg)
    })
  }

  closeDialogBox(): void {
    this.dialogRef.close();
  }

  setFormvalues = () => {
    this.requestForm.patchValue({
      id: this.selectedCategory.id ? this.selectedCategory.id : null,
      //commission_base_price: this.selectedCategory.commission_base_price ? this.selectedCategory.commission_base_price.toString() : null,
     // approve: this.selectedCategory.approval_status ? this.selectedCategory.approval_status : null,
      reason: this.selectedCategory.reason ? this.selectedCategory.reason: null,
      // booking_fee_required: this.selectedCategory.booking_fee_required ? this.selectedCategory.booking_fee_required.toString() : null,
    })
  }
}
