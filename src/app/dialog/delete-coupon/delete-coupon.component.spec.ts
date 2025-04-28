import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCouponComponent } from './delete-coupon.component';

describe('DeleteCouponComponent', () => {
  let component: DeleteCouponComponent;
  let fixture: ComponentFixture<DeleteCouponComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteCouponComponent]
    });
    fixture = TestBed.createComponent(DeleteCouponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
