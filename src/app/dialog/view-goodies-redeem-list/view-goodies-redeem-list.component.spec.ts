import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGoodiesRedeemListComponent } from './view-goodies-redeem-list.component';

describe('ViewGoodiesRedeemListComponent', () => {
  let component: ViewGoodiesRedeemListComponent;
  let fixture: ComponentFixture<ViewGoodiesRedeemListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewGoodiesRedeemListComponent]
    });
    fixture = TestBed.createComponent(ViewGoodiesRedeemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
