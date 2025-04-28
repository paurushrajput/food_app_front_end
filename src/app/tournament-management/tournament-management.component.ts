import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app.service';
import { AddTournamentComponent } from '../dialog/add-tournament/add-tournament.component';
import { ViewLeaderboardComponent } from '../dialog/view-leaderboard/view-leaderboard.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ImagePreviewDialogComponent } from '../dialog/image-preview-dialog/image-preview-dialog.component';
@Component({
  selector: 'app-tournament-management',
  templateUrl: './tournament-management.component.html',
  styleUrls: ['./tournament-management.component.scss']
})
export class TournamentManagementComponent {

  imageSrc: any
  ELEMENT_DATA: GAME[] = [];
  userList: any = []
  isLoading = false;
  totalRows = 0;
  searchForm!: FormGroup;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 20, 40, 100, 300];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  displayedColumns: string[] = ['sr', 'name', 'image', 'start', 'end', 'points', 'status', 'leaderboard', 'action'];
  dataSource: MatTableDataSource<GAME> = new MatTableDataSource();

  constructor(
    public router: Router,  private route: ActivatedRoute,
    public _appService: AppService, private fb: FormBuilder, public dialog: MatDialog, @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.searchForm = this.fb.group({
      name: [''],
      status: [this.route.snapshot.queryParamMap.get('status') || '']
      // startDate: [''],
      // endDate: [''],
    });
  }


  ngOnInit() {
    const params = this.route.snapshot.queryParamMap;
    this.searchForm.patchValue({
      status: params.get('status') || '',


    });

    this.currentPage = params.get('page') ? +params.get('page')! - 1 : 0;
    this.pageSize = +params.get('pageSize')! || 10;
    this.loadData()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  searchData(){
    this.currentPage=0
    this.loadData()
  }
  buildQueryParams() {

    const status = this.searchForm.value.status || '';
    return {
      status,
      page: this.currentPage + 1,
      pageSize: this.pageSize
    };
  }
  loadData() {
    let status = this.searchForm.value.status ? this.searchForm.value.status : '';
    const params = this.buildQueryParams();
    this._appService.updateQueryParams(params);
    this._appService.getApiWithAuth(`/admin/tournaments/get?status=${status}&is_paginated=true&page=${this.currentPage + 1}&pageSize=${this.pageSize}`).subscribe((res: any) => {
      this.userList = res?.data?.rows
      setTimeout(() => {
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length = res.data.count;
      });
    },
      (error) => {
        if (error?.error?.success == false) {
          this._appService.err(error?.error?.msg)
        }
        if (error?.error?.status_code == 401) {
          localStorage.removeItem('authtoken')
          this.router.navigateByUrl("/");
        }
      })
  }

  formReset = () => {
    this.currentPage = 0
    this.searchForm.reset()
    this.loadData()
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }


  showEditForm(data: any) {
    this.addTournament(data);
  }


  addTournament(setting: any = {}) {
    const dialogRef = this.dialog.open(AddTournamentComponent, {
      hasBackdrop: false,
      width: '575px',
      // height: '90%',
      data: {
        tournamentData: setting
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadData()
      console.log(`Dialog result: ${result}`);
    });
  }

  viewLeaderboard(element: any) {
    const dialogRef = this.dialog.open(ViewLeaderboardComponent, {
      hasBackdrop: false,
      width: '1000px',
      data: {
        tournamentData: element
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  previewImage(imageLink: any) {

    this.imageSrc = imageLink;
    const dialogRef = this.dialog.open(ImagePreviewDialogComponent, {
      hasBackdrop: false,
      data: { imageLink },
      // height: '600px',
      // width: '600px',
    });
    // this.dialog.open();
  }
}


export interface GAME {
  sr: string,
  title: string,
  gameUrl: string,
  image: String,
  isSelected: string,
}
