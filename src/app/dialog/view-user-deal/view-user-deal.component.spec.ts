import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserDealComponent } from './view-user-deal.component';

describe('ViewUserDealComponent', () => {
  let component: ViewUserDealComponent;
  let fixture: ComponentFixture<ViewUserDealComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewUserDealComponent]
    });
    fixture = TestBed.createComponent(ViewUserDealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
