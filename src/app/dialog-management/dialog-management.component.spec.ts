import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogManagementComponent } from './dialog-management.component';

describe('DialogManagementComponent', () => {
  let component: DialogManagementComponent;
  let fixture: ComponentFixture<DialogManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogManagementComponent]
    });
    fixture = TestBed.createComponent(DialogManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
