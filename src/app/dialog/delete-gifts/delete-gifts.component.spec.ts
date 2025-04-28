import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteGiftsComponent } from './delete-gifts.component';

describe('DeleteGiftsComponent', () => {
  let component: DeleteGiftsComponent;
  let fixture: ComponentFixture<DeleteGiftsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteGiftsComponent]
    });
    fixture = TestBed.createComponent(DeleteGiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
