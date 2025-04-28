import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { CATEGORY } from '../view-leaderboard/view-leaderboard.component';
import { SocialRestaurantManagementComponent } from 'src/app/social-restaurant-management/social-restaurant-management.component';
@Component({
  selector: 'app-favorite-dishes',
  templateUrl: './favorite-dishes.component.html',
  styleUrls: ['./favorite-dishes.component.scss']
})
export class FavoriteDishesComponent {
  cuisineData: any
  cuisinesForm!: FormGroup;

  dataSource: MatTableDataSource<CATEGORY> = new MatTableDataSource();
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SocialRestaurantManagementComponent>,
    public _appService: AppService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,

  ) {
    this.buildForm()
  }

  ngOnInit() {
    this.loadData()
  }


  buildForm = () => {
    this.cuisinesForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
    })
  }

  loadData() {
    this._appService.showSpinner();
    this._appService.getApiWithAuth(`/admin/social/suggested-cusines-list?res_id=${this.data?.postData?.restaurant_uid}&is_paginated=false`).subscribe((res: any) => {
      this._appService.hideSpinner();
      // this.dataSource.data = res.data?.rows
      this.cuisineData = res.data?.rows?.cusines
    }, (error) => {
      if (error?.error?.status_code) {
        this.router.navigateByUrl("/");
        localStorage.removeItem('authtoken');
      }
    });
  }

  remove(item: string) {
    this.cuisineData = this.cuisineData.filter((i: string) => i !== item);
  }

  add() {
    if (this.cuisineData.includes(this.cuisinesForm.value.name)) {
      // this._appService.success('Cuisine Already Added')
      console.log('Cuisine Already Added');
    } else {
      this.cuisineData.push(this.cuisinesForm.value.name);
      this.cuisinesForm.reset()
    }
  }

  closeDialogBox = () => {
    this.dialogRef.close({ 'status': 'close' })
  }

  updateCuisine = async () => {
    this._appService.updateLoading(true)
    let data = {
      res_id: this.data?.postData?.restaurant_uid,
      cuisines: this.cuisineData
    }
    this._appService.postApiWithAuth(`/admin/social/approve-suggested-cusines`, data, 1).subscribe({
      next: (success: any) => {
        this._appService.updateLoading(false)
        if (success.status_code == 200) {
          this._appService.success('Updated Successfully')
          // this.route.navigate(['/category/list'])
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
