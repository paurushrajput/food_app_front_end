import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialRestaurantManagementComponent } from './social-restaurant-management.component';

describe('SocialRestaurantManagementComponent', () => {
  let component: SocialRestaurantManagementComponent;
  let fixture: ComponentFixture<SocialRestaurantManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SocialRestaurantManagementComponent]
    });
    fixture = TestBed.createComponent(SocialRestaurantManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
