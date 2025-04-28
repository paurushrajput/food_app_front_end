import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNotificationTemplateComponent } from './add-notification-template.component';

describe('AddNotificationTemplateComponent', () => {
  let component: AddNotificationTemplateComponent;
  let fixture: ComponentFixture<AddNotificationTemplateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNotificationTemplateComponent]
    });
    fixture = TestBed.createComponent(AddNotificationTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
