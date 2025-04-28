import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashoutRequestManagementComponent } from './cashout-request-management.component';

describe('CashoutRequestManagementComponent', () => {
  let component: CashoutRequestManagementComponent;
  let fixture: ComponentFixture<CashoutRequestManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CashoutRequestManagementComponent]
    });
    fixture = TestBed.createComponent(CashoutRequestManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
