import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDealCategoryComponent } from './add-deal-category.component';

describe('AddDealCategoryComponent', () => {
  let component: AddDealCategoryComponent;
  let fixture: ComponentFixture<AddDealCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddDealCategoryComponent]
    });
    fixture = TestBed.createComponent(AddDealCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
