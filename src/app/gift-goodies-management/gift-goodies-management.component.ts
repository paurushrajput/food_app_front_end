import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { EditWasteToEarnComponent } from '../dialog/edit-waste-to-earn/edit-waste-to-earn.component';
import { ImagePreviewDialogComponent } from '../dialog/image-preview-dialog/image-preview-dialog.component';
import { ViewFeedbackDetailsComponent } from '../dialog/view-feedback-details/view-feedback-details.component';
import { AddGiftGoodiesComponent } from '../dialog/add-gift-goodies/add-gift-goodies.component';
import { DeleteGiftsComponent } from '../dialog/delete-gifts/delete-gifts.component';

@Component({
  selector: 'app-gift-goodies-management',
  templateUrl: './gift-goodies-management.component.html',
  styleUrls: ['./gift-goodies-management.component.scss']
})
export class GiftGoodiesManagementComponent {

payload: any
  uid: any
  imageSrc: any
  ELEMENT_DATA: CATEGORY[] = [];
  totalRows = 0;
  pageSize = 10;
  id: any
  searchForm!: FormGroup;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 20, 40, 100, 300];
  displayedColumns: string[] = ['sr', 'title', 'coins', 'cn','status','status1', 'action'];
  dataSource: MatTableDataSource<CATEGORY> = new MatTableDataSource();
  selectedLocation: any = {}
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  teamData: any;
  apiUrl: any;
  searchTextNotEmpty: any;
  controls: any = {
    resId: {
      controls: 'resId',
      placeholder: 'Enter Restaturant Id',
      label: 'Restaurant Id'
    },
    name: {
      controls: 'name',
      placeholder: 'Enter Restaturant name',
      label: 'Search By Restaurant Name'
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
  lastSearchTerm: any;
  isChecked: any;
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public _appService: AppService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,

  ) {
    this.searchForm = this.fb.group({
      name: [this.route.snapshot.queryParamMap.get('name') || ''],
      resId: ['']
    });
  }

  buildQueryParams() {

    const name = this.searchForm.value.name || '';
    return {
      name,
      page: this.currentPage + 1,
      pageSize: this.pageSize
    };
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

  edit(data: any = {}) {
    const dialogRef = this.dialog.open(AddGiftGoodiesComponent, {
      hasBackdrop: false,
      // width: '80px',
      // height: '80px',
      width: '575px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadData()
      }
    });
  }

  onToggleChange(event: any, element: any) {
    this.isChecked = element.status == 1 ? true : false
    if (event.checked) {
      this.updateDeal(1, element.id)
    } else {
      this.updateDeal(0, element.id)
    }
  }


  updateDeal(status: any, store_id: any) {
    let payload = {
      store_id: store_id,
      status: status
    }
    let msg = ''
    if (status == 1) {
      msg = 'Enable Successfully'
    } else {
      msg = 'Disable Successfully'
    }
    this._appService.putApiWithAuth(`/admin/nukhba-store/update`, payload, 1).subscribe({
      next: (success: any) => {
        this._appService.updateLoading(false);
        if (success.status_code === 200) {
          this.loadData()
          this._appService.success(msg);
        } else {
          this._appService.err(success.msg);
        }
      },
      error: (error: any) => {
        this._appService.updateLoading(false);
        this._appService.err(error?.error?.msg);
      }
    });
  }

  delete(data: any = {}) {
    const dialogRef = this.dialog.open(DeleteGiftsComponent, {
      hasBackdrop: false,
      // width: '80px',
      // height: '80px',
      width: '575px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result.status}`);
      // if (result && result.status != 'close') {
        this.loadData()
      // }
    });
  }
  

  showEditForm(location: any) {
    this.selectedLocation = location
    this.edit(location);
  }


  add(data: any = {}) {
    const dialogRef = this.dialog.open(AddGiftGoodiesComponent, {
      hasBackdrop: false,
      width: '575px',
      // height: '80px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.currentPage = 0
        this.loadData()
      }
    });
  }


  previewImage(imageLink: any, id: any) {
    this.imageSrc = imageLink;
    const dialogRef = this.dialog.open(ImagePreviewDialogComponent, {
      hasBackdrop: false,
      data: {
        imageLink: imageLink,
        id: id
      },

      // height: '600px',
      // width: '600px',
    });
    // this.dialog.open();
  }
  reviewDetails(feedbackData: any = {}) {
    const dialogRef = this.dialog.open(ViewFeedbackDetailsComponent, {
      hasBackdrop: false,
      width: '700px',
      data: {
        feedbackData: feedbackData
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  searchData() {
    this.currentPage = 0
    this.loadData()
  }

  loadData() {
    this._appService.showSpinner();
    this._appService.getApiWithAuth(`/admin/nukhba-store/list`).subscribe((res: any) => {
      this.dataSource.data = res.data?.rows;
      this._appService.hideSpinner();
      setTimeout(() => {
        this.paginator.pageIndex = this.currentPage; // Update paginator's pageIndex to reflect currentPage
        this.paginator.length = res.data?.count;
      });
    }, (error) => {
      if (error?.error?.status_code) {
        this.router.navigateByUrl("/");
        localStorage.removeItem('authtoken');
      }
    });
  }


  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }

  formReset = () => {
    this.currentPage = 0
    this.id = ''
    this.searchForm.reset()
    this.loadData()
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



export interface CATEGORY {
  sequence: number;
  sr: string,
  name: string,
  image: string,
  type: string,
  Status: string,
}
