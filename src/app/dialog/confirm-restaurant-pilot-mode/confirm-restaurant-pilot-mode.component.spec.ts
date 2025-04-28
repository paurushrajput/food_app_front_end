import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmRestaurantPilotModeComponent } from './confirm-restaurant-pilot-mode.component';

describe('ConfirmRestaurantPilotModeComponent', () => {
  let component: ConfirmRestaurantPilotModeComponent;
  let fixture: ComponentFixture<ConfirmRestaurantPilotModeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmRestaurantPilotModeComponent]
    });
    fixture = TestBed.createComponent(ConfirmRestaurantPilotModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
