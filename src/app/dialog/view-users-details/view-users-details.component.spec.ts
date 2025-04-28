import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUsersDetailsComponent } from './view-users-details.component';

describe('ViewUsersDetailsComponent', () => {
  let component: ViewUsersDetailsComponent;
  let fixture: ComponentFixture<ViewUsersDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewUsersDetailsComponent]
    });
    fixture = TestBed.createComponent(ViewUsersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
