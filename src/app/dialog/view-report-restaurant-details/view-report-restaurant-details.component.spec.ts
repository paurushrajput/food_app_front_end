import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReportRestaurantDetailsComponent } from './view-report-restaurant-details.component';

describe('ViewReportRestaurantDetailsComponent', () => {
  let component: ViewReportRestaurantDetailsComponent;
  let fixture: ComponentFixture<ViewReportRestaurantDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewReportRestaurantDetailsComponent]
    });
    fixture = TestBed.createComponent(ViewReportRestaurantDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
