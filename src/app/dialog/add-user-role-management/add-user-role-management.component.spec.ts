import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserRoleManagementComponent } from './add-user-role-management.component';

describe('AddUserRoleManagementComponent', () => {
  let component: AddUserRoleManagementComponent;
  let fixture: ComponentFixture<AddUserRoleManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUserRoleManagementComponent]
    });
    fixture = TestBed.createComponent(AddUserRoleManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
