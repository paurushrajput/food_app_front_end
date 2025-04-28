import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotListComponent } from './slot-list.component';

describe('SlotListComponent', () => {
  let component: SlotListComponent;
  let fixture: ComponentFixture<SlotListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SlotListComponent]
    });
    fixture = TestBed.createComponent(SlotListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
