import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserEmailComponent } from './add-user-email.component';

describe('AddUserEmailComponent', () => {
  let component: AddUserEmailComponent;
  let fixture: ComponentFixture<AddUserEmailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUserEmailComponent]
    });
    fixture = TestBed.createComponent(AddUserEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
