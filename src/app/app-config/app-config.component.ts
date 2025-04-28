import { Component } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { UpdateFoodieLeaderboardComponent } from '../dialog/update-foodie-leaderboard/update-foodie-leaderboard.component';

@Component({
  selector: 'app-app-config',
  templateUrl: './app-config.component.html',
  styleUrls: ['./app-config.component.scss']
})
export class AppConfigComponent {
  configForm!: FormGroup;
  configData: any = [];
  dealData: any
  user_invite: any
  ruleData:any
  constructor(
    public _appService: AppService,
    public dialog: MatDialog,
    public router: Router,
    private fb: FormBuilder,
  ) {
    this.configForm = this.fb.group({
      title: [''],
      telr_live: [''],
      skip_allowed: [''],
      is_user_invite_enable: [''],
      is_referral_code_needed: [''],
      skip_allowed_android: [''],
      skip_allowed_ios: [''],
      deal_booked: [''],
      user_invite_messages: [''],
      usr_min_boarding_days: ['']
    });
  }

  ngOnInit() {
    this.loadData()
  }

  loadData() {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/app/list`).subscribe((res: any) => {

      this._appService.hideSpinner()
      let skipData = res.data
      this.configData = skipData.filter((element: any) => element.title === 'skip_setting');
      this.dealData = skipData.filter((element: any) => element.title === 'deal_setting');
      this.user_invite = skipData.filter((element: any) => element.title === 'user_invite_messages');
      this.ruleData=skipData.filter((element: any) => element.title === 'foodie_lb_rules');
      this.setFormvalues()
    },
      (error) => {
        if (error?.error?.success == false) {
          this._appService.hideSpinner()
          this._appService.err(error?.error?.msg)
        }
        if (error?.error?.status_code == 401) {
          this._appService.hideSpinner()
          localStorage.removeItem('authtoken')
          this.router.navigateByUrl("/");
        }
      }
    )
  }


  updateConfig = async () => {
    let data = {
      value: {
        telr_live: Number(this.configForm.value.telr_live),
        skip_allowed_android: Number(this.configForm.value.skip_allowed_android),
        skip_allowed_ios: Number(this.configForm.value.skip_allowed_ios),
        is_user_invite_enable: Number(this.configForm.value.is_user_invite_enable),
        is_referral_code_needed: Number(this.configForm.value.is_referral_code_needed),
        usr_min_boarding_days: Number(this.configForm.value.usr_min_boarding_days),
      },
      title: this.configForm.value.title
    }
    this._appService.updateLoading(true)
    this._appService.putApiWithAuth(`/admin/app/update/${this.configData[0].uid}`, data, 1).subscribe({
      next: (success: any) => {
        this.updateDeal()
        this._appService.updateLoading(false)
        if (success.status_code == 200) {
          this.updateDeal()
          this.updateUserInviteConfig()
          // this._appService.success('Updated Successfully')
          // this.loadData()
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


  updateRule() {
    const dialogRef = this.dialog.open(UpdateFoodieLeaderboardComponent, {
      hasBackdrop: false,
      width: '575px',
      // height: '80px',
      data: {
        ruleData: this.ruleData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadData()
    });
  }

  updateDeal = async () => {
    let data = {
      value: {
        deal_booked: Number(this.configForm.value.deal_booked)
      },
      config_id: this.dealData[0]?.uid,
    }
    this._appService.updateLoading(true)
    this._appService.putApiWithAuth(`/admin/app/update/${this.dealData[0]?.uid}`, data, 1).subscribe({
      next: (success: any) => {
        this._appService.updateLoading(false)
        if (success.status_code == 200) {
          // this.updateUserInviteConfig()
          // this._appService.success('Updated Successfully')
          // this.loadData()
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

  updateUserInviteConfig = async () => {
    let data = {
      value: {
        SKIP: this.configForm.value.user_invite_messages == '1' ? 'Skip' : '',
      },
    }
    this._appService.updateLoading(true)
    this._appService.putApiWithAuth(`/admin/app/update/${this.user_invite[0].uid}`, data, 1).subscribe({
      next: (success: any) => {
        this._appService.updateLoading(false)
        if (success.status_code == 200) {
          this._appService.success('Updated Successfully')
          this.loadData()
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



  setFormvalues = () => {
    console.log(this.dealData[0]?.value);

    this.configForm.patchValue({
      title: this.configData[0]?.title ? this.configData[0]?.title : null,
      telr_live: this.configData[0]?.value.telr_live == 1 ? '1' : "0",
      skip_allowed: this.configData[0]?.value.skip_allowed == 1 ? '1' : "0",
      is_user_invite_enable: this.configData[0]?.value.is_user_invite_enable == 1 ? '1' : "0",
      usr_min_boarding_days: this.configData[0]?.value?.usr_min_boarding_days,
      is_referral_code_needed: this.configData[0]?.value.is_referral_code_needed == 1 ? '1' : "0",
      skip_allowed_android: this.configData[0]?.value.skip_allowed_android == 1 ? '1' : "0",
      skip_allowed_ios: this.configData[0]?.value?.skip_allowed_ios == 1 ? '1' : "0",
      deal_booked: this.dealData[0]?.value?.deal_booked == 1 ? '1' : "0",
      user_invite_messages: this.user_invite[0]?.value?.SKIP == 'Skip' ? '1' : "0",
    })
  }
}
