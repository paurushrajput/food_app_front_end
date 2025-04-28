import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-reported-user-details',
  templateUrl: './view-reported-user-details.component.html',
  styleUrls: ['./view-reported-user-details.component.scss']
})
export class ViewReportedUserDetailsComponent {

  profileData: any
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }


  ngOnInit() {
    this.profileData = this.data?.userData?.reported_by_user ? this.data?.userData?.reported_by_user : this.data?.userData?.user
  }
}
