import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { InfluncerManagementComponent } from '../influncer-management/influncer-management.component';

@Component({
  selector: 'app-update-commission',
  templateUrl: './update-commission.component.html',
  styleUrls: ['./update-commission.component.scss']
})
export class UpdateCommissionComponent {
  submitted: any = false
  formInvalid: any = false
  elementdata: any = {};
  entity_id: any
  countryData: any
  locationImage: any
  image: any
  cityData: any
  commissionForm!: FormGroup;
  imageSize: any;
  constructor(public _appService: AppService,
    private route: Router, private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, public dialogRef: MatDialogRef<InfluncerManagementComponent>
  ) {
    this.buildForm()
  }

  ngOnInit(): void {
    // this.getCountryData()
    console.log(this.data)
    this.elementdata = this.data.elementdata
    this.entity_id = this.data.elementdata.id
this.setFormvalues()



  }



  buildForm = () => {
    this.commissionForm = this.fb.group({
      id: [''],
      commission_type: [''],
      commission: ['', [Validators.required]],

    })
  }



  saveLocation = async () => {

    let data = {
      commission_type: this.commissionForm.value.commission_type,
      id: this.data.elementdata.id,
      commission: this.commissionForm.value.commission
    }
    this._appService.putApiWithAuth(`/admin/influencers/update`, data, 1).subscribe({
      next: (success: any) => {
        this._appService.updateLoading(false)
        if (success.success) {
          this._appService.success('Updated Successfully')
          this.dialogRef.close({ event: 'close', value: data });
        }
        else {
          this._appService.error(success.msg)
          this.dialogRef.close({ event: 'close', value: data });
        }
      },
      error: (error: any) => {
        this._appService.updateLoading(false)
        console.log({ error })
        this._appService.err(error?.error?.msg)
        this.dialogRef.close({ event: 'close', value: data });
      }
    })

  }

  setFormvalues = () => {

    this.commissionForm.patchValue({
      id: this.elementdata.id ? this.elementdata.id : null,
      commission_type: this.elementdata.commission_type ? this.elementdata.commission_type : null,
      commission: this.elementdata.commission ? this.elementdata.commission : null,
    })
  }

  closeDialogBox = () => {
    this.dialogRef.close({ 'status': 'close' })
  }

}
