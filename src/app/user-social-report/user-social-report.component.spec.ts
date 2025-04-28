import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSocialReportComponent } from './user-social-report.component';

describe('UserSocialReportComponent', () => {
  let component: UserSocialReportComponent;
  let fixture: ComponentFixture<UserSocialReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserSocialReportComponent]
    });
    fixture = TestBed.createComponent(UserSocialReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
