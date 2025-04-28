import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { DinningManagementComponent } from 'src/app/dinning-management/dinning-management.component';

@Component({
  selector: 'app-add-dinning',
  templateUrl: './add-dinning.component.html',
  styleUrls: ['./add-dinning.component.scss']
})
export class AddDinningComponent {

  selectedDinning: any = {};
  submitted: any = false
  formInvalid: any = false
  entity_id: any
  image: any
  dinningForm!: FormGroup;
  constructor(public _appService: AppService,
    private route: Router, private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, public dialogRef: MatDialogRef<DinningManagementComponent>
  ) {
    this.buildForm()
  }

  ngOnInit(): void {
    this.selectedDinning = this.data.dinningData
    this.entity_id = this.data.dinningData.id
    if (this.data.dinningData.id)
      this.setFormvalues()
  }

  buildForm = () => {
    this.dinningForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      status: ['']
    })
  }

  saveDinning = async () => {
    this._appService.updateLoading(true)
    if (this.dinningForm.value.id != '') {
      console.log(this.data);
      let data = {
        name: this.dinningForm.value.name,
        status: this.dinningForm.value.status,
        id: this.data?.dinningData?.id,
      }
      this._appService.putApiWithAuth(`/admin/dinnings/update`, data, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.status_code == 200) {
            this._appService.success(success.msg)
            this.route.navigate(['/dinning/list'])
            this.dialogRef.close({ event: 'close' });
          }
          else {
            this._appService.error(success.msg)
          }
        },
        error: (error: any) => {
          this._appService.updateLoading(false)
          console.log({ error })
        }
      })
    }
    else {
      console.log('ee')
      let data = {
        name: this.dinningForm.value.name,
        status: this.dinningForm.value.status,
      }
      this._appService.postApiWithAuth("/admin/dinnings/add", data, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.status_code == 200) {
            this.route.navigate(['/dinning/list'])
            this._appService.success(success.msg)
            this.dialogRef.close({ event: 'close' });
          }
          else {
            this._appService.error(success.msg)
          }
        },
        error: (error: any) => {
          this._appService.updateLoading(false)
          console.log({ error })
        }
      })
    }

  }

  setFormvalues = () => {
    console.log(this.selectedDinning);
    this.image = this.selectedDinning.icon
    this.dinningForm.patchValue({
      id: this.selectedDinning.id ? this.selectedDinning.id : null,
      name: this.selectedDinning.name ? this.selectedDinning.name : null,
      type: this.selectedDinning.type ? this.selectedDinning.type : null,
      status: this.selectedDinning.status ? this.selectedDinning.status.toString() : null,
    })
  }

  closeDialogBox = () => {
     this.dialogRef.close({'status':'close'})
  }

}
