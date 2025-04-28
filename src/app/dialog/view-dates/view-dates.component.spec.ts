import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDatesComponent } from './view-dates.component';

describe('ViewDatesComponent', () => {
  let component: ViewDatesComponent;
  let fixture: ComponentFixture<ViewDatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewDatesComponent]
    });
    fixture = TestBed.createComponent(ViewDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
