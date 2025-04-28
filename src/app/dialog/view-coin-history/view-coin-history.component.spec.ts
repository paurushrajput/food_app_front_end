import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCoinHistoryComponent } from './view-coin-history.component';

describe('ViewCoinHistoryComponent', () => {
  let component: ViewCoinHistoryComponent;
  let fixture: ComponentFixture<ViewCoinHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewCoinHistoryComponent]
    });
    fixture = TestBed.createComponent(ViewCoinHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
