import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmReportStatusComponent } from './confirm-report-status.component';

describe('ConfirmReportStatusComponent', () => {
  let component: ConfirmReportStatusComponent;
  let fixture: ComponentFixture<ConfirmReportStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmReportStatusComponent]
    });
    fixture = TestBed.createComponent(ConfirmReportStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
