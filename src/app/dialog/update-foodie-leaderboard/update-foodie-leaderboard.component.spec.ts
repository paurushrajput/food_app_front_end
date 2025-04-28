import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFoodieLeaderboardComponent } from './update-foodie-leaderboard.component';

describe('UpdateFoodieLeaderboardComponent', () => {
  let component: UpdateFoodieLeaderboardComponent;
  let fixture: ComponentFixture<UpdateFoodieLeaderboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateFoodieLeaderboardComponent]
    });
    fixture = TestBed.createComponent(UpdateFoodieLeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
