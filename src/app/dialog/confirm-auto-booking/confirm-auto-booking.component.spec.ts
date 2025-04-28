import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmAutoBookingComponent } from './confirm-auto-booking.component';

describe('ConfirmAutoBookingComponent', () => {
  let component: ConfirmAutoBookingComponent;
  let fixture: ComponentFixture<ConfirmAutoBookingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmAutoBookingComponent]
    });
    fixture = TestBed.createComponent(ConfirmAutoBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
