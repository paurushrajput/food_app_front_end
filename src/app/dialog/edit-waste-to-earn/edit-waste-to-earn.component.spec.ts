import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWasteToEarnComponent } from './edit-waste-to-earn.component';

describe('EditWasteToEarnComponent', () => {
  let component: EditWasteToEarnComponent;
  let fixture: ComponentFixture<EditWasteToEarnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditWasteToEarnComponent]
    });
    fixture = TestBed.createComponent(EditWasteToEarnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
