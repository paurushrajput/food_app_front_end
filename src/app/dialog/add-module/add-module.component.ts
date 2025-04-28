

import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { ModuleMangementComponent } from 'src/app/module-mangement/module-mangement.component';


@Component({
  selector: 'app-add-module',
  templateUrl: './add-module.component.html',
  styleUrls: ['./add-module.component.scss']
})
export class AddModuleComponent {
  submitted: any = false
  formInvalid: any = false
  moduleSelection: any = {};
  entity_id: any
  countryData: any
  locationImage: any
  image: any
  cityData: any
  moduleForm!: FormGroup;
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
    this.moduleSelection = this.data.moduleData
    this.entity_id = this.data.moduleData.id
   
    if (this.entity_id) {
      this.setFormvalues()
    }
    // if (data)
    //   this.getCityData(data)
  }

 

  buildForm = () => {
    this.moduleForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
     
    })
  }

 

  saveModule = async () => {
    this._appService.updateLoading(true)
  
    let data = {
      name: this.moduleForm.value.name,
      id:this.data.moduleData.id
    }
    if (this.data.moduleData?.id) {
      this._appService.putApiWithAuth(`/admin/module/update`, data, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.success) {
            this._appService.success('Updated Successfully')
            this.route.navigate(['/module/list'])
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
      this._appService.postApiWithAuth("/admin/module/add", data, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.success) {
            this._appService.success('Save Successfully')
            this.route.navigate(['/module/list'])
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
    console.log(this.moduleSelection);
    
    this.image = this.moduleSelection.icon
    this.moduleForm.patchValue({
      id: this.moduleSelection.id ? this.moduleSelection.id : null,
      name: this.moduleSelection.name ? this.moduleSelection.name : null,
     
    })
  }

  closeDialogBox = () => {
    this.dialogRef.close({'status':'close'})
  }

}
