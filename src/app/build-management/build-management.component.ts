import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app.service';
import { CATEGORY } from '../location-management/location-management.component';
import { AddBuildComponent } from '../dialog/add-build/add-build.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-build-management',
  templateUrl: './build-management.component.html',
  styleUrls: ['./build-management.component.scss']
})
export class BuildManagementComponent {


  ELEMENT_DATA: CATEGORY[] = [];
  totalRows = 0;
  pageSize = 10;
  id: any
  searchForm!: FormGroup;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 20, 30, 40, 100];
  displayedColumns: string[] = ['sr','device', 'title', 'ver', 'availabever', 'forceUpdate', 'action'];
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
    this._appService.getApiWithAuth(`/admin/app/app-version`).subscribe((res: any) => {
      this.dataSource.data = res.data?.appconfig
      this._appService.hideSpinner()
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

  updateBuild(buildData: any = {}) {
    const dialogRef = this.dialog.open(AddBuildComponent, {
      hasBackdrop: false,
      width: "800px",
      data: {
        buildData: buildData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
       console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadData()
      }
    });
  }
}