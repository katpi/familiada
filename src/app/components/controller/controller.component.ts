import { Component } from "@angular/core";
import { FamiliadaService } from "../../services/familiada.service";
import { Team } from "src/app/enums/enums";
import { FamiliadaResponse } from "../../models/interfaces";
import { QuestionsService } from "../../services/questions.service";

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

  constructor(
    private familiadaService: FamiliadaService,
    private questionsService: QuestionsService,
  ) {
    this.familiadaService.initGame();
    this.familiadaService.getRoundState().subscribe(roundState => {
      switch (roundState.team) {
        case Team.TEAM1:
          this.team = "A";
          return;
        case Team.TEAM2:
          this.team = "B";
          return;
      }
      this.questionsService
        .getQuestion(roundState.questionId)
        .then(question => {
          this.question = question.question;
          this.dataSource = question.answers;
        });
    });
  }

  next() {
    this.familiadaService.nextRound();
  }

  changeTeam() {
    this.familiadaService.changeTeam();
  }

  setTeam(team: string) {
    this.familiadaService.setTeam(Team[team]);
  }

  claimAnswer(element: FamiliadaResponse) {
    this.familiadaService.claimAnswer(element);
  }

  claimWrong() {
    this.familiadaService.claimWrong();
  }
}
