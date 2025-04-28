import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { AppConfigComponent } from 'src/app/app-config/app-config.component';

@Component({
  selector: 'app-update-foodie-leaderboard',
  templateUrl: './update-foodie-leaderboard.component.html',
  styleUrls: ['./update-foodie-leaderboard.component.scss']
})
export class UpdateFoodieLeaderboardComponent {

  submitted: any = false
  formInvalid: any = false
  updateLeaderboardForm!: FormGroup;
  selectedCategory: any = {};

  constructor(
    private route: Router,
    private fb: FormBuilder, private formBuilder: FormBuilder,
    public _appService: AppService,
    public dialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AppConfigComponent>
  ) {
    this.buildForm();
  }
  ngOnInit(): void {
    this.selectedCategory = this.data?.ruleData[0]
    this.setFormvalues()

  }

  closeDialogBox() {
    this.dialogRef.close({ 'status': 'close' });
  }
  
  buildForm = () => {
    this.updateLeaderboardForm = this.fb.group({
      title: [this.data.ruleData[0]?.title],
      data: ['', [Validators.required]],
    });
  };


  submit() {
    if (this.updateLeaderboardForm.invalid) {
      this.formInvalid = true
      this.submitted = true
      return
    }
    this._appService.updateLoading(true)
    this.submitted = false;
    let data = {
      uid: this.data.ruleData[0]?.uid,
      title: this.data.ruleData[0]?.title,
      status: 1,
      value: {},
      data: this.updateLeaderboardForm.value.data
    }
    this._appService.putApiWithAuth(`/admin/app/update/${this.data.ruleData[0]?.uid}`, data, 1).subscribe({
      next: (success: any) => {
        this._appService.updateLoading(false)
        if (success.success) {
          this.dialogRef.close()
          this._appService.success(success.msg)
        } else {
          console.log('api error');
          this.dialogRef.close()
          this._appService.err(success.msg)
        }
      },
      error: (error: any) => {
        this._appService.updateLoading(false)
        console.log({ error });
        this.dialogRef.close()
        this._appService.err(error.error.msg)
      },
    });
  }

  setFormvalues = () => {
    this.updateLeaderboardForm.patchValue({
      id: this.selectedCategory.id ? this.selectedCategory.id : null,
      title: this.selectedCategory.title ? this.selectedCategory.title : null,
      data: this.selectedCategory.data ? this.selectedCategory.data : null,
    })
  }
}
