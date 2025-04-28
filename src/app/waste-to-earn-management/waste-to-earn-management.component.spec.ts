import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WasteToEarnManagementComponent } from './waste-to-earn-management.component';

describe('WasteToEarnManagementComponent', () => {
  let component: WasteToEarnManagementComponent;
  let fixture: ComponentFixture<WasteToEarnManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WasteToEarnManagementComponent]
    });
    fixture = TestBed.createComponent(WasteToEarnManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
