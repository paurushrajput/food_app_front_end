import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WinnerBreakupComponent } from './winner-breakup.component';

describe('WinnerBreakupComponent', () => {
  let component: WinnerBreakupComponent;
  let fixture: ComponentFixture<WinnerBreakupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WinnerBreakupComponent]
    });
    fixture = TestBed.createComponent(WinnerBreakupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
