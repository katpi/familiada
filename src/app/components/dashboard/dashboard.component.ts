import { Component } from "@angular/core";
import { FamiliadaService } from "../../services/familiada.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent {
  displayedColumns: string[] = ["response", "points"];
  dataSource;
  question: string;

  constructor(private familiadaService: FamiliadaService) {
    this.familiadaService.initGame();
    this.familiadaService.question$.subscribe(
      question => (this.question = question)
    );
  }
}
