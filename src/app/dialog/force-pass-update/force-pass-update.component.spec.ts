import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForcePassUpdateComponent } from './force-pass-update.component';

describe('ForcePassUpdateComponent', () => {
  let component: ForcePassUpdateComponent;
  let fixture: ComponentFixture<ForcePassUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForcePassUpdateComponent]
    });
    fixture = TestBed.createComponent(ForcePassUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
