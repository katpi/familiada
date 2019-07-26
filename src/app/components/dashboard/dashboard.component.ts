import { Component } from "@angular/core";
import { FamiliadaService } from "../../services/familiada.service";
import { Team } from '../../enums/enums';

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent {
  displayedColumns: string[] = ["response", "points"];
  dataSource;
  question: string;
  team: string;

  constructor(private familiadaService: FamiliadaService) {
    this.familiadaService.question$.subscribe(question => {
      this.question = question.question;
      this.dataSource = new Array(question.answers.length)
    });
    this.familiadaService.currentTeam$.subscribe((team: Team) => {
      switch (team) {
        case Team.TEAM1:
          this.team = "A";
          return;
        case Team.TEAM2:
          this.team = "B";
          return;
      }
    });
  }
}
