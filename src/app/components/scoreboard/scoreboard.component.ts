import { Component, Input, OnInit } from '@angular/core';
import { FamiliadaSettings, RoundState } from 'src/app/models/interfaces';

import { Team } from '../../enums/enums';
import { FamiliadaService } from '../../services/familiada.service';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss'],
})
export class ScoreboardComponent implements OnInit {
  @Input() team: Team;
  @Input() isEndGame: boolean;
  teamName: string;
  score = 0;
  wrong = 0;

  constructor(private familiadaService: FamiliadaService) {}

  ngOnInit() {
    this.familiadaService.getScores().subscribe((scores) => {
      switch (this.team) {
        case Team.TEAM1:
          this.score = scores.team1;
          break;
        case Team.TEAM2:
          this.score = scores.team2;
          break;
      }
    });
    this.familiadaService.getSettings().subscribe((settings: FamiliadaSettings) => {
      switch (this.team) {
        case Team.TEAM1:
          this.teamName = settings.team1Name;
          break;
        case Team.TEAM2:
          this.teamName = settings.team2Name;
          break;
      }
    });
    this.familiadaService.getRoundState().subscribe((roundState: RoundState) => {
      switch (this.team) {
        case Team.TEAM1:
          this.wrong = roundState.team1Wrong;
          break;
        case Team.TEAM2:
          this.wrong = roundState.team2Wrong;
          break;
      }
    });
  }
}
