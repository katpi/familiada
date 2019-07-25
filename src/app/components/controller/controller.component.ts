import { Component } from "@angular/core";
import { FamiliadaService } from "../../services/familiada.service";
import { Team } from "src/app/enums/enums";

@Component({
  selector: "app-controller",
  templateUrl: "./controller.component.html",
  styleUrls: ["./controller.component.scss"]
})
export class ControllerComponent {
  displayedColumns: string[] = ["response", "team1", "team2"];
  dataSource;
  question: string;
  team: string;

  constructor(private familiadaService: FamiliadaService) {
    this.familiadaService.initGame();
    this.familiadaService.question$.subscribe(
      question => (this.question = question)
    );
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
    this.familiadaService.claimResponse();
  }
}
