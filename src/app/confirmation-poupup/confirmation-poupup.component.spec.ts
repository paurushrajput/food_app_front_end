import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationPoupupComponent } from './confirmation-poupup.component';

describe('ConfirmationPoupupComponent', () => {
  let component: ConfirmationPoupupComponent;
  let fixture: ComponentFixture<ConfirmationPoupupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmationPoupupComponent]
    });
    fixture = TestBed.createComponent(ConfirmationPoupupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
