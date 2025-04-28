import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-report-restaurant-details',
  templateUrl: './view-report-restaurant-details.component.html',
  styleUrls: ['./view-report-restaurant-details.component.scss']
})
export class ViewReportRestaurantDetailsComponent {

  restroData: any
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }


  ngOnInit() {
    this.restroData = this.data?.restaurantData?.restaurant
  }
}
