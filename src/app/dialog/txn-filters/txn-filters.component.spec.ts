import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxnFiltersComponent } from './txn-filters.component';

describe('TxnFiltersComponent', () => {
  let component: TxnFiltersComponent;
  let fixture: ComponentFixture<TxnFiltersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TxnFiltersComponent]
    });
    fixture = TestBed.createComponent(TxnFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
