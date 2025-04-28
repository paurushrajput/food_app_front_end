import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealEnableDisableComponent } from './deal-enable-disable.component';

describe('DealEnableDisableComponent', () => {
  let component: DealEnableDisableComponent;
  let fixture: ComponentFixture<DealEnableDisableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DealEnableDisableComponent]
    });
    fixture = TestBed.createComponent(DealEnableDisableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
