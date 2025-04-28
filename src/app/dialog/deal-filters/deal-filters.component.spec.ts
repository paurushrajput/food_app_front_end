import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealFiltersComponent } from './deal-filters.component';

describe('DealFiltersComponent', () => {
  let component: DealFiltersComponent;
  let fixture: ComponentFixture<DealFiltersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DealFiltersComponent]
    });
    fixture = TestBed.createComponent(DealFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
