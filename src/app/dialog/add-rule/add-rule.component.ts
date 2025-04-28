import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { TournamentRuleManagementComponent } from 'src/app/tournament-rule-management/tournament-rule-management.component';

@Component({
  selector: 'app-add-rule',
  templateUrl: './add-rule.component.html',
  styleUrls: ['./add-rule.component.scss']
})
export class AddRuleComponent {
  submitted: any = false
  formInvalid: any = false
  newRule!: FormGroup;
  
  constructor(
    private route: Router,
    private fb: FormBuilder, private formBuilder: FormBuilder,
    public _appService: AppService,
    public dialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<TournamentRuleManagementComponent>
  ) {
    this.buildForm();
  }
  ngOnInit(): void {
  }

  closeDialogBox() {
     this.dialogRef.close({'status':'close'});
  }
  get f() { return this.newRule.controls; }
  buildForm = () => {
    this.newRule = this.fb.group({
      _id: [''],
      name: ['', [Validators.required]],
     rule: this.formBuilder.array([], [this.ruleArrayValidator]),
    });
  };
  ruleArrayValidator(control: any) {
    return control && control.length > 0 ? null : { required: true };
  }
  get rulesArray() {
    return this.newRule.get('rule') as FormArray;
  }
  removeRule(index: number) {
    this.rulesArray.removeAt(index);
  }
  addRules() {
    this.rulesArray.push(this.formBuilder.control('', Validators.required));
  }

  saveRule() {
    if (this.newRule.invalid) {
      this.formInvalid = true
      this.submitted = true
      return
    }
    this.submitted = false;
    this._appService.updateLoading(true)
    console.log(this.newRule.value);

    
    this._appService.postApiWithAuth('/admin/tournament-rule/', this.newRule.value, 1).subscribe({
      next: (success: any) => {
        this._appService.updateLoading(false)
        console.log(success);
        if (success.status_code == 200) {
          this.dialogRef.close({ event: 'close' });
        } else {
          console.log('api error');
        }
      },
      error: (error: any) => {
        this._appService.updateLoading(false)
        this._appService.err(error?.error?.msg)
      },
    });
  }
}
