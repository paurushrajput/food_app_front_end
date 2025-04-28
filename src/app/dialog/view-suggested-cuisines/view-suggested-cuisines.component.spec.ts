import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSuggestedCuisinesComponent } from './view-suggested-cuisines.component';

describe('ViewSuggestedCuisinesComponent', () => {
  let component: ViewSuggestedCuisinesComponent;
  let fixture: ComponentFixture<ViewSuggestedCuisinesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewSuggestedCuisinesComponent]
    });
    fixture = TestBed.createComponent(ViewSuggestedCuisinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
