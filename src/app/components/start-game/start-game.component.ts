import { Component, Input } from "@angular/core";
import { FamiliadaService } from "../../services/familiada.service";

@Component({
  selector: "app-start-game",
  templateUrl: "./start-game.component.html",
  styleUrls: ["./start-game.component.scss"]
})
export class StartGameComponent {
  @Input() isDashboard: boolean;
  constructor(private familiadaService: FamiliadaService) {}

  next() {
    this.familiadaService.nextRound();
  }
}
