import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { CATEGORY } from '../location-management/location-management.component';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AppService } from 'src/app.service';
import { Router } from '@angular/router';
import { AddRemoveNukhbaUserComponent } from '../dialog/add-remove-nukhba-user/add-remove-nukhba-user.component';
import { AddUserRoleManagementComponent } from '../dialog/add-user-role-management/add-user-role-management.component';
@Component({
  selector: 'app-user-role-mangement',
  templateUrl: './user-role-mangement.component.html',
  styleUrls: ['./user-role-mangement.component.scss']
})
export class UserRoleMangementComponent {
  ELEMENT_DATA: CATEGORY[] = [];
  totalRows = 0;
  pageSize = 10;
  id: any
  searchForm!: FormGroup;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 20, 30, 40, 100];
  displayedColumns: string[] = ['sr','name', 'role_name','email','status', 'action'];
  dataSource: MatTableDataSource<CATEGORY> = new MatTableDataSource();
  selectedLocation: any = {}
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  teamData: any;
  apiUrl: any;
  dataset2: any=[];
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public _appService: AppService,
    public dialog: MatDialog,
    public router: Router,

  ) {
  }

  ngAfterViewInit() {
  }
  pageChanged(event: PageEvent) {
    
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }
  ngOnInit() {
    this.loadData()
  }

  ngAfterViewChecked(): void {
  }

  loadData() {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/user-role/get?page=${ this.currentPage+1}&page_size=${ this.pageSize}&is_paginated=true&sort_by=created_at&order=desc`).subscribe((res: any) => {
      this.dataSource.data = res.data?.rows
      this._appService.hideSpinner()
     
      setTimeout(() => {
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length = res.data?.count;
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
    this.searchForm.reset()
    this.loadData()
  }

  addUpdateUserRole(userRoleData: any = {}) {
    const dialogRef = this.dialog.open(AddUserRoleManagementComponent, {
      hasBackdrop: false,
      width: "800px",
      data: {
        userRoleData: userRoleData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
       console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadData()
      }
    });
  }
  removeData(element:any){
    const sendBody={
      id:element.id
    }
    this._appService.deleteApi(`/admin/user-role/delete`, sendBody, 1).subscribe({
      next: (success: any) => {
        if (success.success) {
          this._appService.success(success.msg);
          this.loadData()
        }
      },
      error: (error: any) => {
        this._appService.err(error?.error?.msg);
      }
    });
  
  }
  removeUserRole(element: any) {
    const dialogRef = this.dialog.open(AddRemoveNukhbaUserComponent, {
      hasBackdrop: false,
      width: "575px",
      data: {
        message: "Are you sure you want to remove user role?",
        title: "Remove User Role",
        label: "Remove"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
       this.removeData(element)
      }
    });
  }
}

