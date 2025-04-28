import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app.service';

@Component({
  selector: 'app-view-leaderboard',
  templateUrl: './view-leaderboard.component.html',
  styleUrls: ['./view-leaderboard.component.scss']
})
export class ViewLeaderboardComponent {


  ELEMENT_DATA: CATEGORY[] = [];
  totalRows = 0;
  pageSize = 10;
  id: any
  searchForm!: FormGroup;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 20, 300, 40, 100];
  displayedColumns: string[] = ['rank', 'name', 'image', 'score', 'points', 'users'];
  dataSource: MatTableDataSource<CATEGORY> = new MatTableDataSource();
  selectedLocation: any = {}
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  teamData: any;
  apiUrl: any;
  response: any = [];
  controls: any = {
    name: {
      controls: 'name',
      placeholder: 'Enter name',
      label: 'Search By Name'
    },
    rank_from: {
      controls: 'rank_from',
      placeholder: 'Enter Rank From',
      label: 'Enter Rank From'
    },
    rank_to: {
      rankTo: 'rank_to',
      placeholder: 'Enter Rank To',
      label: 'Enter Rank To'
    }
  }
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public _appService: AppService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute
  ) {
    this.searchForm = this.fb.group({
      name: [''],
      rank_from: [''],
      rank_to: [''],
    });
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    console.log(this.data);
    this.loadData()
  }

  ngAfterViewChecked(): void {
    // new addin_pad();
  }


  searchData() {
    this.currentPage = 0
    this.loadData()
  }

  loadData() {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/tournament-manifest/leaderboard?rank_from=${this.searchForm.value.rank_from ? this.searchForm.value.rank_from : ''}&rank_to=${this.searchForm.value.rank_to ? this.searchForm.value.rank_to : ''}&keyword=${this.searchForm.value.name ? this.searchForm.value.name : ''}&page=${this.currentPage + 1}&page_size=${this.pageSize}&is_paginated=true&tournament_id=${this.data.tournamentData.id}`).subscribe((res: any) => {
      this.dataSource.data = res.data?.rows
      this._appService.hideSpinner()
      setTimeout(() => {
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length = res.data?.count;
      });
      // this.isLoading = false;
    })
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }
  formReset = () => {
    this.searchForm.reset()
    this.loadData()
  }
}



export interface CATEGORY {
  sr: string,
  name: string,
  image: string,
  type: string,
  Status: string,
}