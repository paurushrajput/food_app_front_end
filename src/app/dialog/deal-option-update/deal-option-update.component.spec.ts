import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealOptionUpdateComponent } from './deal-option-update.component';

describe('DealOptionUpdateComponent', () => {
  let component: DealOptionUpdateComponent;
  let fixture: ComponentFixture<DealOptionUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DealOptionUpdateComponent]
    });
    fixture = TestBed.createComponent(DealOptionUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
