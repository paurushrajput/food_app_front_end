import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmRestaurantComponent } from './confirm-restaurant.component';

describe('ConfirmRestaurantComponent', () => {
  let component: ConfirmRestaurantComponent;
  let fixture: ComponentFixture<ConfirmRestaurantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmRestaurantComponent]
    });
    fixture = TestBed.createComponent(ConfirmRestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
