import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPilotModeComponent } from './confirm-pilot-mode.component';

describe('ConfirmPilotModeComponent', () => {
  let component: ConfirmPilotModeComponent;
  let fixture: ComponentFixture<ConfirmPilotModeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmPilotModeComponent]
    });
    fixture = TestBed.createComponent(ConfirmPilotModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
