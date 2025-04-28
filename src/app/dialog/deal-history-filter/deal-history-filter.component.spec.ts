import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealHistoryFilterComponent } from './deal-history-filter.component';

describe('DealHistoryFilterComponent', () => {
  let component: DealHistoryFilterComponent;
  let fixture: ComponentFixture<DealHistoryFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DealHistoryFilterComponent]
    });
    fixture = TestBed.createComponent(DealHistoryFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
