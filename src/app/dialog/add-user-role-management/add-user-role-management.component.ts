
import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { ModuleMangementComponent } from 'src/app/module-mangement/module-mangement.component';

@Component({
  selector: 'app-add-user-role-management',
  templateUrl: './add-user-role-management.component.html',
  styleUrls: ['./add-user-role-management.component.scss']
})
export class AddUserRoleManagementComponent {
  submitted: any = false
  formInvalid: any = false
  userRoleSelection: any = {};
  entity_id: any
  countryData: any
  locationImage: any
  image: any
  roleData: any
  UserRoleForm!: FormGroup;
  imageSize: any;
  adminData: any;
  constructor(public _appService: AppService,
    private route: Router, private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, public dialogRef: MatDialogRef<ModuleMangementComponent>
  ) {
    this.buildForm()
  }

  ngOnInit(): void {
    // this.getCountryData()
    this.userRoleSelection = this.data.userRoleData
    this.entity_id = this.data.userRoleData.id
   this.getRoleData()
   this.getAdminList()
    if (this.entity_id) {
      this.setFormvalues()
    }
    // if (data)
    //   this.getRoleData(data)
  }

 

  buildForm = () => {
    this.UserRoleForm = this.fb.group({
      id: [''],
      role_id: ['', [Validators.required]],
      user_id:['', [Validators.required]]
     
    })
  }
  getRoleData = () => {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/role/get?page=1&page_size=10&is_paginated=false&sort_by=created_at&order=desc`).subscribe((res: any) => {
      this.roleData = res.data.rows;
      this._appService.hideSpinner()
    });
  };
  getAdminList = () => {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/list?page=1&page_size=10&is_paginated=false&sort_by=created_at&order=desc`).subscribe((res: any) => {
      this.adminData = res.data.rows;
      this._appService.hideSpinner()
    });
  };
 
 

  saveModule = async () => {
    this._appService.updateLoading(true)
  
    let data = {
      role_id:this.UserRoleForm.value.role_id,
      user_id: this.UserRoleForm.value.user_id,
      id:this.data.userRoleData.id
    }
    if (this.data.userRoleData?.id) {
      this._appService.putApiWithAuth(`/admin/user-role/update`, data, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.success) {
            this._appService.success('Updated Successfully')
            this.route.navigate(['/user-role/list'])
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
      this._appService.postApiWithAuth("/admin/user-role/add", data, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.success) {
            this._appService.success('Save Successfully')
            this.route.navigate(['/user-role/list'])
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
   
    this.UserRoleForm.patchValue({
      id: this.userRoleSelection.id ? this.userRoleSelection.id : null,
      role_id: this.userRoleSelection.role_id ? this.userRoleSelection.role_id : null,
      user_id:this.userRoleSelection.user_id ? this.userRoleSelection.user_id : null,
     
    })
  }

  closeDialogBox = () => {
    this.dialogRef.close({'status':'close'})
  }

}
