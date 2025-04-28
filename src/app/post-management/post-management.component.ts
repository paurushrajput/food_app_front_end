import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { ViewFeedbackDetailsComponent } from '../dialog/view-feedback-details/view-feedback-details.component';
import { ViewPostDetailsComponent } from '../dialog/view-post-details/view-post-details.component';
import { ViewLikeListComponent } from '../dialog/view-like-list/view-like-list.component';
import { ViewCommentListComponent } from '../dialog/view-comment-list/view-comment-list.component';
import { SocialRestaurantManagementComponent } from '../social-restaurant-management/social-restaurant-management.component';
import { PostFilterComponent } from '../dialog/post-filter/post-filter.component';

@Component({
  selector: 'app-post-management',
  templateUrl: './post-management.component.html',
  styleUrls: ['./post-management.component.scss']
})
export class PostManagementComponent {

  dialogData: any;
  ELEMENT_DATA: CATEGORY[] = [];
  totalRows = 0;
  pageSize = 10;
  id: any
  searchForm!: FormGroup;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 20, 40, 100, 300];
  displayedColumns: string[] = ['sr', 'createdAt', 'userName', 'resName', 'type', 'likeCount', 'commentCount', 'status', 'details'];
  dataSource: MatTableDataSource<CATEGORY> = new MatTableDataSource();
  selectedLocation: any = {}
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  teamData: any;
  apiUrl: any;
  searchTextNotEmpty: any;
  isChecked: boolean = true;
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
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public _appService: AppService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,

  ) {
    this.searchForm = this.fb.group({
      status: [''],
      // resId: ['']
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

  postFilter() {
    const dialogRef = this.dialog.open(PostFilterComponent, {
      hasBackdrop: false,
      width: "575px",
      data: {
        data: this.dialogData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result.data) {
        this.currentPage = 0
        this.dialogData = result.data;
        this.loadDatav2()
      }
    });
  }

  loadData() {
    let query = ''
    if (this.searchForm.value.status) {
      query += `&status=${this.searchForm.value.status}`
    }
    this._appService.showSpinner();
    this._appService.getApiWithAuth(`/admin/feeds/list?page=${this.currentPage + 1}&page_size=${this.pageSize}${query}`).subscribe((res: any) => {
      this.dataSource.data = res.data?.rows
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


  loadDatav2() {
    let formValue = this.dialogData;
    if (formValue) {

      let query = ''
      if (formValue.status) {
        query += `&status=${formValue.status}`
      }
      if (formValue.res_name) {
        query += `&res_name=${formValue.res_name}`
      }
      if (formValue.keyword) {
        query += `&keyword=${formValue.keyword}`
      }
      if (formValue.isPhotos) {
        query += `&isPhotos=${formValue.isPhotos}`
      }
      if (formValue.type) {
        query += `&type=${formValue.type}`
      }
      if (formValue.is_nukhba_user) {
        query += `&is_nukhba_user=${formValue.is_nukhba_user}`
      }
      this._appService.showSpinner();
      this._appService.getApiWithAuth(`/admin/feeds/list?page=${this.currentPage + 1}&page_size=${this.pageSize}${query}`).subscribe((res: any) => {
        this.dataSource.data = res.data?.rows
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
    } else {
      this.loadData()
    }
  }


  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadDatav2();
  }

  formReset = () => {
    this.currentPage = 0
    this.id = ''
    this.searchForm.reset()
    this.loadData()
    if (this.dialogData) {
      this.emptyObject()
    }
  }

  emptyObject = () => {
    Object.keys(this.dialogData).forEach(key => {
      this.dialogData[key] = '';
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

  onToggleChange(event: any, element: any) {
    this.isChecked = element.status == 1 ? true : false
    if (event.checked) {
      this.updateDeal(1, element.feed_id)
    } else {
      this.updateDeal(0, element.feed_id)
    }
  }

  updateDeal(status: any, feed_id: any) {
    let payload = {
      feed_id: feed_id,
      status: status
    }
    let msg = ''
    if (status == 1) {
      msg = 'Post Enable Successfully'
    } else {
      msg = 'Post Disable Successfully'
    }
    this._appService.putApiWithAuth(`/admin/feeds/update`, payload, 1).subscribe({
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
  onClearSearch() {
    this.searchForm.patchValue({ name: "" })
    this.loadData();
    // Handle clear search logic here
  }

  viewPostDetails(postData: any = {}) {
    const dialogRef = this.dialog.open(ViewPostDetailsComponent, {
      hasBackdrop: false,
      width: '800px',
      data: {
        postData: postData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadData()
      }
    });
  }

  viewPostLikeList(postData: any = {}) {
    const dialogRef = this.dialog.open(ViewLikeListComponent, {
      hasBackdrop: false,
      width: '800px',
      data: {
        postData: postData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadData()
      }
    });
  }

  viewPostCommentList(postData: any = {}) {
    const dialogRef = this.dialog.open(ViewCommentListComponent, {
      hasBackdrop: false,
      width: '800px',
      data: {
        postData: postData,
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

