import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app.service';
import { TournamentRuleManagementComponent } from 'src/app/tournament-rule-management/tournament-rule-management.component';

@Component({
  selector: 'app-view-rule',
  templateUrl: './view-rule.component.html',
  styleUrls: ['./view-rule.component.scss']
})
export class ViewRuleComponent {


  displayedColumns: string[] = ['rule'];
  dataSource: any
  winningData: any = []
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,public _appService: AppService,public dialogRef: MatDialogRef<TournamentRuleManagementComponent>
  ) { }
  ngOnInit(): void {
    console.log(this.data.tournamentData.rule);
    this.getData()
  }

  getData = () => {
    this.dataSource = new MatTableDataSource<breakup>(this.data.tournamentData.rule);
    this.dataSource.paginator = this.paginator;
  }

  closeDialogBox() {
     this.dialogRef.close({'status':'close'})
  }
}

export interface breakup {
  rule: string,
}