import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { CategoryManagementComponent } from 'src/app/category-management/category-management.component';

@Component({
  selector: 'app-add-agent',
  templateUrl: './add-agent.component.html',
  styleUrls: ['./add-agent.component.scss']
})
export class AddAgentComponent {
  sportsType: any = [];
  selectedCategory: any = {};
  submitted: any = false
  formInvalid: any = false
  entity_id: any
  categoryImage: any
  image: any
  agentForm!: FormGroup;
  imageSize: any;
  locationData: any
  constructor(public _appService: AppService,
    private route: Router, private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, public dialogRef: MatDialogRef<CategoryManagementComponent>
  ) {
    this.buildForm()
  }

  ngOnInit(): void {
    this.getLocationList()
    this.selectedCategory = this.data
    this.entity_id = this.data.id
    // this.setFormvalues()
  }

  buildForm = () => {
    this.agentForm = this.fb.group({
      id: [''],
      agent_username: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      // device_id: ['', [Validators.required]],
      location_id: ['', [Validators.required]],
      device_type: ['web', [Validators.required]],
      referral_code: ['']
    })
  }


  getLocationList = () => {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/location?is_paginated=false&status=1`).subscribe((res: any) => {
      this.locationData = res.data.rows;
      this._appService.hideSpinner()
    });
  };

  generateRandomAlphanumeric() {
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    let charactersLength = characters.length;
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }


  createAgent = async () => {
    // if (this.agentForm.invalid) {
    //   this.formInvalid = true;
    //   this.submitted = true;
    //   return;
    // }
    // this.submitted = false;
    this._appService.updateLoading(true)
    let data = {
      "device_type": this.agentForm.value.device_type,
      "location_id": this.agentForm.value.location_id,
      "agent_username": this.agentForm.value.agent_username,
      "password": this.agentForm.value.password,
      "first_name": this.agentForm.value.first_name,
      "last_name": this.agentForm.value.last_name,
      "referral_code": this.agentForm.value.referral_code,
      "device_id": this.generateRandomAlphanumeric()
    }
    if (this.agentForm.value.email) {
      Object.assign(data, { 'email': this.agentForm.value.email });
    }
    // if (this.agentForm.value.id != '') {
    //   this._appService.putApiWithAuth(`/admin/categories/${this.data.uid}`, data, 1).subscribe({
    //     next: (success: any) => {
    //       this._appService.updateLoading(false)
    //       if (success.status_code == 200) {
    //         this._appService.success('Updated Successfully')
    //         this.route.navigate(['/category/list'])
    //         this.dialogRef.close({ event: 'close' });
    //       }
    //       else {
    //         this._appService.error(success.msg)
    //       }
    //     },
    //     error: (error: any) => {
    //       this._appService.updateLoading(false)
    //       console.log({ error })
    //       this._appService.err(error?.error?.msg)
    //     }
    //   })
    // }
    // else {
    // const findName = this.data.response.some((element: any) => element.name == this.agentForm.value.name);
    // if (findName) {
    //   return this._appService.err('Cuisine name already exist');
    // }
    this._appService.postApiWithAuth("/admin/agent/add", data, 1).subscribe({
      next: (success: any) => {
        this._appService.updateLoading(false)
        if (success.status_code == 200) {
          this._appService.success('Save Successfully')
          this.route.navigate(['/agent/list'])
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
    // }

  }

  // setFormvalues = () => {
  //   console.log(this.selectedCategory);
  //   this.image = this.selectedCategory.icon
  //   this.agentForm.patchValue({
  //     id: this.selectedCategory.id ? this.selectedCategory.id : null,
  //     name: this.selectedCategory.name ? this.selectedCategory.name : null,
  //      icon: this.selectedCategory.icon ? this.selectedCategory.icon : null,
  //     status: this.selectedCategory.status == 1 ? '1' : '0',
  //   })
  // }

  closeDialogBox = () => {
     this.dialogRef.close({'status':'close'})
  }

}

