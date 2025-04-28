import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnershipTrackingComponent } from './partnership-tracking.component';

describe('PartnershipTrackingComponent', () => {
  let component: PartnershipTrackingComponent;
  let fixture: ComponentFixture<PartnershipTrackingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartnershipTrackingComponent]
    });
    fixture = TestBed.createComponent(PartnershipTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
