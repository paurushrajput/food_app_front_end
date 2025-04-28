
import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { ModuleMangementComponent } from 'src/app/module-mangement/module-mangement.component';

import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-add-role-permission',
  templateUrl: './add-role-permission.component.html',
  styleUrls: ['./add-role-permission.component.scss']
})
export class AddRolePermissionComponent {
  submitted: any = false
  formInvalid: any = false
  rolePermissionSelection: any = {};
  entity_id: any
  countryData: any
  locationImage: any
  image: any
  permissionData: any
  permisionForm!: FormGroup;
  imageSize: any;
  roleData: any;
  moduleData: any;
  filteredPermissionData: any = [];
  constructor(public _appService: AppService,
    private route: Router, private fb: FormBuilder,private cd: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, public dialogRef: MatDialogRef<ModuleMangementComponent>
  ) {
    this.buildForm()
  }

  ngOnInit(): void {
    // this.getCountryData()
    this.rolePermissionSelection = this.data.permissionDatas;
  this.entity_id = this.data.permissionDatas.module_id;

  // Load data
  this.getModuleData();
  this.getPermissionData();
  this.getRoleData();

  // Ensure data is loaded before setting form values
  Promise.all([this.getModuleData(), this.getPermissionData(), this.getRoleData()]).then(() => {
    if (this.entity_id) {
      this.setFormvalues();
     
     
    }
  });
  }


  onModuleChange(moduleId: string) {
    // Filter permissions based on selected module ID
    if (!this.permissionData || this.permissionData.length === 0) {
      console.error('Permission data not loaded');
      return;
    }

    this.filteredPermissionData = this.permissionData.filter((permission: any) => permission.module_id === moduleId);
    console.log(this.filteredPermissionData)
    this.cd.detectChanges();

    // Add new controls for the filtered permissions

  }
  onPermissionChange(event: any, permissionId: string) {

    const permissions = this.permisionForm.get('permissions')?.value || [];
    if (event.checked) {
      // Add the permission ID if checked
      permissions.push(permissionId);
    } else {
      // Remove the permission ID if unchecked
      const index = permissions.indexOf(permissionId);
      if (index > -1) {
        permissions.splice(index, 1);
      }
    }
    console.log(permissions)
    this.permisionForm.patchValue({ "permissions": permissions });
    console.log(this.permisionForm.value)
  }

  isPermissionSelected(permissionId: string): boolean {
    return this.permisionForm.get('permissions')?.value.includes(permissionId);
  }
  private initPermissions() {
    this.permissionData.forEach((type: any) => {
      this.permisionForm.addControl('permissions', new FormControl(false));
    });
  }
  buildForm = () => {
    this.permisionForm = this.fb.group({
      permission_id: [''],
      permissions: [''],
      role_id: ['', [Validators.required]],
      module_id: [''],


    })
    //  this.initPermissions()
  }
  getPermissionData = () => {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/permission/get?page=1&page_size=10&is_paginated=false&sort_by=created_at&order=desc`).subscribe((res: any) => {
      this.permissionData = res.data.rows;
      if(this.entity_id){
        this.onModuleChange(this.permisionForm.value.module_id);
      }
      console.log(this.permissionData)
      this._appService.hideSpinner()
    });
  };
  getModuleData = () => {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/module/get?page=1&page_size=10&is_paginated=false&sort_by=created_at&order=desc`).subscribe((res: any) => {
      this.moduleData = res.data.rows;
      this._appService.hideSpinner()
    });
  };
  getRoleData = () => {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/role/get?page=1&page_size=10&is_paginated=false&sort_by=created_at&order=desc`).subscribe((res: any) => {
      this.roleData = res.data.rows;
      this._appService.hideSpinner()
    });
  };

  saveModule = async () => {
    this._appService.updateLoading(true)
    console.log(this.permisionForm.value.permission_id)
    const selectedPermissions = this.permisionForm.get('permissions')?.value || [];
    const role_id = this.permisionForm.get('role_id')?.value;

    // Create the desired payload structure
    const data = {
      permissions: selectedPermissions.map((permission_id: string, index: number) => ({
        permission_id,
        role_id,
        id: this.rolePermissionSelection.id ? this.rolePermissionSelection.id[index] : null // Add id to each permission
      })),
    };
    if (this.data.permissionDatas.module_id) {
      this._appService.putApiWithAuth(`/admin/role-permission/update`, data, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.success) {
            this._appService.success('Updated Successfully')
            this.route.navigate(['/role-permission/list'])
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
      this._appService.postApiWithAuth("/admin/role-permission/add", data, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.success) {
            this._appService.success('Save Successfully')
            this.route.navigate(['/role-permission/list'])
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
      permission_id: this.rolePermissionSelection.permission_id ? this.rolePermissionSelection.permission_id : null,
      role_id: this.rolePermissionSelection.role_id ? this.rolePermissionSelection.role_id : null,
      permissions: this.rolePermissionSelection.permission_ids ? this.rolePermissionSelection.permission_ids : null,
      module_id: this.rolePermissionSelection.module_id? this.rolePermissionSelection.module_id : null,

    })
    console.log(this.permisionForm.value)
  
  
  }

  closeDialogBox = () => {
    this.dialogRef.close({ 'status': 'close' })
  }

}
