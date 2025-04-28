import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewImageUrlComponent } from './view-image-url.component';

describe('ViewImageUrlComponent', () => {
  let component: ViewImageUrlComponent;
  let fixture: ComponentFixture<ViewImageUrlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewImageUrlComponent]
    });
    fixture = TestBed.createComponent(ViewImageUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
