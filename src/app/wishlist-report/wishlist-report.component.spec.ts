import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistReportComponent } from './wishlist-report.component';

describe('WishlistReportComponent', () => {
  let component: WishlistReportComponent;
  let fixture: ComponentFixture<WishlistReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WishlistReportComponent]
    });
    fixture = TestBed.createComponent(WishlistReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
