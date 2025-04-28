
import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router'; 
import { AppService } from 'src/app.service';
import { ModuleMangementComponent } from 'src/app/module-mangement/module-mangement.component';

@Component({
  selector: 'app-admin-register',
  templateUrl: './admin-register.component.html',
  styleUrls: ['./admin-register.component.scss']
})
export class AdminRegisterComponent {
  submitted: any = false
  formInvalid: any = false
  userSelection: any = {};
  entity_id: any
  countryData: any
  locationImage: any
  image: any
  roleData: any
  userForm!: FormGroup;
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
    this.getRoleData()
    this.userSelection = this.data.adminData
    this.entity_id = this.data.adminData.id
   
   
    // if (data)
    //   this.getRoleData(data)
  }

 

  buildForm = () => {
    this.userForm = this.fb.group({
      id: [''],
      password: ['', [Validators.required]],
      email: ['', [Validators.required]],
      name:['',[Validators.required]],
      role_id:['', [Validators.required]]
     
    })
  }
  getRoleData = () => {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/role/get?page=1&page_size=10&is_paginated=false&sort_by=created_at&order=desc`).subscribe((res: any) => {
      this.roleData = res.data.rows;
      if (this.entity_id) {
        this.setFormvalues()
      }
      this._appService.hideSpinner()
    });
  };
 

  saveModule = async () => {
    this._appService.updateLoading(true)
  
    let data = {
      role_id:this.userForm.value.role_id,
      email: this.userForm.value.email,
      name: this.userForm.value.name,
      password: this.userForm.value.password,
      id:this.data.adminData.id
    }
    if (this.data.adminData?.id) {
      this._appService.putApiWithAuth(`/admin/admin-update`, data, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.success) {
            this._appService.success('Updated Successfully')
            this.route.navigate(['/admin/list'])
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
      this._appService.postApiWithAuth("/admin/register", data, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.success) {
            this._appService.success('Save Successfully')
            this.route.navigate(['/admin/list'])
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
    if (this.roleData && this.userSelection) {
      console.log(this.roleData)
      const selectedRole = this.roleData.find((role: any) => role.name === this.userSelection.role[0]);
  console.log(selectedRole,this.userSelection.role[0])
      this.userForm.patchValue({
        id: this.userSelection.id || null,
        email: this.userSelection.email || null,
        role_id: selectedRole ? selectedRole.id : null, // Use the `id` from the matched role object
        name: this.userSelection.name || null,
      });
    }
  }

  closeDialogBox = () => {
    this.dialogRef.close({'status':'close'})
  }

}
