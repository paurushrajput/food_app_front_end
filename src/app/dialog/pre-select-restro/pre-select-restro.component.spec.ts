import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreSelectRestroComponent } from './pre-select-restro.component';

describe('PreSelectRestroComponent', () => {
  let component: PreSelectRestroComponent;
  let fixture: ComponentFixture<PreSelectRestroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreSelectRestroComponent]
    });
    fixture = TestBed.createComponent(PreSelectRestroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
