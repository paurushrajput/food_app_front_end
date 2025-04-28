import { throwDialogContentAlreadyAttachedError } from '@angular/cdk/dialog';
import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { CommentReportComponent } from 'src/app/comment-report/comment-report.component';
import { ReservationManagementComponent } from 'src/app/reservation-management/reservation-management.component';

@Component({
  selector: 'app-confirm-report-status',
  templateUrl: './confirm-report-status.component.html',
  styleUrls: ['./confirm-report-status.component.scss']
})
export class ConfirmReportStatusComponent {

  submitted: any = false
  formInvalid: any = false
  bookingCancelForm!: FormGroup;
  constructor(
    private route: Router,
    private fb: FormBuilder, private formBuilder: FormBuilder,
    public _appService: AppService,
    public dialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<CommentReportComponent>
  ) {
    this.buildForm();
  }
  ngOnInit(): void {
    console.log(this.data);

  }

  closeDialogBox() {
    this.dialogRef.close({ 'status': 'close' });
  }
  get f() { return this.bookingCancelForm.controls; }
  buildForm = () => {
    this.bookingCancelForm = this.fb.group({
      report_id: [this.data.reportData?.id],
      message: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });
  };


  submit() {
    if (this.bookingCancelForm.invalid) {
      this.formInvalid = true
      this.submitted = true
      return
    }
    this._appService.updateLoading(true)
    this.submitted = false;
    this._appService.postApiWithAuth('/admin/report/update', this.bookingCancelForm.value, 1).subscribe({
      next: (success: any) => {
        this._appService.updateLoading(false)
        if (success.success) {
          this.dialogRef.close({ event: 'close' });
          this._appService.success(success.msg)
        } else {
          console.log('api error');
          this.dialogRef.close({ event: 'close' });
          this._appService.err(success.msg)
        }
      },
      error: (error: any) => {
        this._appService.updateLoading(false)
        console.log({ error });
        this.dialogRef.close({ 'status': 'close' });
        this._appService.err(error.error.msg)
      },
    });
  }
}
