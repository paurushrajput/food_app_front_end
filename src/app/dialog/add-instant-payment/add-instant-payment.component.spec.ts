import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInstantPaymentComponent } from './add-instant-payment.component';

describe('AddInstantPaymentComponent', () => {
  let component: AddInstantPaymentComponent;
  let fixture: ComponentFixture<AddInstantPaymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddInstantPaymentComponent]
    });
    fixture = TestBed.createComponent(AddInstantPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
