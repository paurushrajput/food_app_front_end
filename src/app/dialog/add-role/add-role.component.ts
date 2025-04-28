import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { RoleManagementComponent } from 'src/app/role-management/role-management.component';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent {
  submitted: any = false
  formInvalid: any = false
  roleSelection: any = {};
  entity_id: any
  countryData: any
  locationImage: any
  image: any
  cityData: any
  roleForm!: FormGroup;
  imageSize: any;
  constructor(public _appService: AppService,
    private route: Router, private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, public dialogRef: MatDialogRef<RoleManagementComponent>
  ) {
    this.buildForm()
  }

  ngOnInit(): void {
    // this.getCountryData()
    this.roleSelection = this.data.roleData
    this.entity_id = this.data.roleData.id
   
    if (this.entity_id) {
      this.setFormvalues()
    }
    // if (data)
    //   this.getCityData(data)
  }

 

  buildForm = () => {
    this.roleForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
     
    })
  }

 

  saveLocation = async () => {
    this._appService.updateLoading(true)
  
    let data = {
      name: this.roleForm.value.name,
      id:this.data.roleData.id
    }
    if (this.data.roleData?.id) {
      this._appService.putApiWithAuth(`/admin/role/update`, data, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.success) {
            this._appService.success('Updated Successfully')
            this.route.navigate(['/role/list'])
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
      this._appService.postApiWithAuth("/admin/role/add", data, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.success) {
            this._appService.success('Save Successfully')
            this.route.navigate(['/role/list'])
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
    console.log(this.roleSelection);
    
    this.image = this.roleSelection.icon
    this.roleForm.patchValue({
      id: this.roleSelection.id ? this.roleSelection.id : null,
      name: this.roleSelection.name ? this.roleSelection.name : null,
     
    })
  }

  closeDialogBox = () => {
    this.dialogRef.close({'status':'close'})
  }

}
