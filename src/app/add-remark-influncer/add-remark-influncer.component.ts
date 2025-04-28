

import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { InfluncerManagementComponent } from '../influncer-management/influncer-management.component';


@Component({
  selector: 'app-add-remark-influncer',
  templateUrl: './add-remark-influncer.component.html',
  styleUrls: ['./add-remark-influncer.component.scss']
})
export class AddRemarkInfluncerComponent {
  submitted: any = false
  formInvalid: any = false
  userData: any = {};
  entity_id: any
  countryData: any
  locationImage: any
  image: any
  cityData: any
  remarkForm!: FormGroup;
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
    this.userData = this.data.userData
    this.entity_id = this.data.userData.id

    this.setFormvalues()

  }



  buildForm = () => {
    this.remarkForm = this.fb.group({
      id: [''],
      approved: [''],
      remark: ['', [Validators.required]],
      commission: [''],
      commission_type: ['']

    })
  }



  saveLocation = async () => {
    let data;
    if (this.data.status == 'approved') {
      data = {
        remark: this.remarkForm.value.remark,
        id: this.data.userData.id,
        approved: this.data.status == 'approved' ? 1 : 0,
        commission_type: this.remarkForm.value.commission_type,
        commisision: this.remarkForm.value.commisision
      }
    } else {
      data = {
        remark: this.remarkForm.value.remark,
        id: this.data.userData.id,
        approved: this.data.status == 'approved' ? 1 : 0,

      }
    }


    this.dialogRef.close({ event: 'close', value: data });
  }

  setFormvalues = () => {

    this.remarkForm.patchValue({
      id: this.userData.id ? this.userData.id : null,
      remark: this.userData.remark ? this.userData.remark : null,
      commission_type: this.userData.commission_type ? this.userData.commission_type : null,
      commission: this.userData.commission ? this.userData.commission : null,

    })
  }

  closeDialogBox = () => {
    this.dialogRef.close({ 'status': 'close' })
  }

}
