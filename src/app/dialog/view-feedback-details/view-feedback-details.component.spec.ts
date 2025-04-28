import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFeedbackDetailsComponent } from './view-feedback-details.component';

describe('ViewFeedbackDetailsComponent', () => {
  let component: ViewFeedbackDetailsComponent;
  let fixture: ComponentFixture<ViewFeedbackDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewFeedbackDetailsComponent]
    });
    fixture = TestBed.createComponent(ViewFeedbackDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
