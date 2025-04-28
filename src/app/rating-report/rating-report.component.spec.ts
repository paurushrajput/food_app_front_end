import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingReportComponent } from './rating-report.component';

describe('RatingReportComponent', () => {
  let component: RatingReportComponent;
  let fixture: ComponentFixture<RatingReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RatingReportComponent]
    });
    fixture = TestBed.createComponent(RatingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
