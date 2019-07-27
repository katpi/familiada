import { Component } from "@angular/core";
import { FamiliadaService } from "../../services/familiada.service";
import { Team } from "../../enums/enums";
import { FamiliadaResponse, RoundState } from "../../models/interfaces";
import { isNullOrUndefined } from "util";
import { of, Observable } from "rxjs";
import { QuestionsService } from "../../services/questions.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent {
  displayedColumns: string[] = ["response", "points"];
  dataSource: Observable<FamiliadaResponse[]>;
  questionId: number;
  question: string;
  team: string;
  sum = 10;
  answers: FamiliadaResponse[] = [];

  constructor(
    private familiadaService: FamiliadaService,
    private questionsService: QuestionsService
  ) {
    this.questionId = -1;
    this.familiadaService.getRoundState().subscribe(roundState => {
      switch (roundState.team) {
        case Team.TEAM1:
          this.team = "A";
          return;
        case Team.TEAM2:
          this.team = "B";
          return;
      }
      this.refreshResponses(roundState);
      if (this.questionId !== roundState.questionId) {
        this.questionsService
          .getQuestion(roundState.questionId)
          .then(question => {
            this.question = question.question;
            this.answers = question.answers;
            this.refreshResponses(roundState);
          });
      }
    });
  }

  private refreshResponses(roundState: RoundState) {
    const responses = new Array(this.answers.length);
    roundState.answers.forEach(
      (id: number) => (responses[id] = this.answers[id])
    );
    this.dataSource = of(responses);
  }

  getResponse(element: FamiliadaResponse) {
    return isNullOrUndefined(element) ? null : element.response;
  }

  getPoints(element: FamiliadaResponse) {
    return isNullOrUndefined(element) ? null : element.points;
  }
}
