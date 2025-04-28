import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSuggestedPriceComponent } from './view-suggested-price.component';

describe('ViewSuggestedPriceComponent', () => {
  let component: ViewSuggestedPriceComponent;
  let fixture: ComponentFixture<ViewSuggestedPriceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewSuggestedPriceComponent]
    });
    fixture = TestBed.createComponent(ViewSuggestedPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
