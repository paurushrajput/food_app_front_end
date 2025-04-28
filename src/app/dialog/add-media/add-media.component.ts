import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { CATEGORY } from '../view-leaderboard/view-leaderboard.component';
import { BannerManagementComponent } from 'src/app/banner-management/banner-management.component';

@Component({
  selector: 'app-add-media',
  templateUrl: './add-media.component.html',
  styleUrls: ['./add-media.component.scss']
})
export class AddMediaComponent {
  dataSource: MatTableDataSource<CATEGORY> = new MatTableDataSource();

  currentPage: any = 0;
  pageSize: any = 50;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  data: any;
  searchBy: string = '';       // Holds the selected search option

  // Options for "Search By" dropdown
  searchByOptions = [
    { value: '', viewValue: 'All' },
    { value: 'cuisine', viewValue: 'Cuisine' },
    { value: 'amenities', viewValue: 'Amenities' },
    { value: 'banner', viewValue: 'Banner' },
    { value: 'restaurant', viewValue: 'Restaurant' },
    { value: 'restaurant_menu', viewValue: 'Restaurant Menu' },
    { value: 'deals', viewValue: 'Deals' },
    { value: 'location', viewValue: 'Location' }
  ];
  recentData: any;
  image: any;
  imageSize: any;
  constructor(
    public _appService: AppService,
    @Optional() @Inject(MAT_DIALOG_DATA) public datas: any,
    public dialog: MatDialog, public dialogRef: MatDialogRef<BannerManagementComponent>,
    public router: Router,

  ) {
    console.log(this.datas)
    this.searchBy = this.datas.type
    if (this.searchBy)
      this.loadData("&searchBy=" + this.searchBy)
    else
      this.loadData()
    // this.loadRecentData()
  }

  totalRows: any = 0
  pageSizeOptions: number[] = [10, 20, 300, 40, 100];
  onSearchByChange() {
    // Prepare the request payload
    if (this.searchBy)
      this.loadData("&searchBy=" + this.searchBy)
    else
      this.loadData()
  }
  onFileSelecteds(fileInput: any) {
    if (fileInput.target.files.length > 0) {
      const file: File = fileInput.target.files[0]
      this.imageSize = this._appService.formatBytes(file.size);
      this.uploadImage(file)
      // const reader = new FileReader();
      // reader.onload = () => {
      //   this.image = reader.result as string;
      // }
      // reader.readAsDataURL(file)
    }
  }
  selectedItemId: any = '';

  selectItem(items: any, event: any = null): void {

    if (this.datas?.multiple) {
      this.data = this.data.map((item: any) => {
        if (item.id === items.id) {
          item.selected = event ? event.checked : !item.selected; // Toggle the `selected` property
        }
        return item; // Return updated item
      });
      if (items.selected) {
        // Add to selected itemss if not already present
        if (!this.selectedItemId) this.selectedItemId = [];
        this.selectedItemId.push(items);
      } else {
        // Remove from selected items if unselected
        this.selectedItemId = this.selectedItemId.filter((selected: any) => selected.id !== items.id);
      }
      //console.log(this.selectedItemId)
    } else {
      

      this.data = this.data.map((item: any) => {
        if (item.id === items.id) {
          item.selected = event ? event.checked : !item.selected; // Toggle the `selected` property
          if (item.selected) {
            this.selectedItemId = item; // Update selectedItemId
          } else {
            this.selectedItemId = null; // Clear selectedItemId if unselected
          }
        } else {
          item.selected = false; // Deselect other items in single-selection mode
        }
        return item; // Return updated item
      });
      
    }
  }
  uploadImage(file: any) {
    if (file) {
      let formData = new FormData();
      formData.append('file', file)
      var promise = new Promise((resolve, reject) => {
        this._appService.postApiWithAuthentication(`/admin/media/image`, formData, 1).subscribe({
          next:
            (success: any) => {
              if (success.success == true) {
                this.loadData()

              }
            },
          error: (error: any) => {
            this._appService.err(error?.error?.msg)
          }
        })
      });
      return promise
    } else {
      return null
    }

  }
  loadData(query: any = "") {
    // this._appService.showSpinner()
    let type = 'image'
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/media/list?type=${type}&page=${this.currentPage + 1}&page_size=${this.pageSize}&is_paginated=true${query}`).subscribe((res: any) => {
 
      // this.data = res.data?.rows.map((item: any) => ({
      //   ...item,
      //   selected: false // Initialize the selected property
      // }));
      // console.log(this.data?.preselectedItemId)
      // this.data = res.data?.rows.map((item: any) => {
      //   item.selected = item.image === this.datas?.preselectedItemId;
      //   return item;
      // });

      // const preselectedItemIndex = this.data.findIndex((item: any) => item.image === this.datas.preselectedItemId);
      // if (preselectedItemIndex > -1) {
      //   // Remove the preselected item from its original position
      //   const [preselectedItem] = this.data.splice(preselectedItemIndex, 1);
      //   // Add the preselected item to the beginning of the array
      //   this.data.unshift(preselectedItem);
      //   // Mark it as selected
      //   preselectedItem.selected = true;
      //   this.selectedItemId = preselectedItem;
      // }
      this.data = res.data?.rows.map((item: any) => {
        item.selected = this.datas.multiple
          ? this.datas?.preselectedItemId?.includes(item.image)
          : item.image === this.datas?.preselectedItemId;
        return item;
      });

      if (!this.datas.multiple) {
        const preselectedItemIndex = this.data.findIndex((item: any) => item.image === this.datas.preselectedItemId);
        if (preselectedItemIndex > -1) {
          const [preselectedItem] = this.data.splice(preselectedItemIndex, 1);
          this.data.unshift(preselectedItem);
          preselectedItem.selected = true;
          this.selectedItemId = preselectedItem;
        }
      } else {
        // Handle multiple preselected items
        if (this.datas.preselectedItemId) {
          const preselectedItems = this.data.filter((item: any) => item.selected);
          this.selectedItemId = preselectedItems; // Update selected items

          // Remove preselected items from their original positions
          this.data = this.data.filter((item: any) => !item.selected);

          // Add preselected items to the top
          this.data.unshift(...preselectedItems);
        }

      }

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
  submitData() {
    this.dialogRef.close({ "status": true, "value": this.selectedItemId })
  }
  loadRecentData() {
    // this._appService.showSpinner()
    let type = 'image'
    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/media/list?type=${type}&page=${this.currentPage + 1}&page_size=5&is_paginated=true`).subscribe((res: any) => {

      this.recentData = res.data?.rows
      this._appService.hideSpinner()

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
}
