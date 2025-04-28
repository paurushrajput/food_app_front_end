import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotiFilterComponent } from './noti-filter.component';

describe('NotiFilterComponent', () => {
  let component: NotiFilterComponent;
  let fixture: ComponentFixture<NotiFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotiFilterComponent]
    });
    fixture = TestBed.createComponent(NotiFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
