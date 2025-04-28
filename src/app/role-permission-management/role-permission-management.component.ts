

import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { CATEGORY } from '../location-management/location-management.component';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AppService } from 'src/app.service';
import { Router } from '@angular/router';
import { AddRemoveNukhbaUserComponent } from '../dialog/add-remove-nukhba-user/add-remove-nukhba-user.component';
import { AddRolePermissionComponent } from '../dialog/add-role-permission/add-role-permission.component';
@Component({
  selector: 'app-role-permission-management',
  templateUrl: './role-permission-management.component.html',
  styleUrls: ['./role-permission-management.component.scss']
})
export class RolePermissionManagementComponent {
  ELEMENT_DATA: CATEGORY[] = [];
  totalRows = 0;
  pageSize = 10;
  id: any
  searchForm!: FormGroup;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 20, 30, 40, 100];
  displayedColumns: string[] = ['sr','name', 'role_name','permission_type','status', 'action'];
  dataSource: MatTableDataSource<CATEGORY> = new MatTableDataSource();
  selectedLocation: any = {}
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  teamData: any;
  apiUrl: any;
  rawData: any;
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
    this._appService.getApiWithAuth(`/admin/role-permission/get?page=${ this.currentPage+1}&page_size=${ this.pageSize}&is_paginated=true&sort_by=created_at&order=desc`).subscribe((res: any) => {
      this.rawData =res.data
      const processedData:any[]=[]
      Object.keys(this.rawData.rows).forEach((moduleKey) => {
        const moduleEntries = this.rawData.rows[moduleKey];
    
        // Group data by role
        const groupedByRole = moduleEntries.reduce((acc: any, entry: any) => {
          if (!acc[entry.role_name]) {
            acc[entry.role_name] = {
              permissions: [],
              permission_ids: [],
              ids: [],
            };
          }
          acc[entry.role_name].permissions.push(entry.permission_type);
          acc[entry.role_name].permission_ids.push(entry.permission_id);
          acc[entry.role_name].ids.push(entry.id);
          return acc;
        }, {});
    
        // Flatten the grouped data into rows for the table
        Object.keys(groupedByRole).forEach((roleName) => {
          processedData.push({
            sr: processedData.length + 1,
            role_id:moduleEntries[0].role_id,
            module_name: moduleEntries[0].module_name,
            module_id: moduleEntries[0].module_id, // Same module name for all entries in this loop
            permission_type: groupedByRole[roleName].permissions.join(', '), // Join permissions with a comma
            permission_ids: groupedByRole[roleName].permission_ids,
            id: groupedByRole[roleName].ids, // Array of permission IDs
            role_name: roleName,
            status: 1
          });
        });
      });
    
      this.dataSource.data = processedData;
      this.dataSource.data = processedData;
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

  addUpdateRolePermission(permissionData: any = {}) {
    console.log(permissionData)
    const dialogRef = this.dialog.open(AddRolePermissionComponent, {
      hasBackdrop: false,
      width: "800px",
      data: {
        permissionDatas: permissionData,
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
    this._appService.deleteApi(`/admin/role-permission/delete`, sendBody, 1).subscribe({
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
  removeModule(element: any) {
    const dialogRef = this.dialog.open(AddRemoveNukhbaUserComponent, {
      hasBackdrop: false,
      width: "575px",
      data: {
        message: "Are you sure you want to remove permission?",
        title: "Remove Permission",
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

