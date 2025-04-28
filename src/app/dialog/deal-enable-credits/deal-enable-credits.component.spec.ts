import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealEnableCreditsComponent } from './deal-enable-credits.component';

describe('DealEnableCreditsComponent', () => {
  let component: DealEnableCreditsComponent;
  let fixture: ComponentFixture<DealEnableCreditsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DealEnableCreditsComponent]
    });
    fixture = TestBed.createComponent(DealEnableCreditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
