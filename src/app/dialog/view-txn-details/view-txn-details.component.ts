import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app.service';

@Component({
  selector: 'app-view-txn-details',
  templateUrl: './view-txn-details.component.html',
  styleUrls: ['./view-txn-details.component.scss']
})
export class ViewTxnDetailsComponent {

  displayedColumns: string[] = ['txnId', 'message'];
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
    let sendData = []
    sendData.push(this.data)
    this.dataSource = new MatTableDataSource<breakup>(sendData);
    this.dataSource.paginator = this.paginator;
  }

  closeDialogBox() {
    this.dialog.closeAll()
  }
}

export interface breakup {
  rule: string,
}