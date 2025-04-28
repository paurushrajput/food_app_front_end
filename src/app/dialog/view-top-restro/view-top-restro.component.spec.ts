import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTopRestroComponent } from './view-top-restro.component';

describe('ViewTopRestroComponent', () => {
  let component: ViewTopRestroComponent;
  let fixture: ComponentFixture<ViewTopRestroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewTopRestroComponent]
    });
    fixture = TestBed.createComponent(ViewTopRestroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
