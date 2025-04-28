import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReportedUserDetailsComponent } from './view-reported-user-details.component';

describe('ViewReportedUserDetailsComponent', () => {
  let component: ViewReportedUserDetailsComponent;
  let fixture: ComponentFixture<ViewReportedUserDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewReportedUserDetailsComponent]
    });
    fixture = TestBed.createComponent(ViewReportedUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
