import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCashoutRequestComponent } from './update-cashout-request.component';

describe('UpdateCashoutRequestComponent', () => {
  let component: UpdateCashoutRequestComponent;
  let fixture: ComponentFixture<UpdateCashoutRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateCashoutRequestComponent]
    });
    fixture = TestBed.createComponent(UpdateCashoutRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
