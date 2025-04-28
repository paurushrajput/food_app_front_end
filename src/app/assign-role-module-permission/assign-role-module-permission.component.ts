import { Component, Inject, Optional } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';

@Component({
  selector: 'app-assign-role-module-permission',
  templateUrl: './assign-role-module-permission.component.html',
  styleUrls: ['./assign-role-module-permission.component.scss']
})
export class AssignRoleModulePermissionComponent {
  permisionForm: FormGroup;
  roleData :any=[] ;
  modules:any = []; // Array to store modules from the provided data
  filteredModules = []; // Array to store modules filtered by the selected role
  displayedColumns: string[] = ['module_name', 'permissions'];
  groupedModules: any;
  rolePermissions: any;

  constructor(private fb: FormBuilder,public _appService: AppService) {
    this.permisionForm = this.fb.group({
      role_id: [''],
      permissions: this.fb.array([])
    });
    this.permisionForm.get('role_id')?.valueChanges.subscribe((roleId: any) => {
      this.getRolePermissionData(roleId);
    });
  }
  getRoleData = () => {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/role/get?page=1&page_size=10&is_paginated=false&sort_by=created_at&order=desc`).subscribe((res: any) => {
      this.roleData = res.data.rows;
      this._appService.hideSpinner()
    });
  };
  getPermissionData = () => {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/permission/get?page=1&page_size=10&is_paginated=false&sort_by=created_at&order=desc`).subscribe((res: any) => {
      this.modules = res.data.rows;
      this.groupModules()
     
    });
  };
  
  getRolePermissionData = (roleId:any) => {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/role-permission/get?page=1&page_size=10&is_paginated=false&sort_by=created_at&order=desc`).subscribe((res: any) => {
      this.rolePermissions = res.data.rows;
      Object.keys(this.rolePermissions).forEach((moduleKey) => {
        this.rolePermissions[moduleKey] = this.rolePermissions[moduleKey].filter((permission: any) => {
          return permission.role_id === roleId;
        });
      });
      this.prefillPermissions();
      
      this._appService.hideSpinner();
    });
  };
  prefillPermissions() {
    const permissionsArray = this.permisionForm.get('permissions') as FormArray;
    permissionsArray.clear();

    Object.keys(this.rolePermissions).forEach((moduleKey) => {
      this.rolePermissions[moduleKey].forEach((permission: any) => {
        permissionsArray.push(new FormControl(permission.permission_id));
      });
    });
  }
  groupModules() {
    const grouped = this.modules.reduce((acc:any, module:any) => {
      const found = acc.find((m: any) => m.module_id === module.module_id);
      if (found) {
        found.permissions.push(module);
      } else {
        acc.push({
          module_id: module.module_id,
          module_name: module.module_name,
          permissions: [module]
        });
      }
      return acc;
    }, []);

    this.groupedModules = grouped;
  }
  isPermissionSelected(permissionId: string): boolean {
    const permissionsArray = this.permisionForm.get('permissions') as FormArray;
    return permissionsArray.controls.some((control) => control.value === permissionId);
  }

  onPermissionChange(event: any, permissionId: string) {
    const permissionsArray = this.permisionForm.get('permissions') as FormArray;
    if (event.checked) {
      permissionsArray.push(new FormControl(permissionId));
    } else {
      const index = permissionsArray.controls.findIndex((x) => x.value === permissionId);
      permissionsArray.removeAt(index);
    }
  }

  ngOnInit(): void {
    // Replace with actual data fetch logic
    this.getRoleData()
   this.getPermissionData()
 
  }

  onRoleChange(roleId: string) {
    // Filter modules based on the selected role
    this.filteredModules = this.modules;
  }



  saveModule() {
    const rolePermissionsArray = Array.isArray(this.rolePermissions)
      ? this.rolePermissions
      : Object.values(this.rolePermissions).flat();
  
    const selectedPermissions = this.permisionForm.value.permissions;
  
    const permissionsToUpdate: any[] = [];
    const permissionsToAdd: any[] = [];
    const permissionsToDelete: any[] = [];
  
    // Handle existing permissions
    rolePermissionsArray.forEach((perm: any) => {
      if (selectedPermissions.includes(perm.permission_id)) {
        // Only push to permissionsToUpdate if the permission was originally marked for deletion (del: 1)
        if (perm.del === 1) {
          permissionsToUpdate.push({
            id: perm.id, 
            permission_id: perm.permission_id,
            role_id: this.permisionForm.value.role_id,
            del: 0 // Ensure it's set to 0 (not deleted)
          });
        }
      } else {
        // If the permission was removed, mark it for deletion
        permissionsToDelete.push({
          id: perm.id, 
          permission_id: perm.permission_id,
          role_id: this.permisionForm.value.role_id,
          del: 1 // Set del to 1 (deleted)
        });
      }
    });
  
    // Handle newly added permissions
    selectedPermissions.forEach((permission_id: string) => {
      const existingPermission = rolePermissionsArray.find((perm: any) => perm.permission_id === permission_id);
      if (!existingPermission) {
        // If it's a new permission, add it to the list for adding
        permissionsToAdd.push({
          permission_id,
          role_id: this.permisionForm.value.role_id
        });
      }
    });
  
    const updateData = { permissions: permissionsToUpdate };
    const addData = { permissions: permissionsToAdd };
    const deleteData = { permissions: permissionsToDelete };
  
    if (permissionsToUpdate.length) {
      this._appService.putApiWithAuth('/admin/role-permission/update', updateData, 1).subscribe({
        next: (success: any) => {
          if (success.success) {
            this._appService.success('Update Successfully');
            this.getRolePermissionData(this.permisionForm.value.role_id)
          } else {
            this._appService.error(success.msg);
          }
        },
        error: (error: any) => {
          console.error(error);
          this._appService.err(error?.error?.msg);
        }
      });
    }
  
    if (permissionsToAdd.length) {
      this._appService.postApiWithAuth('/admin/role-permission/add', addData, 1).subscribe({
        next: (success: any) => {
          if (success.success) {
            this._appService.success('Add Successfully');
            this.getRolePermissionData(this.permisionForm.value.role_id)
          } else {
            this._appService.error(success.msg);
          }
        },
        error: (error: any) => {
          console.error(error);
          this._appService.err(error?.error?.msg);
        }
      });
    }
  
    if (permissionsToDelete.length) {
      this._appService.putApiWithAuth('/admin/role-permission/update', deleteData, 1).subscribe({
        next: (success: any) => {
          if (success.success) {
            this._appService.success('Deleted Successfully');
            this.getRolePermissionData(this.permisionForm.value.role_id)
          } else {
            this._appService.error(success.msg);
          }
        },
        error: (error: any) => {
          console.error(error);
          this._appService.err(error?.error?.msg);
        }
      });
    }
  }
  
  update(module: any) {
    // Ensure rolePermissions is an array
    const permissionsArray = Array.isArray(this.rolePermissions) ? this.rolePermissions : [];
  
    // Extract the selected permissions for the specific module
    const selectedPermissions = this.permisionForm.value.permissions.map((permission_id: string) => {
      const existingPermission = permissionsArray.find((perm: any) => perm.permission_id === permission_id);
      return {
        id: existingPermission ? existingPermission.id : undefined, // Include ID if updating
        permission_id,
        role_id: this.permisionForm.value.role_id
      };
    });
  
    // Filter permissions to update and add separately
    const permissionsToUpdate = selectedPermissions.filter((perm: any) => perm.id);
    const permissionsToAdd = selectedPermissions.filter((perm: any) => !perm.id);
  
    // Prepare data for API calls
    const updateData = { permissions: permissionsToUpdate };
    const addData = { permissions: permissionsToAdd };
  
    // Perform API calls for updating existing permissions
    if (permissionsToUpdate.length) {
      this._appService.putApiWithAuth('/admin/role-permission/update', updateData, 1).subscribe({
        next: (success: any) => {
          if (success.success) {
            this._appService.success('Update Successfully');
            // Handle success (e.g., navigate away, close dialog, etc.)
          } else {
            this._appService.error(success.msg);
          }
        },
        error: (error: any) => {
          console.error(error);
          this._appService.err(error?.error?.msg);
        }
      });
    }
  
    // Perform API calls for adding new permissions
    if (permissionsToAdd.length) {
      this._appService.postApiWithAuth('/admin/role-permission/add', addData, 1).subscribe({
        next: (success: any) => {
          if (success.success) {
            this._appService.success('Add Successfully');
            // Handle success (e.g., navigate away, close dialog, etc.)
          } else {
            this._appService.error(success.msg);
          }
        },
        error: (error: any) => {
          console.error(error);
          this._appService.err(error?.error?.msg);
        }
      });
    }
  }
  
  
  

  findPermissionId(permission_id: string): string | undefined {
    for (const moduleKey in this.rolePermissions) {
      const found = this.rolePermissions[moduleKey].find((permission: any) => permission.permission_id === permission_id);
      if (found) {
        return found.id;
      }
    }
    return undefined;
  }

}