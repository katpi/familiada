import { Component, OnInit } from "@angular/core";
import { QuestionsService } from "../../services/questions.service";
import { FamiliadaQuestion } from "../../models/interfaces";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"]
})
export class SettingsComponent implements OnInit {
  displayedColumns: string[] = ["response", "team1", "team2"];
  dataSource;
  question: Promise<string>;

  constructor(private questionsService: QuestionsService) {}

  ngOnInit() {
    this.question = this.questionsService.getQuestion();
    this.questionsService
      .getAnswers()
      .then(responses => (this.dataSource = responses));
  }

  next() {
    this.questionsService.next();
    this.question = this.questionsService.getQuestion();
  }
}
