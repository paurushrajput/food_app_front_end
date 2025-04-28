import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignReportComponent } from './campaign-report.component';

describe('CampaignReportComponent', () => {
  let component: CampaignReportComponent;
  let fixture: ComponentFixture<CampaignReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CampaignReportComponent]
    });
    fixture = TestBed.createComponent(CampaignReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
