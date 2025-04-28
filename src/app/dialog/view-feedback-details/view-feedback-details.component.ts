import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app.service';
import { FeedbackManagementComponent } from 'src/app/feedback-management/feedback-management.component';

@Component({
  selector: 'app-view-feedback-details',
  templateUrl: './view-feedback-details.component.html',
  styleUrls: ['./view-feedback-details.component.scss']
})
export class ViewFeedbackDetailsComponent {


  displayedColumns: string[] = ['avg_rating', 'pending_reply_count', 'review_count', 'review_reply_count'];
  dataSource: any
  reviewData: any = []
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, public _appService: AppService,public dialogRef: MatDialogRef<FeedbackManagementComponent>
  ) { }
  ngOnInit(): void {
    this.loadData(this.data.feedbackData?.id)
  }

  loadData(resId: any) {
    this._appService.getApiWithAuth(`/admin/restaurant/get-reviews-details?res_id=${resId}`).subscribe((res: any) => {
      this.reviewData.push(res?.data?.rows)
      this.dataSource=this.reviewData
      console.log(this.reviewData);
    })
  }

  closeDialogBox() {
     this.dialogRef.close({'status':'close'})
  }
}

export interface breakup {
  rule: string,
}