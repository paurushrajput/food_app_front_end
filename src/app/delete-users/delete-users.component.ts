import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { ConfirmStatusComponent } from '../dialog/confirm-status/confirm-status.component';
import { RestoreUserComponent } from '../dialog/restore-user/restore-user.component';

@Component({
  selector: 'app-delete-users',
  templateUrl: './delete-users.component.html',
  styleUrls: ['./delete-users.component.scss']
})
export class DeleteUsersComponent {

  ELEMENT_DATA: user[] = [];
  totalRows = 0;
  pageSize = 10;
  searchForm!: FormGroup;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 20, 300, 40, 100];
  displayedColumns: string[] = ['sr', 'fname', 'email', 'mobile', 'action'];
  dataSource: MatTableDataSource<user> = new MatTableDataSource();
  selectedLocation: any = {}
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  teamData: any;
  apiUrl: any;
  controls: any = {
    name: {
      controls: 'name',
      placeholder: 'Search by Name /Email',
      label: 'Search by Name /Email'
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
    public _appService: AppService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
  
  ) {
    this.searchForm = this.fb.group({
      name: [this.route.snapshot.queryParamMap.get('name') || ''],
      // startDate: [''],
      // endDate: [''],
    });
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
    // new addin_pad();
  }
  buildQueryParams() {

    const name = this.searchForm.value.name || '';
    return {
      name,
      page: this.currentPage + 1,
      pageSize: this.pageSize
    };
  }
  searchData(){
    this.currentPage=0
    this.loadData()
  }
  loadData() {
    this._appService.showSpinner()
    let keyword = this.searchForm.value.name ? this.searchForm.value.name : '';
    const params = this.buildQueryParams();
    this._appService.updateQueryParams(params);
    this._appService.getApiWithAuth(`/admin/deleted-users/get?page=${this.currentPage + 1}&page_size=${this.pageSize}&keyword=${keyword}`).subscribe((res: any) => {
      if (res.status_code == '401') {
        this.router.navigateByUrl("/");
      }
      this.dataSource.data = res.data?.rows
      this._appService.hideSpinner()
      setTimeout(() => {
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length = res.data?.count;
      });
      // this.isLoading = false;
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

  formReset = () => {
    this.currentPage = 0
    this.searchForm.reset()
    this.loadData()
    // window.location.reload()
  }


  restoreUser(userData: any = {}) {
    const dialogRef = this.dialog.open(RestoreUserComponent, {
      hasBackdrop: false,
      width: '50',
      height: '100',
      data: {
        userData: userData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
       console.log(`Dialog result: ${result.status}`);
      // if (result && result.status != 'close') {
        this.loadData()
      // }
    });
  }

}



export interface user {
  sr: string,
  fname: string,
  lname: string,
  email: string,
  Status: string,
}