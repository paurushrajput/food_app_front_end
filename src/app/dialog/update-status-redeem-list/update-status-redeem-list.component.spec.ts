import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStatusRedeemListComponent } from './update-status-redeem-list.component';

describe('UpdateStatusRedeemListComponent', () => {
  let component: UpdateStatusRedeemListComponent;
  let fixture: ComponentFixture<UpdateStatusRedeemListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateStatusRedeemListComponent]
    });
    fixture = TestBed.createComponent(UpdateStatusRedeemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
