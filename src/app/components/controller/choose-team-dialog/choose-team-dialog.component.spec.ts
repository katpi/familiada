import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseTeamDialogComponent } from './choose-team-dialog.component';

describe('ChooseTeamDialogComponent', () => {
  let component: ChooseTeamDialogComponent;
  let fixture: ComponentFixture<ChooseTeamDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseTeamDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseTeamDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
