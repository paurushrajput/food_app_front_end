import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentRuleManagementComponent } from './tournament-rule-management.component';

describe('TournamentRuleManagementComponent', () => {
  let component: TournamentRuleManagementComponent;
  let fixture: ComponentFixture<TournamentRuleManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TournamentRuleManagementComponent]
    });
    fixture = TestBed.createComponent(TournamentRuleManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
