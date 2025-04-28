import { Component, ElementRef, Inject, Optional, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { CampaignManagementComponent } from 'src/app/campaign-management/campaign-management.component';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-add-campaign',
  templateUrl: './add-campaign.component.html',
  styleUrls: ['./add-campaign.component.scss']
})
export class AddCampaignComponent {
  couponData: any
  userList: any
  selectedCampaign: any = {};
  submitted: any = false
  formInvalid: any = false
  entity_id: any
  image: any
  campaignForm!: FormGroup;
  imageSize: any;
  constructor(public _appService: AppService,
    private route: Router, private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, public dialogRef: MatDialogRef<CampaignManagementComponent>
  ) {
    this.buildForm()
  }

  ngOnInit(): void {
    this.getUserList()
    this.getCouponList('')
    this.selectedCampaign = this.data.categoryData
    this.entity_id = this.data.categoryData.id
    if (this.data.categoryData.id)
      this.setFormvalues()
  }

  buildForm = () => {
    this.campaignForm = this.fb.group({
      id: [''],
      title: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      commission_type: ['0', [Validators.required]],
      commission_amount: ['', [Validators.required]],
      agent_id: ['', [Validators.required]],
      coupon_id: ['', [Validators.required]],
      action: ['', [Validators.required]]
    })
  }

  @ViewChild('datetimePicker') datetimePicker: MatDateRangePicker<any> | undefined;
  @ViewChild('dateEndtimePicker') dateEndtimePicker: MatDateRangePicker<any> | undefined;
  @ViewChild('startInput') startInput: ElementRef | undefined;
  @ViewChild('endInput') endInput: ElementRef | undefined;

  ngAfterViewInit(): void {
    this.startInput?.nativeElement.addEventListener('click', () => this.datetimePicker?.open());
    this.endInput?.nativeElement.addEventListener('click', () => this.dateEndtimePicker?.open());
  }

  getCouponList = (query: any) => {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/coupons/list?is_paginated=false&is_expired=0&is_deleted=0${query}`).subscribe((res: any) => {
      this.couponData = res.data.rows;
      this._appService.hideSpinner()

    });
  };

  onChange() {
    let query = `&is_deleted=1`
    if (this.campaignForm.value.agent_id) {
      query += `&type=6`
    } else {
      query += `&type=5`
    }
    this.getCouponList(query)
  }

  getUserList() {
    this._appService.getApiWithAuth(`/admin/agent/list?page=1&page_size=100&is_paginated=false`).subscribe((res: any) => {
      this.userList = res.data?.list
      if (this.selectedCampaign && this.selectedCampaign.agent_id) {
        this.setFormvalues();  // Move setFormvalues here
      }
    },
      (error) => {
      })
  }

  saveCampaign =  () => {
    // if (this.campaignForm.invalid) {
    //   return ;
    // } else {
      this._appService.updateLoading(true)


      if (this.campaignForm.value.id != '') {
        let data = {
          "id": this.selectedCampaign.id,
          "title": this.campaignForm.value.title,
          "start_date": this.campaignForm.value.start_date.getTime() / 1000,
          "end_date": this.campaignForm.value.end_date.getTime() / 1000,
          "commission_type": this.campaignForm.value.commission_type,
          "coupon_id": this.campaignForm.value.coupon_id,
        }
        if (this.campaignForm.value.agent_id) {
          Object.assign(data, { 'agent_id': this.campaignForm.value.agent_id });
          Object.assign(data, { 'action': this.campaignForm.value.action });
          Object.assign(data, { 'commission_amount': this.campaignForm.value.commission_amount });
        }
        this._appService.putApiWithAuth(`/admin/campaign/update`, data, 1).subscribe({
          next: (success: any) => {
            this._appService.updateLoading(false)
            if (success.status_code == 200) {
              this._appService.success('Updated Successfully')
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
        let data = {
          "title": this.campaignForm.value.title,
          "start_date": this.campaignForm.value.start_date.getTime() / 1000,
          "end_date": this.campaignForm.value.end_date.getTime() / 1000,
          "commission_type": this.campaignForm.value.commission_type,
          "coupon_id": this.campaignForm.value.coupon_id,
        }
        if (this.campaignForm.value.agent_id) {
          Object.assign(data, { 'agent_id': this.campaignForm.value.agent_id });
          Object.assign(data, { 'action': this.campaignForm.value.action });
          Object.assign(data, { 'commission_amount': this.campaignForm.value.commission_amount });
        }
        this._appService.postApiWithAuth("/admin/campaign/add", data, 1).subscribe({
          next: (success: any) => {
            this._appService.updateLoading(false)
            if (success.status_code == 200) {
              this._appService.success('Save Successfully')
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
    // }
  }

  transform(gmtTime: string): string {
    if (!gmtTime) return 'N/A';
    const gmtMoment = moment.tz(gmtTime, 'GMT');
    const gstMoment = gmtMoment.tz('Asia/Dubai');
    const formattedDate = gstMoment.format('DD-MMM-YY HH:mm');
    // console.log(formattedDate[0] + '<br/>' + formattedDate[1])
    return formattedDate
  }

  setFormvalues = () => {
    this.campaignForm.patchValue({
      id: this.selectedCampaign.id ? this.selectedCampaign.id : null,
      title: this.selectedCampaign.title ? this.selectedCampaign.title : null,
      start_date: new Date(this.transform(this.selectedCampaign.start_date)),
      end_date: new Date(this.transform(this.selectedCampaign.end_date)),
      // commission_type: this.selectedCampaign.commission_type ? this.selectedCampaign.commission_type.value.toString() : null,
      commission_amount: this.selectedCampaign.commission_amount ? this.selectedCampaign.commission_amount : null,
      agent_id: this.selectedCampaign.agent_id || '',
      coupon_id: this.selectedCampaign.coupon_id ? this.selectedCampaign.coupon_id : null,
      action: this.selectedCampaign.action ? this.selectedCampaign.action?.value?.toString() : null
    })
  }

  closeDialogBox = () => {
    this.dialogRef.close({ 'status': 'close' })
  }

}
