import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRestroBookingsComponent } from './view-restro-bookings.component';

describe('ViewRestroBookingsComponent', () => {
  let component: ViewRestroBookingsComponent;
  let fixture: ComponentFixture<ViewRestroBookingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewRestroBookingsComponent]
    });
    fixture = TestBed.createComponent(ViewRestroBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
