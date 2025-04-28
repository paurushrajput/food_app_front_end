import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialReportComponent } from './social-report.component';

describe('SocialReportComponent', () => {
  let component: SocialReportComponent;
  let fixture: ComponentFixture<SocialReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SocialReportComponent]
    });
    fixture = TestBed.createComponent(SocialReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
