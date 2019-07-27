import { Component } from "@angular/core";
import { FamiliadaService } from "../../services/familiada.service";
import { Team } from "../../enums/enums";
import { FamiliadaResponse } from "../../models/interfaces";
import { isNullOrUndefined } from "util";
import { of, Observable } from "rxjs";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent {
  displayedColumns: string[] = ["response", "points"];
  dataSource: Observable<FamiliadaResponse[]>;
  question: string;
  team: string;
  answers: FamiliadaResponse[] = [];

  constructor(private familiadaService: FamiliadaService) {
    this.familiadaService.question$.subscribe(question => {
      this.question = question.question;
      this.dataSource = of(new Array(question.answers.length));
      this.answers = question.answers;
    });
    this.familiadaService.answers$.subscribe((answerIds: number[]) => {
      const responses = new Array(this.answers.length);
      answerIds.forEach((id: number) => (responses[id] = this.answers[id]));
      this.dataSource = of(responses);
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

  getResponse(element: FamiliadaResponse) {
    return isNullOrUndefined(element) ? null : element.response;
  }

  getPoints(element: FamiliadaResponse) {
    return isNullOrUndefined(element) ? null : element.points;
  }
}
