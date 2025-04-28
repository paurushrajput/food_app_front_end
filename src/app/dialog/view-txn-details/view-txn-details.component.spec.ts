import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTxnDetailsComponent } from './view-txn-details.component';

describe('ViewTxnDetailsComponent', () => {
  let component: ViewTxnDetailsComponent;
  let fixture: ComponentFixture<ViewTxnDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewTxnDetailsComponent]
    });
    fixture = TestBed.createComponent(ViewTxnDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
