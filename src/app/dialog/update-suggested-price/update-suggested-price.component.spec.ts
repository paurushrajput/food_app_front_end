import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSuggestedPriceComponent } from './update-suggested-price.component';

describe('UpdateSuggestedPriceComponent', () => {
  let component: UpdateSuggestedPriceComponent;
  let fixture: ComponentFixture<UpdateSuggestedPriceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateSuggestedPriceComponent]
    });
    fixture = TestBed.createComponent(UpdateSuggestedPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
