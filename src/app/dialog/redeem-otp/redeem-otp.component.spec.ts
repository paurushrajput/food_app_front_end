import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedeemOtpComponent } from './redeem-otp.component';

describe('RedeemOtpComponent', () => {
  let component: RedeemOtpComponent;
  let fixture: ComponentFixture<RedeemOtpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RedeemOtpComponent]
    });
    fixture = TestBed.createComponent(RedeemOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
