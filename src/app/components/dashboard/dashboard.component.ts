import { Component, OnInit } from "@angular/core";
import { QuestionsService } from "../../services/questions.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = ["response", "points"];
  dataSource;
  question: Promise<string>;

  constructor(private questionsService: QuestionsService) {}

  ngOnInit() {
    this.question = this.questionsService.getQuestion();
    this.questionsService
      .getResponses()
      .then(responses => (this.dataSource = responses));
  }
}
