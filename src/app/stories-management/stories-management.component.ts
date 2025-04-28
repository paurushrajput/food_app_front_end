import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { DeleteRequestComponent } from '../dialog/delete-request/delete-request.component';
import { AddStoriesComponent } from '../dialog/add-stories/add-stories.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ImagePreviewDialogComponent } from '../dialog/image-preview-dialog/image-preview-dialog.component';


@Component({
  selector: 'app-stories-management',
  templateUrl: './stories-management.component.html',
  styleUrls: ['./stories-management.component.scss']
})
export class StoriesManagementComponent {
  ELEMENT_DATA: CATEGORY[] = [];
  totalRows = 0;
  pageSize = 10;
  imageSrc: any;
  id: any
  searchForm!: FormGroup;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 20, 300, 40, 100];
  displayedColumns: string[] = ['sr', 'image', 'title', 'type', 'duration', 'sequence', 'status', 'actionv1'];
  dataSource: MatTableDataSource<CATEGORY> = new MatTableDataSource();
  selectedLocation: any = {}
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  teamData: any;
  apiUrl: any;
  controls: any = {
    name: {
      controls: 'name',
      placeholder: 'Enter name',
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
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public _appService: AppService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute
  ) {
    this.searchForm = this.fb.group({
      type: [this.route.snapshot.queryParamMap.get('type') || ''],
      status: [this.route.snapshot.queryParamMap.get('status') || ''],
      // startDate: [''],
      // endDate: [''],
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
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    const params = this.route.snapshot.queryParamMap;
    this.searchForm.patchValue({
      type: params.get('type') || '',
      status: params.get('status') || '',

    });

    this.currentPage = params.get('page') ? +params.get('page')! - 1 : 0;
    this.pageSize = +params.get('pageSize')! || 10;
    this.loadData()
  }

  ngAfterViewChecked(): void {
    // new addin_pad();
  }
  buildQueryParams() {

    const type = this.searchForm.value.type || '';
    const status = this.searchForm.value.status || '';
    return {
      type,
      status,
      page: this.currentPage + 1,
      pageSize: this.pageSize
    };
  }
  searchData() {
    this.currentPage = 0
    this.loadData()
  }
  loadData() {
    this._appService.showSpinner()

    let status = this.searchForm.value.status ? this.searchForm.value.status : '';
    const params = this.buildQueryParams();
    this._appService.updateQueryParams(params);
    this._appService.getApiWithAuth(`/admin/stories/get?status=${status}&type=${this.searchForm.value.type ? this.searchForm.value.type : ''}&page=${this.currentPage + 1}&page_size=${this.pageSize}&is_paginated=true&sort_by=created_at&order=desc&from_date&to_date`).subscribe((res: any) => {
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
  deleteStories(storiesData: any = {}) {
    const dialogRef = this.dialog.open(DeleteRequestComponent, {
      hasBackdrop: false,
      // width: '80px',
      // height: '80px',
      data: {
        text: 'Stories',
        label: 'Delete',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.data}`);
      if (result && result.data.status == 1) {
        this._appService.deleteApi(`/admin/stories/delete`, { id: storiesData.id }, 1).subscribe((success: any) => {

          if (success.success) {
            this._appService.success(success.msg)
            this.loadData()
          } else {
            this._appService.error(success.msg)
            this.loadData()
          }
        })
      }


    });
  }
  addStories(storiesData: any = {}) {
    const dialogRef = this.dialog.open(AddStoriesComponent, {
      hasBackdrop: false,
      width: '575px',
      // height: '80px',
      data: {
        storiesData: storiesData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.currentPage=0
        this.loadData()
      }
    });
  }
  pageChanged(event: PageEvent) {
    console.log(event);

    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }

  formReset = () => {
    this.searchForm.reset()
    this.loadData()
    this.currentPage = 0
  }


  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.dataSource.data, event.previousIndex, event.currentIndex);
    this.dataSource.data.forEach((item, index) => {
      item.sequence = index + 1
      // item.sequence = index + 1; // Assuming sequence starts from 1
      // delete item.image;
    });
    console.log(this.dataSource.data)

    this.updateBackendWithNewOrder(this.dataSource.data)
  }

  private updateBackendWithNewOrder(data: any): void {
    // data.forEach((object: { [x: string]: any; }) => {
    //   delete object['image'];
    // });
    // console.log(data);
    // return
    this._appService.putApiWithAuth("/admin/stories/update-bulk", { "stories": data }, 1)
      .subscribe(
        response => {
          this._appService.success('Stroies updated successfully')
          this.loadData()
        },
        error => {
          // Handle error appropriately, e.g., show a notification to the user
        }
      );
  }


}



export interface CATEGORY {
  sequence: number;
  sr: string,
  name: string,
  image: string,
  type: string,
  Status: string,
}