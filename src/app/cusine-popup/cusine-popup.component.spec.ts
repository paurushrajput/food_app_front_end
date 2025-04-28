import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CusinePopupComponent } from './cusine-popup.component';

describe('CusinePopupComponent', () => {
  let component: CusinePopupComponent;
  let fixture: ComponentFixture<CusinePopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CusinePopupComponent]
    });
    fixture = TestBed.createComponent(CusinePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
