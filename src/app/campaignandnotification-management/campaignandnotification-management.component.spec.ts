import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignandnotificationManagementComponent } from './campaignandnotification-management.component';

describe('CampaignandnotificationManagementComponent', () => {
  let component: CampaignandnotificationManagementComponent;
  let fixture: ComponentFixture<CampaignandnotificationManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CampaignandnotificationManagementComponent]
    });
    fixture = TestBed.createComponent(CampaignandnotificationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
