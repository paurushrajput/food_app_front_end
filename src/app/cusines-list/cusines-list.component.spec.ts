import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CusinesListComponent } from './cusines-list.component';

describe('CusinesListComponent', () => {
  let component: CusinesListComponent;
  let fixture: ComponentFixture<CusinesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CusinesListComponent]
    });
    fixture = TestBed.createComponent(CusinesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
