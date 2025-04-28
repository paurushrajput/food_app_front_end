import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantPaymentManagementComponent } from './instant-payment-management.component';

describe('InstantPaymentManagementComponent', () => {
  let component: InstantPaymentManagementComponent;
  let fixture: ComponentFixture<InstantPaymentManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstantPaymentManagementComponent]
    });
    fixture = TestBed.createComponent(InstantPaymentManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
