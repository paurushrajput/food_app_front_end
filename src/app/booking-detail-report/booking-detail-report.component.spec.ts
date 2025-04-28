import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingDetailReportComponent } from './booking-detail-report.component';

describe('BookingDetailReportComponent', () => {
  let component: BookingDetailReportComponent;
  let fixture: ComponentFixture<BookingDetailReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingDetailReportComponent]
    });
    fixture = TestBed.createComponent(BookingDetailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
