import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app.service';
import { ViewRuleComponent } from '../dialog/view-rule/view-rule.component';
import { AddRuleComponent } from '../dialog/add-rule/add-rule.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tournament-rule-management',
  templateUrl: './tournament-rule-management.component.html',
  styleUrls: ['./tournament-rule-management.component.scss']
})
export class TournamentRuleManagementComponent {
  ELEMENT_DATA: GAME[] = [];
  ruleData: any = []
  isLoading = false;
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  searchForm!: FormGroup;
  searchTextNotEmpty: any;
  pageSizeOptions: number[] = [10, 20, 40, 100, 300];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  displayedColumns: string[] = ['sr', 'name', 'view'];
  dataSource: MatTableDataSource<GAME> = new MatTableDataSource();
  controls: any = {
    name: {
      controls: 'name',
      placeholder: 'Search By Name',
      label: 'Search By Name'
    },
    date: {
      controls: { startDate: 'startDate', endDate: 'endDate' },
      placeholder: 'Enter date range',
      label: 'Select Date'
    },
    pagination: {
      page: 1,
      pageSize: 10,
    }
  }
  constructor(
    public router: Router,   private route: ActivatedRoute,
    public _appService: AppService, private fb: FormBuilder, public dialog: MatDialog, @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.searchForm = this.fb.group({
      name: [this.route.snapshot.queryParamMap.get('name') || ''],
      // startDate: [''],
      // endDate: [''],
    });
  }


  ngOnInit() {
    const params = this.route.snapshot.queryParamMap;
    this.searchForm.patchValue({
      name: params.get('name') || '',


    });

    this.currentPage = params.get('page') ? +params.get('page')! - 1 : 0;
    this.pageSize = +params.get('pageSize')! || 10;
    this.loadData()
  }

  formReset = () => {
    this.currentPage = 0
    this.searchForm.reset()
    this.loadData()
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  buildQueryParams() {

    const name = this.searchForm.value.name || '';
    return {
      name,
      page: this.currentPage + 1,
      pageSize: this.pageSize
    };
  }
  loadData() {
    let name = this.searchForm.value.name ? this.searchForm.value.name : '';
    const params = this.buildQueryParams();
    this._appService.updateQueryParams(params);
    this._appService.getApiWithAuth(`/admin/tournament-rule/list?name=${name}&is_paginated=true&page=${this.currentPage + 1}&pageSize=${this.pageSize}`).subscribe((res: any) => {
      this.ruleData = res?.data?.rows
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
  searchData() {
    this.currentPage = 0
    this.loadData();

  }
  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }


  ruleDetails(tournamentData: any = {}) {
    const dialogRef = this.dialog.open(ViewRuleComponent, {
      hasBackdrop: false,
      width: '575px',
      data: {
        tournamentData: tournamentData
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }


  addRule() {
    const dialogRef = this.dialog.open(AddRuleComponent, {
      hasBackdrop: false,
      width: '575px',

    });
    dialogRef.afterClosed().subscribe(result => {
      this.currentPage=0
      this.loadData()
    });
  }

  checkSearchText(event: KeyboardEvent) {
    console.log(this.searchForm.value)
    this.searchTextNotEmpty = this.searchForm.value?.name?.trim().length > 0;
    if (event.key === "Enter") {
      // If the search text is not empty, then loadData is called
      if (this.searchTextNotEmpty) {
        this.loadData();
      }
      // Prevent any further execution
      return;
    }
    // If it's not Enter key, no need to load data, just update the searchTextNotEmpty flag
    this.searchTextNotEmpty = this.searchForm.value?.name?.trim().length > 0;
  }

  onSearch(searchText: string) {
    // Handle search logic here
    this.searchForm.patchValue({ name: searchText })

    this.loadData();
  }


  onClearSearch() {
    this.searchForm.patchValue({ name: "" })
    this.loadData();
    // Handle clear search logic here
  }
}


export interface GAME {
  sr: string,
  title: string,
  gameUrl: string,
  image: String,
  isSelected: string,
}
