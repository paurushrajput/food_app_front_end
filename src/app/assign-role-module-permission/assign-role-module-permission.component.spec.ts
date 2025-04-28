import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignRoleModulePermissionComponent } from './assign-role-module-permission.component';

describe('AssignRoleModulePermissionComponent', () => {
  let component: AssignRoleModulePermissionComponent;
  let fixture: ComponentFixture<AssignRoleModulePermissionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignRoleModulePermissionComponent]
    });
    fixture = TestBed.createComponent(AssignRoleModulePermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
