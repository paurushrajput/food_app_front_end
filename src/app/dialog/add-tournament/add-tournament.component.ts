import { Component, ElementRef, Inject, Optional, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { TournamentManagementComponent } from 'src/app/tournament-management/tournament-management.component';

@Component({
  selector: 'app-add-tournament',
  templateUrl: './add-tournament.component.html',
  styleUrls: ['./add-tournament.component.scss']
})
export class AddTournamentComponent {

  newTrmt!: FormGroup;
  submitted: any = false
  formInvalid: any = false
  selectedTournament: any = {};
  imageURL: any = "";
  thumbnailUrl: any = "";
  image: any = "";
  selectRedeemImage: any = "";
  gameData: any;
  breakupData: any;
  ruleData: any;
  tournamentImage: any
  redeemImage: any
  entity_id: any
  imageSize: any;
  constructor(
    private route: Router,
    public _appService: AppService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<TournamentManagementComponent>
  ) {
    this.newTrmt = this.fb.group({
      _id: [''],
      game_id: ['', [Validators.required]],
      title: ['', [Validators.required]],
      date_start: ['', [Validators.required]],
      date_end: ['', [Validators.required]],
      image: ['', [Validators.required]],
      image_on_redeem_page: [''],
      game_url: [''],
      game_name: [''],
      winner_breakup_id: ['', [Validators.required]],
      tournament_rule_id: ['', [Validators.required]],
      user_referral_points: ['200', [Validators.required]]
    });
  }

  @ViewChild('datetimePicker') datetimePicker: MatDateRangePicker<any> | undefined;
  @ViewChild('dateEndtimePicker') dateEndtimePicker: MatDateRangePicker<any> | undefined;
  @ViewChild('startInput') startInput: ElementRef | undefined;
  @ViewChild('endInput') endInput: ElementRef | undefined;
  ngAfterViewInit(): void {
    this.startInput?.nativeElement.addEventListener('click', () => this.datetimePicker?.open());
    this.endInput?.nativeElement.addEventListener('click', () => this.dateEndtimePicker?.open());
  }

  ngOnInit(): void {
    console.log(this.data);

    this.getGameList()
    this.getRules()
    this.getBreakup()
    this.selectedTournament = this.data?.tournamentData;
    this.newTrmt.patchValue({ game_id: this.selectedTournament?.client_game_id })
    this.entity_id = this.data.tournamentData.id
    if (this.data.tournamentData.id) {
      this.setFormvalues();
    }
  }

  closeDialogBox() {
    this.dialogRef.close({ 'status': 'close' });
  }

  uploadImage() {
    if (this.tournamentImage) {
      let formData = new FormData();
      formData.append('file', this.tournamentImage)
      var promise = new Promise((resolve, reject) => {
        this._appService.postApiWithAuthentication(`/admin/media/image`, formData, 1).subscribe({
          next:
            (success: any) => {
              if (success.success == true) {
                // this._appService.success('Image upload successfully')
                return resolve(success.data.media_id)
              }
            },
          error: (error: any) => {
            this._appService.err(error?.error?.msg)
          }
        })
      });
      return promise
    } else {
      return null;
    }
  }

  uploadRedeemImage() {
    if (this.redeemImage) {
      let formData = new FormData();
      formData.append('file', this.redeemImage)
      var promise = new Promise((resolve, reject) => {
        this._appService.postApiWithAuthentication(`/admin/media/image`, formData, 1).subscribe({
          next:
            (success: any) => {
              if (success.success == true) {
                // this._appService.success('Image upload successfully')
                return resolve(success.data.media_id)
              }
            },
          error: (error: any) => {
            this._appService.err(error?.error?.msg)
          }
        })
      });
      return promise
    } else {
      return null;
    }
  }

  saveLeaderBoardReward = async () => {
    console.log('2222');

    if (this.newTrmt.invalid) {
      return
    }
    this._appService.updateLoading(true)
    this.submitted = true
    console.log('1111');
    
    const imageBanner = await this.uploadImage();
    const imageRedeem = await this.uploadRedeemImage();
    let findGameUrl = this.gameData.find((t: any) => {
      return t.client_game_id == this.newTrmt.value.game_id
    })
    this.newTrmt.controls['game_url'].setValue(findGameUrl.game_url)
    this.newTrmt.controls['game_name'].setValue(findGameUrl.title)
    let data = {
      "game_id": this.newTrmt.value.game_id,
      "game_url": this.newTrmt.value.game_url,
      "game_name": this.newTrmt.value.game_name,
      "title": this.newTrmt.value.title,
      "image_id": imageBanner,
      "image_on_redeem_page": imageRedeem,
      "date_start": this.newTrmt.value.date_start.getTime() / 1000,
      "date_end": this.newTrmt.value.date_end.getTime() / 1000,
      "winner_breakup_id": this.newTrmt.value.winner_breakup_id,
      "tournament_rule_id": this.newTrmt.value.tournament_rule_id,
      "user_referral_points": this.newTrmt.value.user_referral_points
    }
    if (this.newTrmt.value._id != '' && this.newTrmt.value._id != null) {
      let datav1

      try {

      if (imageBanner) {
        datav1 = {
          "id": this.newTrmt.value._id,
          "game_id": this.newTrmt.value.game_id,
          "game_url": this.newTrmt.value.game_url,
          "game_name": this.newTrmt.value.game_name,
          "title": this.newTrmt.value.title,
          "image_id": imageBanner,
          "date_start": this.newTrmt.value.date_start.getTime() / 1000,
          "date_end": this.newTrmt.value.date_end.getTime() / 1000,
          "winner_breakup_id": this.newTrmt.value.winner_breakup_id,
          "tournament_rule_id": this.newTrmt.value.tournament_rule_id,
          "user_referral_points": this.newTrmt.value.user_referral_points
        }
      } else {
        datav1 = {
          "id": this.newTrmt.value._id,
          "game_id": this.newTrmt.value.game_id,
          "game_url": this.newTrmt.value.game_url,
          "game_name": this.newTrmt.value.game_name,
          "title": this.newTrmt.value.title,
          "date_start": this.newTrmt.value.date_start.getTime() / 1000,
          "date_end": this.newTrmt.value.date_end.getTime() / 1000,
          "winner_breakup_id": this.newTrmt.value.winner_breakup_id,
          "tournament_rule_id": this.newTrmt.value.tournament_rule_id,
          "user_referral_points": this.newTrmt.value.user_referral_points
        }
      }
      console.log('@@@',imageRedeem);
      
      if (imageRedeem) {
        Object.assign(datav1, { image_on_redeem_page: imageRedeem });
      }
              
    } catch (error) {
        console.log(error);
        
    }
      this._appService
        .putApiWithAuth(`/admin/tournaments/update`, datav1, 1)
        .subscribe({
          next: (success: any) => {
            console.log(success);
            this._appService.updateLoading(false)
            if (success.status_code == 200) {
              this.route.navigate(['/tournament/list']);
              this.dialogRef.close({ event: 'close' });
            } else {
            this._appService.err(success.msg)
              console.log('api error');
            }
          },
          error: (error: any) => {
            this._appService.updateLoading(false)
            console.log({ error });
          },
        });
    } else {
      this.submitted = true
      if (this.newTrmt.invalid) {
        this.formInvalid = true
        this._appService.updateLoading(false)
        return
      }
      this._appService.postApiWithAuth('/admin/tournaments/add', data, 1).subscribe({
        next: (success: any) => {
          this._appService.updateLoading(false)
          if (success.status_code == 200) {
            this.route.navigate(['/tournament/list']);
            this.dialogRef.close({ event: 'close' });
            this._appService.success(success.msg)
          } else {
            this._appService.err(success.msg)
            console.log('api error');
          }
        },
        error: (error: any) => {
          this._appService.updateLoading(false)
          this._appService.err(error?.error?.msg)
          console.log({ error });
        },
      });
    }
  }

  onFileSelected(fileInput: any) {
    if (fileInput.target.files.length > 0) {
      const file: File = fileInput.target.files[0]
      this.imageSize = this._appService.formatBytes(file.size);
      this.tournamentImage = file
      const reader = new FileReader();
      reader.onload = () => {
        this.image = reader.result as string;
      }
      reader.readAsDataURL(file)
    }
  }

  onFileSelectedRedeem(fileInput: any) {
    if (fileInput.target.files.length > 0) {
      const file: File = fileInput.target.files[0]
      this.imageSize = this._appService.formatBytes(file.size);
      this.redeemImage = file
      const reader = new FileReader();
      reader.onload = () => {
        this.selectRedeemImage = reader.result as string;
      }
      reader.readAsDataURL(file)
    }
  }

  setFormvalues = () => {
    this.image = this.selectedTournament.image
    this.selectRedeemImage = this.selectedTournament?.other_details?.image_on_redeem_page
    this.newTrmt.patchValue({
      _id: this.selectedTournament.id ? this.selectedTournament.id : null,
      game_id: this.selectedTournament.game_id ? this.selectedTournament.game_id : null,
      title: this.selectedTournament.title ? this.selectedTournament.title : null,
      image: this.selectedTournament.image ? this.selectedTournament.image : null,
      date_start: new Date(this.selectedTournament.date_start * 1000),
      date_end: new Date(this.selectedTournament.date_end * 1000),
      winner_breakup_id: this.selectedTournament.winner_breakup_id ? this.selectedTournament.winner_breakup_id : null,
      tournament_rule_id: this.selectedTournament.tournament_rule_id ? this.selectedTournament.tournament_rule_id : null,
      // user_referral_points: this.selectedTournament.user_referral_points ? this.selectedTournament.user_referral_points.toString() : null
    });
  };

  getGameList = () => {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/tournaments/get-game-list?is_paginated=false`).subscribe((res: any) => {
      this.gameData = res.data;
      this._appService.hideSpinner()
    });
  };

  getBreakup = () => {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/winner-breakup/list?is_paginated=false`).subscribe((res: any) => {
      this.breakupData = res.data.rows;
      this._appService.hideSpinner()
    });
  };

  getRules = () => {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/tournament-rule/list?is_paginated=false`).subscribe((res: any) => {
      this.ruleData = res.data.rows;
      this._appService.hideSpinner()
    });
  };
}