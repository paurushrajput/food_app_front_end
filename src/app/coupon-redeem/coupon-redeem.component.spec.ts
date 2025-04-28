import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponRedeemComponent } from './coupon-redeem.component';

describe('CouponRedeemComponent', () => {
  let component: CouponRedeemComponent;
  let fixture: ComponentFixture<CouponRedeemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CouponRedeemComponent]
    });
    fixture = TestBed.createComponent(CouponRedeemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
