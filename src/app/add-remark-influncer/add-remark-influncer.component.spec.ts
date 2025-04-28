import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRemarkInfluncerComponent } from './add-remark-influncer.component';

describe('AddRemarkInfluncerComponent', () => {
  let component: AddRemarkInfluncerComponent;
  let fixture: ComponentFixture<AddRemarkInfluncerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddRemarkInfluncerComponent]
    });
    fixture = TestBed.createComponent(AddRemarkInfluncerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
