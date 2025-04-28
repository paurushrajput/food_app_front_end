import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoriesManagementComponent } from './stories-management.component';

describe('StoriesManagementComponent', () => {
  let component: StoriesManagementComponent;
  let fixture: ComponentFixture<StoriesManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StoriesManagementComponent]
    });
    fixture = TestBed.createComponent(StoriesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
