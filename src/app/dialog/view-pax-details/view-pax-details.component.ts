import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app.service';
import { RestaurantManagementComponent } from 'src/app/restaurant-management/restaurant-management.component';

@Component({
  selector: 'app-view-pax-details',
  templateUrl: './view-pax-details.component.html',
  styleUrls: ['./view-pax-details.component.scss']
})
export class ViewPaxDetailsComponent {

  displayedColumns: string[] = ['guest','amount'];
  dataSource: any
  winningData: any = []
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  constructor(
    public _appService: AppService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<RestaurantManagementComponent>,
    public dialog: MatDialog
  ) { }
  ngOnInit(): void {
    this.getData()
  }

  getData = () => {
      this.dataSource = new MatTableDataSource<breakup>(this.data.resData?.pax_details?.varies_per_pax);
      this.dataSource.paginator = this.paginator;
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
