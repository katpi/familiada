import { Component } from "@angular/core";
import { FamiliadaService } from "../../services/familiada.service";
import { Team, GameStateEnum } from "src/app/enums/enums";
import { FamiliadaResponse } from "../../models/interfaces";
import { QuestionsService } from "../../services/questions.service";
import { MatDialog } from "@angular/material";
import { ChooseTeamDialog } from "./choose-team-dialog/choose-team-dialog.component";
import { RoundEndedDialog } from "./round-ended-dialog/round-ended-dialog.component";

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
  answers: number[] = [];
  state: string;

  constructor(
    private familiadaService: FamiliadaService,
    private questionsService: QuestionsService,
    private dialog: MatDialog
  ) {
    this.familiadaService.getRoundState().subscribe(roundState => {
      switch (roundState.team) {
        case Team.TEAM1:
          this.team = "A";
          break;
        case Team.TEAM2:
          this.team = "B";
          break;
      }
      if (roundState.questionId > -1) {
        this.questionsService
          .getQuestion(roundState.questionId)
          .then(question => {
            this.question = question.question;
            this.dataSource = question.answers;
          });
      }
      this.answers = roundState.answers;
    });
    this.familiadaService.getGameState().subscribe(gameState => {
      this.state = gameState.state;
      switch (this.state) {
        case GameStateEnum.NEW_ROUND:
          this.dialog.open(ChooseTeamDialog, { width: "250px" });
          break;
        case GameStateEnum.ROUND_ENDED:
          this.dialog.open(RoundEndedDialog, { width: "250px" });
          break;
      }
    });
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

  isDone(row: FamiliadaResponse) {
    return this.answers.includes(row.id);
  }
}
