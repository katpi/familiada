import { Component } from "@angular/core";
import { FamiliadaService } from "../../services/familiada.service";
import { Team } from "src/app/enums/enums";
import { FamiliadaResponse } from "../../models/interfaces";

@Component({
  selector: "app-controller",
  templateUrl: "./controller.component.html",
  styleUrls: ["./controller.component.scss"]
})
export class ControllerComponent {
  displayedColumns: string[] = ["response", "good"];
  dataSource;
  question: string;
  team: string;

  constructor(private familiadaService: FamiliadaService) {
    this.familiadaService.initGame();
    this.familiadaService.question$.subscribe(question => {
      this.question = question.question;
      this.dataSource = question.answers;
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

  next() {
    this.familiadaService.endRound();
  }

  changeTeam() {
    this.familiadaService.changeTeam();
  }

  setTeam(team: string) {
    this.familiadaService.setTeam(team);
  }

  claimAnswer(element: FamiliadaResponse) {
    this.familiadaService.claimAnswer(element);
  }

  claimWrong() {
    this.familiadaService.claimWrong();
  }
}
