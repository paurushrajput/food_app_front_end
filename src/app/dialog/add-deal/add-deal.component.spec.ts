import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDealComponent } from './add-deal.component';

describe('AddDealComponent', () => {
  let component: AddDealComponent;
  let fixture: ComponentFixture<AddDealComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddDealComponent]
    });
    fixture = TestBed.createComponent(AddDealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
