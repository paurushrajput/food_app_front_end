import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDinningComponent } from './add-dinning.component';

describe('AddDinningComponent', () => {
  let component: AddDinningComponent;
  let fixture: ComponentFixture<AddDinningComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddDinningComponent]
    });
    fixture = TestBed.createComponent(AddDinningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
