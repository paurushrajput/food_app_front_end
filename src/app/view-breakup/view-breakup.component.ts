import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app.service';
import { WinnerBreakupComponent } from '../winner-breakup/winner-breakup.component';

@Component({
  selector: 'app-view-breakup',
  templateUrl: './view-breakup.component.html',
  styleUrls: ['./view-breakup.component.scss']
})
export class ViewBreakupComponent {

  displayedColumns: string[] = ['rank','image'];
  dataSource: any
  winningData: any = []
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  constructor(
    public _appService: AppService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<WinnerBreakupComponent>,
    public dialog: MatDialog
  ) { }
  ngOnInit(): void {
    console.log(this.data);
    
    this.getData()
  }

  getData = () => {
    // if (this.data.breakupData.tourName) {
    //   console.log('111', this.data.breakupData.id);
    //   this._appService.getApiWithAuth(`admin/league/${this.data.breakupData.id}/winnings`).subscribe((res: any) => {
    //     this.winningData = res.data
    //     console.log(this.winningData);
    //   });
    //   this._appService.showSpinner()

    //   setTimeout(() => {
    //     this.dataSource = new MatTableDataSource<breakup>(this.winningData);
    //     this.dataSource.paginator = this.paginator;
    //     this._appService.hideSpinner()
    //   }, 1000);
    // } else {
      this.dataSource = new MatTableDataSource<breakup>(this.data.breakupData.break_up);
      this.dataSource.paginator = this.paginator;
    // }



  }

  closeDialogBox() {
     this.dialogRef.close({'status':'close'})
  }
}

export interface breakup {
  rankTo: string,
  rankFrom: string,
  priceAmount: string,
}
