


import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { ModuleMangementComponent } from 'src/app/module-mangement/module-mangement.component';


@Component({
  selector: 'app-add-permission',
  templateUrl: './add-permission.component.html',
  styleUrls: ['./add-permission.component.scss']
})
export class AddPermissionComponent {
  submitted: any = false
  formInvalid: any = false
  permissionSelection: any = {};
  entity_id: any
  countryData: any
  locationImage: any
  image: any
  moduleData: any
  permisionForm!: FormGroup;
  imageSize: any;
  constructor(public _appService: AppService,
    private route: Router, private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, public dialogRef: MatDialogRef<ModuleMangementComponent>
  ) {
    this.buildForm()
  }

  ngOnInit(): void {
    // this.getCountryData()
    this.permissionSelection = this.data.permissionData
    this.entity_id = this.data.permissionData.id
   this.getModuleData()
    if (this.entity_id) {
      this.setFormvalues()
    }
    // if (data)
    //   this.getmoduleData(data)
  }

 

  buildForm = () => {
    this.permisionForm = this.fb.group({
      id: [''],
      type: ['', [Validators.required]],
      module_id:['', [Validators.required]]
     
    })
  }
  getModuleData = () => {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/module/get?page=1&page_size=10&is_paginated=false&sort_by=created_at&order=desc`).subscribe((res: any) => {
      this.moduleData = res.data.rows;
      this._appService.hideSpinner()
    });
  };
 

  saveModule = async () => {
    this._appService.updateLoading(true)
  
    let data = {
      module_id:this.permisionForm.value.module_id,
      type: this.permisionForm.value.type,
      id:this.data.permissionData.id
    }
    if (this.data.permissionData?.id) {
      this._appService.putApiWithAuth(`/admin/permission/update`, data, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.success) {
            this._appService.success('Updated Successfully')
            this.route.navigate(['/permission/list'])
            this.dialogRef.close({ event: 'close' });
          }
          else {
            this._appService.error(success.msg)
          }
        },
        error: (error: any) => {
          this._appService.updateLoading(false)
          console.log({ error })
          this._appService.err(error?.error?.msg)
        }
      })
    }
    else {
      this._appService.postApiWithAuth("/admin/permission/add", data, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.success) {
            this._appService.success('Save Successfully')
            this.route.navigate(['/permission/list'])
            this.dialogRef.close({ event: 'close' });
          }
          else {
            this._appService.error(success.msg)
          }
        },
        error: (error: any) => {
          this._appService.updateLoading(false)
          console.log({ error })
          this._appService.err(error?.error?.msg)
        }
      })
    }
  }

  setFormvalues = () => {
   
    this.permisionForm.patchValue({
      id: this.permissionSelection.id ? this.permissionSelection.id : null,
      type: this.permissionSelection.type ? this.permissionSelection.type : null,
      module_id:this.permissionSelection.module_id ? this.permissionSelection.module_id : null,
     
    })
  }

  closeDialogBox = () => {
    this.dialogRef.close({'status':'close'})
  }

}
