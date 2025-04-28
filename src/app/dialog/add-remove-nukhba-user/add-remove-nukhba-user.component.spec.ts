import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRemoveNukhbaUserComponent } from './add-remove-nukhba-user.component';

describe('AddRemoveNukhbaUserComponent', () => {
  let component: AddRemoveNukhbaUserComponent;
  let fixture: ComponentFixture<AddRemoveNukhbaUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddRemoveNukhbaUserComponent]
    });
    fixture = TestBed.createComponent(AddRemoveNukhbaUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
