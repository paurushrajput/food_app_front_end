import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmInfluncerRequestComponent } from './confirm-influncer-request.component';

describe('ConfirmInfluncerRequestComponent', () => {
  let component: ConfirmInfluncerRequestComponent;
  let fixture: ComponentFixture<ConfirmInfluncerRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmInfluncerRequestComponent]
    });
    fixture = TestBed.createComponent(ConfirmInfluncerRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
