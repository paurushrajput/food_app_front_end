import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantPaymentFilterComponent } from './instant-payment-filter.component';

describe('InstantPaymentFilterComponent', () => {
  let component: InstantPaymentFilterComponent;
  let fixture: ComponentFixture<InstantPaymentFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstantPaymentFilterComponent]
    });
    fixture = TestBed.createComponent(InstantPaymentFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
