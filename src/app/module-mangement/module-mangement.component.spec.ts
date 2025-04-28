import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleMangementComponent } from './module-mangement.component';

describe('ModuleMangementComponent', () => {
  let component: ModuleMangementComponent;
  let fixture: ComponentFixture<ModuleMangementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModuleMangementComponent]
    });
    fixture = TestBed.createComponent(ModuleMangementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
