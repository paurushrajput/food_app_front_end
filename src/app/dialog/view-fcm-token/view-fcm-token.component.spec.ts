import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFcmTokenComponent } from './view-fcm-token.component';

describe('ViewFcmTokenComponent', () => {
  let component: ViewFcmTokenComponent;
  let fixture: ComponentFixture<ViewFcmTokenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewFcmTokenComponent]
    });
    fixture = TestBed.createComponent(ViewFcmTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
