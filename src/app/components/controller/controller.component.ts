import { Component } from "@angular/core";
import { FamiliadaService } from "../../services/familiada.service";

@Component({
  selector: "app-controller",
  templateUrl: "./controller.component.html",
  styleUrls: ["./controller.component.scss"]
})
export class ControllerComponent {
  displayedColumns: string[] = ["response", "team1", "team2"];
  dataSource;
  question: string;

  constructor(
    private familiadaService: FamiliadaService
    ) {
    this.familiadaService.initGame();
    this.familiadaService.question$.subscribe(
      question => (this.question = question)
    );
  }

  next() {
    this.familiadaService.endRound();
  }
}
