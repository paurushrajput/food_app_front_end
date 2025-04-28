import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app.service';
import { AddAmenitiesComponent } from '../dialog/add-amenities/add-amenities.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ImagePreviewDialogComponent } from '../dialog/image-preview-dialog/image-preview-dialog.component';

@Component({
  selector: 'app-amenities-management',
  templateUrl: './amenities-management.component.html',
  styleUrls: ['./amenities-management.component.scss']
})
export class AmenitiesManagementComponent {

  imageSrc: any
  ELEMENT_DATA: CATEGORY[] = [];
  totalRows = 0;
  pageSize = 10;
  searchForm!: FormGroup;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 20, 300, 40, 100];
  displayedColumns: string[] = ['sr', 'name', 'image', 'restro', 'status', 'action'];
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
    private route: ActivatedRoute,

  ) {
    this.searchForm = this.fb.group({
      name: [this.route.snapshot.queryParamMap.get('name') || ''],
      status: [this.route.snapshot.queryParamMap.get('status') || ''],
     
      // startDate: [''],
      // endDate: [''],
    });
  }

  onSearch(searchText: string) {
    // Handle search logic here
    this.searchForm.patchValue({ name: searchText })
    this.currentPage = 0
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
    const params = this.route.snapshot.queryParamMap;
    this.searchForm.patchValue({
        name: params.get('name') || '',
        status: params.get('status') || '',
      
    });
    
    this.currentPage = params.get('page')?+params.get('page')! - 1 : 0;
    this.pageSize = +params.get('pageSize')! || 10;
    this.loadData()
  }
  searchData(){
    this.currentPage = 0
    this.loadData();
  
  }

  ngAfterViewChecked(): void {
    // new addin_pad();
  }

  addAmenities(amenitiesData: any = {}) {
    const dialogRef = this.dialog.open(AddAmenitiesComponent, {
      hasBackdrop: false,
      width: '575px',
      // height: '100',
      data: {
        amenitiesData: amenitiesData,
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

  showEditForm(location: any) {
    this.selectedLocation = location
    this.addAmenities(location);
  }

  buildQueryParams() {
   
    const name = this.searchForm.value.name || '';
    const status = this.searchForm.value.status || '';
    return {
      name,
      status,
      page: this.currentPage + 1,
      pageSize: this.pageSize
    };
  }
  loadData() {
    let status = this.searchForm.value.status ? this.searchForm.value.status : '';
    this._appService.showSpinner()
    const params = this.buildQueryParams();
    this._appService.updateQueryParams(params);
    this._appService.getApiWithAuth(`/admin/amenities/list?page=${this.currentPage + 1}&page_size=${this.pageSize}&keyword=${this.searchForm.value.name ? this.searchForm.value.name : ''}&status=${status}&isPaginated=false`).subscribe((res: any) => {
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
  }

}



export interface CATEGORY {
  sr: string,
  name: string,
  image: string,
  type: string,
  Status: string,
}