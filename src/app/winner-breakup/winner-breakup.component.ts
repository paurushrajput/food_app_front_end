import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app.service';
import { ViewBreakupComponent } from '../view-breakup/view-breakup.component';
import { AddBreakupComponent } from '../add-breakup/add-breakup.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-winner-breakup',
  templateUrl: './winner-breakup.component.html',
  styleUrls: ['./winner-breakup.component.scss']
})
export class WinnerBreakupComponent {


  apiData: any = []
  ELEMENT_DATA: TOURS[] = [];
  isLoading = false;
  totalRows = 0;
  pageSize = 10;
  searchForm: FormGroup
  currentPage = 0;
  pageSizeOptions: number[] = [10, 20, 40, 100, 300];
  displayedColumns: string[] = ['sr', 'name', 'view'];
  dataSource: MatTableDataSource<TOURS> = new MatTableDataSource();
  tours: any;
  selectedTour: any = {}
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  searchTextNotEmpty: any;
  apiUrl: any;
  controls: any = {
    name: {
      controls: 'name',
      placeholder: 'Search By Name',
      label: 'Search By Name'
    }
  }
  constructor(public _appService: AppService, private fb: FormBuilder, public dialog: MatDialog,
    public router: Router, private route: ActivatedRoute,
  ) {
    this.searchForm = this.fb.group({
      name: [this.route.snapshot.queryParamMap.get('name') || '']
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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

  ngAfterViewChecked(): void {
  }
  searchData() {
    this.currentPage = 0
    this.loadData()
  }
  formReset = () => {
    this.currentPage = 0
    this.searchForm.reset()
    this.loadData()
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
    this._appService.showSpinner()
    let name = this.searchForm.value.name ? this.searchForm.value.name : ''
    this.isLoading = true;
    const params = this.buildQueryParams();
    this._appService.updateQueryParams(params);
    this._appService.getApiWithAuth(`/admin/winner-breakup/list?type=all&name=${name}&page=${this.currentPage + 1}&page_size=${this.pageSize}`).subscribe((res: any) => {
      this._appService.hideSpinner()
      this.dataSource.data = res.data.rows
      setTimeout(() => {
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length = res.data.count
      });
      this.isLoading = false;
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

  pageChanged(event: PageEvent) {

    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }

  viewBreakupDialog(breakupData: any = {}) {
    const dialogRef = this.dialog.open(ViewBreakupComponent, {
      hasBackdrop: false,
      width: '575px',
      data: {
        breakupData: breakupData
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialog(breakupData: any = {}) {
    const dialogRef = this.dialog.open(AddBreakupComponent, {
      hasBackdrop: false,
      width: '575px',
      data: {
        breakupData: breakupData
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadData()
      }
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
  // openBox(breakupData: any = {}) {
  //   const dialogRef = this.dialog.open(DeleteBreakupComponent, {
  //     data: {
  //       breakupData: breakupData
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(`Dialog result: ${result}`);
  //   });
  // }

  // showEditForm(tour: any) {
  //   // console.log("===>tour", tour)
  //   this.selectedTour = tour
  //   this.openDialog(tour)
  // }
}


export interface TOURS {
  startDate: string,
  shortKey: string,
  tourKey: string,
  tourStatus: String,
  sportsType: string,
}

