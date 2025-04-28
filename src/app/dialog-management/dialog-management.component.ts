import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { AddAmenitiesComponent } from '../dialog/add-amenities/add-amenities.component';
import { ImagePreviewDialogComponent } from '../dialog/image-preview-dialog/image-preview-dialog.component';
import { CreateDialogComponent } from '../dialog/create-dialog/create-dialog.component';
import { DeleteDialogComponent } from '../dialog/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-dialog-management',
  templateUrl: './dialog-management.component.html',
  styleUrls: ['./dialog-management.component.scss']
})
export class DialogManagementComponent {


  imageSrc: any
  ELEMENT_DATA: CATEGORY[] = [];
  totalRows = 0;
  pageSize = 10;
  searchForm!: FormGroup;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 20, 300, 40, 100];
  displayedColumns: string[] = ['sr', 'title', 'start_time', 'end_time','message','user_type','action1','status'];
  dataSource: MatTableDataSource<CATEGORY> = new MatTableDataSource();
  selectedLocation: any = {}
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  teamData: any;
  apiUrl: any;
  controls: any = {
    name: {
      controls: 'name',
      placeholder: 'Enter Name',
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
    public _appService: AppService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public router: Router,

  ) {
    this.searchForm = this.fb.group({
      name: [''],
      status: ['']
      // startDate: [''],
      // endDate: [''],
    });
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.loadData()
  }

  ngAfterViewChecked(): void {
    // new addin_pad();
  }

  addDialog(dialogData: any = {}) {
    const dialogRef = this.dialog.open(CreateDialogComponent, {
      hasBackdrop: false,
      width: '575px',
      // height: '100',
      data: {
        dialogData: dialogData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
       console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadData()
      }
    });
  }

  showEditForm(location: any) {
    this.selectedLocation = location
    this.addDialog(location);
  }

  loadData() {
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/dialog/get?page=${this.currentPage + 1}&page_size=${this.pageSize}&isPaginated=true`).subscribe((res: any) => {
      this.dataSource.data = res.data?.rows
      this._appService.hideSpinner()
      setTimeout(() => {
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length = res.data?.count;
      });
      // this.isLoading = false;
    },
      (error) => {
        if (error?.error?.status_code) {
          this.router.navigateByUrl("/");
          localStorage.removeItem('authtoken');
        }
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

  deleteDialog(dialogData: any = '') {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      hasBackdrop: false,
      // width: '575px',
      // height: '80px',
      data: {
        dialogData: dialogData,
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



export interface CATEGORY {
  sr: string,
  name: string,
  image: string,
  type: string,
  Status: string,
}