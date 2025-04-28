import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app.service';

@Component({
  selector: 'app-view-user-details',
  templateUrl: './view-user-details.component.html',
  styleUrls: ['./view-user-details.component.scss']
})
export class ViewUserDetailsComponent {
  displayedColumns: string[] = ['referral','device_id'];
  dataSource: any
  winningData: any = []
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, public _appService: AppService,
  ) { }
  ngOnInit(): void {
    this.getData()
  }

  getData = () => {
    let date=[]
    date.push(this.data)
    this.dataSource = new MatTableDataSource<breakup>(date);
    this.dataSource.paginator = this.paginator;
  }

  closeDialogBox() {
    this.dialog.closeAll()
  }
}

export interface breakup {
  referral_Code: string,
  device_id:String
}