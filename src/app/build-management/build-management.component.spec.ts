import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildManagementComponent } from './build-management.component';

describe('BuildManagementComponent', () => {
  let component: BuildManagementComponent;
  let fixture: ComponentFixture<BuildManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuildManagementComponent]
    });
    fixture = TestBed.createComponent(BuildManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
