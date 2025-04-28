import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCommentListComponent } from './view-comment-list.component';

describe('ViewCommentListComponent', () => {
  let component: ViewCommentListComponent;
  let fixture: ComponentFixture<ViewCommentListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewCommentListComponent]
    });
    fixture = TestBed.createComponent(ViewCommentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
