import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPaxDetailsComponent } from './view-pax-details.component';

describe('ViewPaxDetailsComponent', () => {
  let component: ViewPaxDetailsComponent;
  let fixture: ComponentFixture<ViewPaxDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewPaxDetailsComponent]
    });
    fixture = TestBed.createComponent(ViewPaxDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
