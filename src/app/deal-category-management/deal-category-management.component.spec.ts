import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealCategoryManagementComponent } from './deal-category-management.component';

describe('DealCategoryManagementComponent', () => {
  let component: DealCategoryManagementComponent;
  let fixture: ComponentFixture<DealCategoryManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DealCategoryManagementComponent]
    });
    fixture = TestBed.createComponent(DealCategoryManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
