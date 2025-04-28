import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CATEGORY } from '../location-management/location-management.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AppService } from 'src/app.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AddTournamentComponent } from '../dialog/add-tournament/add-tournament.component';
import { ImagePreviewDialogComponent } from '../dialog/image-preview-dialog/image-preview-dialog.component';

@Component({
  selector: 'app-game-management',
  templateUrl: './game-management.component.html',
  styleUrls: ['./game-management.component.scss']
})
export class GameManagementComponent {
  imageSrc:any;
  totalRows = 0;
  pageSize = 10;
  id: any
  searchForm!: FormGroup;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 20, 300, 40, 100];
  displayedColumns: string[] = ['sr', 'image', 'title', 'excerpt', 'game_url', 'actionv1'];
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
      type: [''],
      // startDate: [''],
      // endDate: [''],
    });
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    console.log(this.data);
    this.loadData()
  }

  ngAfterViewChecked(): void {
    // new addin_pad();
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
  
  loadData() {

    this._appService.showSpinner()
    this._appService.getApiWithAuth(`/admin/tournaments/get-game-list?page=1&page_size=10&is_paginated=true&sort_by=created_at&order=desc&from_date&to_date`).subscribe((res: any) => {
      this.dataSource.data = res.data
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
  // deleteStories(storiesData: any = {}){
  //   const dialogRef = this.dialog.open(DeleteRequestComponent, {
  //     // width: '80px',
  //     // height: '80px',
  //     data: {
  //       text: 'Stories',
  //       label: 'Delete',
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(`Dialog result: ${result.data}`);
  //     if( result && result.data.status ==1){
  //       this._appService.deleteApi(`/admin/stories/delete`,{id:storiesData.id},1).subscribe((success: any) => {

  //         if (success.success) {
  //           this._appService.success(success.msg)
  //         this.loadData()
  //         } else {
  //           this._appService.error(success.msg)
  //         this.loadData()
  //         }
  //       })
  //     }


  //   });
  // }
  addTournament(tournamentData: any = {}) {
    const dialogRef = this.dialog.open(AddTournamentComponent, {
      hasBackdrop: false,
      // width: '80px',
      // height: '80px',
      data: {
        tournamentData: tournamentData,
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
