import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoleMangementComponent } from './user-role-mangement.component';

describe('UserRoleMangementComponent', () => {
  let component: UserRoleMangementComponent;
  let fixture: ComponentFixture<UserRoleMangementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserRoleMangementComponent]
    });
    fixture = TestBed.createComponent(UserRoleMangementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
