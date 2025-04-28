import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBreakupComponent } from './view-breakup.component';

describe('ViewBreakupComponent', () => {
  let component: ViewBreakupComponent;
  let fixture: ComponentFixture<ViewBreakupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewBreakupComponent]
    });
    fixture = TestBed.createComponent(ViewBreakupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
