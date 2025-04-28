import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponManagementComponent } from './coupon-management.component';

describe('CouponManagementComponent', () => {
  let component: CouponManagementComponent;
  let fixture: ComponentFixture<CouponManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CouponManagementComponent]
    });
    fixture = TestBed.createComponent(CouponManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
