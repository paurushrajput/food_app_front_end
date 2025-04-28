import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app.service';
import { DealMngmtComponent } from 'src/app/deal-mngmt/deal-mngmt.component';

@Component({
  selector: 'app-deal-enable-credits',
  templateUrl: './deal-enable-credits.component.html',
  styleUrls: ['./deal-enable-credits.component.scss']
})
export class DealEnableCreditsComponent {
  text: any
  selectedDeal: any
  restaurantData: any
  dealOption!: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<DealMngmtComponent>,
    public dialog: MatDialog, private fb: FormBuilder,
    public _appService: AppService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.buildForm()
  }

  ngOnInit(): void {
    this.selectedDeal = this.data;
    this.text = this.selectedDeal.free_with_nukhba_credits == 1 ? 'Disable' : 'Enable'
  }

  buildForm = () => {
    this.dealOption = this.fb.group({
      id: [''],
      free_with_nukhba_credits: []
    })
  }

  updateDeal() {
    let data = {
      deal_id: this.data.id,
      free_with_nukhba_credits: Number(this.selectedDeal.free_with_nukhba_credits == 1 ? 0 : 1)
    }
    this._appService.putApiWithAuth(`/admin/deal/update`, data, 1).subscribe((success: any) => {
      if (success.success) {
        this._appService.success(success.msg)
        this.dialogRef.close({ event: 'close' });
      } else {
        this._appService.error(success.msg)
        this.dialogRef.close({ event: 'close' });
      }
    }, (error) => {
      this._appService.err(error?.error?.msg)
    })
  }

  closeDialogBox(): void {
    this.dialogRef.close();
  }
  
}
