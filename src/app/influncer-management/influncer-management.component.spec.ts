import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfluncerManagementComponent } from './influncer-management.component';

describe('InfluncerManagementComponent', () => {
  let component: InfluncerManagementComponent;
  let fixture: ComponentFixture<InfluncerManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfluncerManagementComponent]
    });
    fixture = TestBed.createComponent(InfluncerManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
