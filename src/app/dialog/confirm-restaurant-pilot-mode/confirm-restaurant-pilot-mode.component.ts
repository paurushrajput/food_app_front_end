import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { RestaurantManagementComponent } from 'src/app/restaurant-management/restaurant-management.component';

@Component({
  selector: 'app-confirm-restaurant-pilot-mode',
  templateUrl: './confirm-restaurant-pilot-mode.component.html',
  styleUrls: ['./confirm-restaurant-pilot-mode.component.scss']
})
export class ConfirmRestaurantPilotModeComponent {
  status: any
  selectedCategory: any;
  approveForm!: FormGroup;
  adminUsers: any = []
  constructor(
    public dialogRef: MatDialogRef<RestaurantManagementComponent>,
    public dialog: MatDialog,
    public _appService: AppService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private route: Router, private fb: FormBuilder,
  ) {
    this.buildForm()
  }

  ngOnInit(): void {
    let customArray = this.data.admin_users[0]
    this.adminUsers = Object.keys(customArray).map(key => {
      return { key: key, value: customArray[key] };
    });
    console.log(this.adminUsers);
    this.selectedCategory = this.data.restaurantData
    this.status = this.data.status
  }


  buildForm = () => {
    this.approveForm = this.fb.group({
      id: [''],
      live_by: ['', [Validators.required]],
      pilot_by: ['', [Validators.required]],
    })
  }

  changeStatus() {
    let data = {
      res_id: this.data.resData.id,
      is_pilot: this.data.status == 'live' ? 0 : 1,
    }
    if (data.is_pilot == 0) {
      Object.assign(data, { live_by: Number(this.approveForm.value.live_by) });
    } else if (data.is_pilot == 1) {
      Object.assign(data, { pilot_by: Number(this.approveForm.value.pilot_by) });
    }
    this._appService.putApiWithAuth(`/admin/restaurant/update`, data, 1).subscribe({
      next: (success: any) => {
        if (success.success) {
          this._appService.success(success.msg)
          this.dialogRef.close({ event: 'close' });
        } else {
          this._appService.error(success.msg)
        }
      }, error: (error: any) => {
        this._appService.updateLoading(false)
        console.log({ error })
        this._appService.err(error?.error?.msg)
      }
    })
  }

  closeDialogBox(): void {
    this.dialogRef.close();
  }


  setFormvalues = () => {
    this.approveForm.patchValue({
      id: this.selectedCategory.id ? this.selectedCategory.id : null,
      live_by: this.selectedCategory.live_by ? this.selectedCategory.live_by.toString() : null,
      pilot_by: this.selectedCategory.pilot_by ? this.selectedCategory.pilot_by.toString() : null,
    })
  }
}
