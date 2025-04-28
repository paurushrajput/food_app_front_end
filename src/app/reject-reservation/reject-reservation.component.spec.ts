import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectReservationComponent } from './reject-reservation.component';

describe('RejectReservationComponent', () => {
  let component: RejectReservationComponent;
  let fixture: ComponentFixture<RejectReservationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RejectReservationComponent]
    });
    fixture = TestBed.createComponent(RejectReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
