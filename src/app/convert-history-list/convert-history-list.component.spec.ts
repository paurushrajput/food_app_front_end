import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertHistoryListComponent } from './convert-history-list.component';

describe('ConvertHistoryListComponent', () => {
  let component: ConvertHistoryListComponent;
  let fixture: ComponentFixture<ConvertHistoryListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConvertHistoryListComponent]
    });
    fixture = TestBed.createComponent(ConvertHistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
