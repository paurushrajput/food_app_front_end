import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { RestaurantManagementComponent } from 'src/app/restaurant-management/restaurant-management.component';

@Component({
  selector: 'app-confirm-deactivate-message',
  templateUrl: './confirm-deactivate-message.component.html',
  styleUrls: ['./confirm-deactivate-message.component.scss']
})
export class ConfirmDeactivateMessageComponent {
  status: any
  submitted: any = false
  formInvalid: any = false
  searchForm!: FormGroup;
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public _appService: AppService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private route: Router,
    public dialogRef: MatDialogRef<RestaurantManagementComponent>

  ) {
    this.searchForm = this.fb.group({
      reason: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.status = this.data.restaurantData.status
    if (this.status == 'active') {
      this.status = 'Deactivate'
    } else {
      this.status = 'Activate'
    }
  }

  closeDialogBox(): void {
    this.dialogRef.close();
  }

  confirmStatus = async () => {
    if (this.searchForm.invalid) {
      this.formInvalid = true;
      this.submitted = true;
      return;
    }

    this.submitted = false;
    this._appService.updateLoading(true)
    let status = ''
    if (this.status == 'Activate') {
      status = 'active'
    } else {
      status = 'inactive'
    }
    let data = {
      "res_id": this.data.restaurantData.id,
      "status": status,          //"active", "inactive"
      "deactivate_reason": this.searchForm.value.reason
    }
    this._appService.putApiWithAuth("/admin/restaurant/update", data, 1).subscribe({
      next: (success: any) => {
        this._appService.updateLoading(false)
        if (success.success) {
          this._appService.success(`restaurant ${this.status} Successfully`)
          this.dialogRef.close({ event: 'close' });
        }
        else {
          this._appService.error(success.msg)
        }
      },
      error: (error: any) => {
        console.log({ error })
        this._appService.updateLoading(false)
      }
    })
  }
}
