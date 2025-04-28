import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftGoodiesManagementComponent } from './gift-goodies-management.component';

describe('GiftGoodiesManagementComponent', () => {
  let component: GiftGoodiesManagementComponent;
  let fixture: ComponentFixture<GiftGoodiesManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GiftGoodiesManagementComponent]
    });
    fixture = TestBed.createComponent(GiftGoodiesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
