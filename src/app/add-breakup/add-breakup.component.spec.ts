import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBreakupComponent } from './add-breakup.component';

describe('AddBreakupComponent', () => {
  let component: AddBreakupComponent;
  let fixture: ComponentFixture<AddBreakupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddBreakupComponent]
    });
    fixture = TestBed.createComponent(AddBreakupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
