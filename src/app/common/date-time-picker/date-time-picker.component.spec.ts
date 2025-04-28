import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatTimePickerComponent } from './date-time-picker.component';

describe('DatTimePickerComponent', () => {
  let component: DatTimePickerComponent;
  let fixture: ComponentFixture<DatTimePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatTimePickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
