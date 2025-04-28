import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DinningManagementComponent } from './dinning-management.component';

describe('DinningManagementComponent', () => {
  let component: DinningManagementComponent;
  let fixture: ComponentFixture<DinningManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DinningManagementComponent]
    });
    fixture = TestBed.createComponent(DinningManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
