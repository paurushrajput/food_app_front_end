import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeactivateComponent } from './confirm-deactivate.component';

describe('ConfirmDeactivateComponent', () => {
  let component: ConfirmDeactivateComponent;
  let fixture: ComponentFixture<ConfirmDeactivateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmDeactivateComponent]
    });
    fixture = TestBed.createComponent(ConfirmDeactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
