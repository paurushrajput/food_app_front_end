import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGiftGoodiesComponent } from './add-gift-goodies.component';

describe('AddGiftGoodiesComponent', () => {
  let component: AddGiftGoodiesComponent;
  let fixture: ComponentFixture<AddGiftGoodiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddGiftGoodiesComponent]
    });
    fixture = TestBed.createComponent(AddGiftGoodiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
