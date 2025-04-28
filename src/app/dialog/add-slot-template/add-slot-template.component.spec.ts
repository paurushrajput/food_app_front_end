import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSlotTemplateComponent } from './add-slot-template.component';

describe('AddSlotTemplateComponent', () => {
  let component: AddSlotTemplateComponent;
  let fixture: ComponentFixture<AddSlotTemplateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSlotTemplateComponent]
    });
    fixture = TestBed.createComponent(AddSlotTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
