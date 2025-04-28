import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLikeListComponent } from './view-like-list.component';

describe('ViewLikeListComponent', () => {
  let component: ViewLikeListComponent;
  let fixture: ComponentFixture<ViewLikeListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewLikeListComponent]
    });
    fixture = TestBed.createComponent(ViewLikeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
