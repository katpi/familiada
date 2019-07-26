import { Component, OnInit, Input } from "@angular/core";
import { Team } from "../../enums/enums";

@Component({
  selector: "app-scoreboard",
  templateUrl: "./scoreboard.component.html",
  styleUrls: ["./scoreboard.component.scss"]
})
export class ScoreboardComponent implements OnInit {
  @Input() team: Team;

  getTeamName() {
    switch (this.team) {
      case Team.TEAM1: return "A";
      case Team.TEAM2: return "B";
    }
  }

  constructor() {}

  ngOnInit() {}
}
