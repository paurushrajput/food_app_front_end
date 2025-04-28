import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationManagementComponent } from './notification-management.component';

describe('NotificationManagementComponent', () => {
  let component: NotificationManagementComponent;
  let fixture: ComponentFixture<NotificationManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationManagementComponent]
    });
    fixture = TestBed.createComponent(NotificationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
