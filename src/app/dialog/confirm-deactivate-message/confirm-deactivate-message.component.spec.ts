import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeactivateMessageComponent } from './confirm-deactivate-message.component';

describe('ConfirmDeactivateMessageComponent', () => {
  let component: ConfirmDeactivateMessageComponent;
  let fixture: ComponentFixture<ConfirmDeactivateMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmDeactivateMessageComponent]
    });
    fixture = TestBed.createComponent(ConfirmDeactivateMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
