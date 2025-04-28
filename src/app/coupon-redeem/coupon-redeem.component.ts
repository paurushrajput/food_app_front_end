import { Component, HostBinding, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { AddRedeemComponent } from '../dialog/add-redeem/add-redeem.component';
import { DeleteRedeemComponent } from '../dialog/delete-redeem/delete-redeem.component';
import { ImagePreviewDialogComponent } from '../dialog/image-preview-dialog/image-preview-dialog.component';

@Component({
  selector: 'app-coupon-redeem',
  templateUrl: './coupon-redeem.component.html',
  styleUrls: ['./coupon-redeem.component.scss']
})
export class CouponRedeemComponent {

  @HostBinding('style.height') height = '56px';
  ELEMENT_DATA: CATEGORY[] = [];
  totalRows = 0;
  pageSize = 10;
  searchForm!: FormGroup;
  currentPage = 0;
  imageSrc: any;
  selectedCategory: any = {}
  pageSizeOptions: number[] = [10, 20, 300, 40, 100];
  displayedColumns: string[] = ['sr', 'title', 'image', 'description', 'type', 'points', 'status', 'action'];
  dataSource: MatTableDataSource<CATEGORY> = new MatTableDataSource();
  selectedContest: any = {}
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
  searchTextNotEmpty: any;
  constructor(
    public _appService: AppService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
  ) {
    this.searchForm = this.fb.group({
      discount_type: [''],
      status: [''],
      type: [''],
      // startDate: [''],
      // endDate: [''],
    });
  }
  clearData() {
    this.searchTextNotEmpty = false
    this.searchForm.reset()
    this.loadData()
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.loadData()
  }
  onSearch(searchText: string) {
    this.searchForm.patchValue({ name: searchText })
    this.loadData();
  }

  onClearSearch() {
    this.searchForm.patchValue({ name: "" })
    this.loadData();
  }

  ngAfterViewChecked(): void {
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
  
  checkSearchText(event: KeyboardEvent) {
    console.log(this.searchForm.value)
    this.searchTextNotEmpty = this.searchForm.value?.name?.trim().length > 0;
    if (event.key === "Enter") {
      if (this.searchTextNotEmpty) {
        this.loadData();
      }
      return;
    }
    this.searchTextNotEmpty = this.searchForm.value?.name?.trim().length > 0;
  }

  loadData() {
    this._appService.showSpinner()
    // let searchQuery=`?page=${this.currentPage + 1}&page_size=${this.pageSize}&isPaginated=true`
    // let status = this.searchForm.value.status ? this.searchForm.value.status : ''
    // let discount_type = this.searchForm.value.discount_type ? this.searchForm.value.discount_type : ''
    // let type = this.searchForm.value.type ? this.searchForm.value.type : ''
    // if(status){
    //   searchQuery += `&status=${status}`
    // }
    // if(discount_type){
    //   searchQuery += `&discount_type=${discount_type}`
    // }
    // if(type){
    //   searchQuery += `&type=${type}`
    // }
    this._appService.getApiWithAuth(`/admin/nukhba-store/list`).subscribe((res: any) => {
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
      }
    )
  }



  showEditForm(redeemData: any) {
    console.log(redeemData);

    this.addCoupon(redeemData);
  }

  addCoupon(redeemData: any = '') {
    const dialogRef = this.dialog.open(AddRedeemComponent, {
      hasBackdrop: false,
      width: '575px',
      data: {
        redeemData: redeemData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
       console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadData()
      }
    });
  }

  deleteRedeem(redeemData: any = '') {
    const dialogRef = this.dialog.open(DeleteRedeemComponent, {
      hasBackdrop: false,
      width: '575px',
      data: {
        redeemData: redeemData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
       console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.loadData()
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
}



export interface CATEGORY {
  sr: string,
  name: string,
  image: string,
  type: string,
  Status: string,
}