import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AddSettingComponent } from '../dialog/add-setting/add-setting.component';
import { ImagePreviewDialogComponent } from '../dialog/image-preview-dialog/image-preview-dialog.component';

@Component({
  selector: 'app-setting-management',
  templateUrl: './setting-management.component.html',
  styleUrls: ['./setting-management.component.scss']
})
export class SettingManagementComponent {
  imageSrc:any;
  selectedCategory: any = {}
  ELEMENT_DATA: user[] = [];
  totalRows = 0;
  pageSize = 10;
  searchForm!: FormGroup;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 20, 300, 40, 100];
  displayedColumns: string[] = ['sr', 'title', 'image', 'desc', 'url', 'sequence', 'action'];
  dataSource: MatTableDataSource<user> = new MatTableDataSource();
  selectedLocation: any = {}
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  teamData: any;
  searchTextNotEmpty:any;
  apiUrl: any;
  controls: any = {
    name: {
      controls: 'name',
      placeholder: 'Search by Name /Email',
      label: 'Search by Name or Email'
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
      // startDate: [''],
      // endDate: [''],
    });
  }
  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.dataSource.data, event.previousIndex, event.currentIndex);
    this.dataSource.data.forEach((item, index) => {

      item.sequence = index + 1; // Assuming sequence starts from 1
      delete item.image;
    });
    console.log(this.dataSource.data)

    this.updateBackendWithNewOrder(this.dataSource.data)
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
  
  private updateBackendWithNewOrder(data: any): void {
    data.forEach((object: { [x: string]: any; }) => {
      delete object['image'];
    });
    this._appService.putApiWithAuth("/admin/app-settings/bulk", { "app_settings": data }, 1)
      .subscribe(
        response => {
          this._appService.success('setting updated successfully')
          this.loadData()
        },
        error => {
          // Handle error appropriately, e.g., show a notification to the user
        }
      );
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


  showEditForm(setting: any) {
    this.selectedCategory = setting
    this.addSetting(setting);
  }

  loadData() {
    this._appService.showSpinner()
    let keyword = this.searchForm.value.name ? this.searchForm.value.name : '';
    this._appService.getApiWithAuth(`/admin/app-settings/list?page=${this.currentPage + 1}&page_size=${this.pageSize}`).subscribe((res: any) => {
      if (res.status_code == '401') {
        this.router.navigateByUrl("/");
      }
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
    this.searchForm.reset()
    this.loadData()
  }


  addSetting(setting: any = {}) {
    const dialogRef = this.dialog.open(AddSettingComponent, {
      hasBackdrop: false,
      width: '575px',
      // height: '100',
      data: {
        settingData: setting
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.status}`);
      if (result && result.status != 'close') {
        this.currentPage = 0
        this.loadData()
      }
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
    this.searchForm.patchValue({name:searchText})
   
    this.loadData();
  }

  
  onClearSearch() {
    this.searchForm.patchValue({name:""})
    this.loadData();
    // Handle clear search logic here
  }
}



export interface user {
  sr: string,
  fname: string,
  lname: string,
  image: any,
  Status: string,
  sequence: any;
}