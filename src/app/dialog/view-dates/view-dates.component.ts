import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app.service';

@Component({
  selector: 'app-view-dates',
  templateUrl: './view-dates.component.html',
  styleUrls: ['./view-dates.component.scss']
})
export class ViewDatesComponent {
  name: any = ''
  displayedColumns: string[] = ['date'];
  dataSource: any
  winningData: any = []
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, public _appService: AppService,
  ) { }
  ngOnInit(): void {
    this.name=this.data.name
    this.getData()
  }

  getData = () => {
    let date=[]
    date.push(this.data.date)
    this.dataSource = new MatTableDataSource<breakup>(date);
    this.dataSource.paginator = this.paginator;
  }

  closeDialogBox() {
    this.dialog.closeAll()
  }
}

export interface breakup {
  rule: string,
}