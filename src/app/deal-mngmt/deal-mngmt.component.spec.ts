import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealMngmtComponent } from './deal-mngmt.component';

describe('DealMngmtComponent', () => {
  let component: DealMngmtComponent;
  let fixture: ComponentFixture<DealMngmtComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DealMngmtComponent]
    });
    fixture = TestBed.createComponent(DealMngmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
