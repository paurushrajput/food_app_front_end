import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAmenitiesComponent } from './add-amenities.component';

describe('AddAmenitiesComponent', () => {
  let component: AddAmenitiesComponent;
  let fixture: ComponentFixture<AddAmenitiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddAmenitiesComponent]
    });
    fixture = TestBed.createComponent(AddAmenitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
