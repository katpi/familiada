import { Component, OnInit, Input } from '@angular/core';
import { Team } from '../../enums/enums';
import { FamiliadaService } from '../../services/familiada.service';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss']
})
export class ScoreboardComponent implements OnInit {
  @Input() team: Team;
  score = 0;

  getTeamName() {
    switch (this.team) {
      case Team.TEAM1:
        return 'A';
      case Team.TEAM2:
        return 'B';
    }
  }

  constructor(private familiadaService: FamiliadaService) {}

  ngOnInit() {
    this.familiadaService.getScores().subscribe(scores => {
      switch (this.team) {
        case Team.TEAM1:
          this.score = scores.team1;
          break;
        case Team.TEAM2:
          this.score = scores.team2;
          break;
      }
    });
  }
}
