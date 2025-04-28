import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { CashoutRequestManagementComponent } from 'src/app/cashout-request-management/cashout-request-management.component';

@Component({
  selector: 'app-update-cashout-request',
  templateUrl: './update-cashout-request.component.html',
  styleUrls: ['./update-cashout-request.component.scss']
})
export class UpdateCashoutRequestComponent {
  selectedCategory: any;
  approveForm!: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<CashoutRequestManagementComponent>,
    public dialog: MatDialog,
    private route: Router, private fb: FormBuilder,
    public _appService: AppService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.buildForm()
  }

  ngOnInit(): void {
    this.selectedCategory = this.data
    if (this.data)
      this.setFormvalues()
  }

  buildForm = () => {
    this.approveForm = this.fb.group({
      id: [''],
      approved_status: ['', [Validators.required]],
    })
  }

  approveRestaurant() {
    this._appService.putApiWithAuth(`/admin/points/update-approve-status`, this.approveForm.value, 1).subscribe((success: any) => {
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
    console.log(this.selectedCategory);

    this.approveForm.patchValue({
      id: this.selectedCategory.id ? this.selectedCategory.id : null,
      //approve: this.selectedCategory.approval_status ? this.selectedCategory.approval_status : null,
      approved_status: this.selectedCategory.approved_status ? this.selectedCategory.approved_status.toString() : null,
    })
  }
}

