import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { CATEGORY } from '../location-management/location-management.component';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AppService } from 'src/app.service';
import { Router } from '@angular/router';
import { AddRoleComponent } from '../dialog/add-role/add-role.component';
import { AddRemoveNukhbaUserComponent } from '../dialog/add-remove-nukhba-user/add-remove-nukhba-user.component';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent {
  ELEMENT_DATA: CATEGORY[] = [];
  totalRows = 0;
  pageSize = 10;
  id: any
  searchForm!: FormGroup;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 20, 30, 40, 100];
  displayedColumns: string[] = ['sr','name', 'status', 'created','action'];
  dataSource: MatTableDataSource<CATEGORY> = new MatTableDataSource();
  selectedLocation: any = {}
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  teamData: any;
  apiUrl: any;
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public _appService: AppService,
    public dialog: MatDialog,
    public router: Router,

  ) {
  }

  ngAfterViewInit() {
  }

  ngOnInit() {
    this.loadData()
  }

  ngAfterViewChecked(): void {
  }

  loadData() {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/role/get?page=${ this.currentPage+1}&page_size=${ this.pageSize}&is_paginated=true&sort_by=created_at&order=desc`).subscribe((res: any) => {
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
  removeData(element:any){
    const sendBody={
      id:element.id
    }
    this._appService.deleteApi(`/admin/role/delete`, sendBody, 1).subscribe({
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
  pageChanged(event: PageEvent) {
    
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }
  formReset = () => {
    this.searchForm.reset()
    this.loadData()
  }

  addUpdateRole(roleData: any = {}) {
    const dialogRef = this.dialog.open(AddRoleComponent, {
      hasBackdrop: false,
      width: "575px",
      data: {
        roleData: roleData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
       console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadData()
      }
    });
  }
  removeRole(element: any) {
    const dialogRef = this.dialog.open(AddRemoveNukhbaUserComponent, {
      hasBackdrop: false,
      width: "575px",
      data: {
        message: "Are you sure you want to remove role?",
        title: "Remove role",
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
