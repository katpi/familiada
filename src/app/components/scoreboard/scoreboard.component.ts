import { Component, OnInit, Input } from '@angular/core';
import { Team } from '../../enums/enums';
import { FamiliadaService } from '../../services/familiada.service';
import { Observable, of } from 'rxjs';
import { FamiliadaSettings } from 'src/app/models/interfaces';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss']
})
export class ScoreboardComponent implements OnInit {
  @Input() team: Team;
  teamName: Observable<string>;
  score = 0;

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
    this.familiadaService.getSettings().subscribe((settings: FamiliadaSettings) => {
      switch (this.team) {
        case Team.TEAM1:
          this.teamName = of(settings.team1Name);
          break;
        case Team.TEAM2:
          this.teamName = of(settings.team2Name);
          break;
      }
    });
  }
}
