import { Component, Input } from "@angular/core";
import { FamiliadaService } from "../../services/familiada.service";
import { FamiliadaEvent } from '../../enums/enums';

@Component({
  selector: "app-start-game",
  templateUrl: "./start-game.component.html",
  styleUrls: ["./start-game.component.scss"]
})
export class StartGameComponent {
  @Input() isDashboard: boolean;
  private boom = false;

  constructor(private familiadaService: FamiliadaService) {
    this.familiadaService.getEvent().subscribe((event: FamiliadaEvent) => {
      if (this.isDashboard && event === FamiliadaEvent.PLAY_INTRO) {
        this.play();
      }
    });
  }

  next() {
    this.familiadaService.startGame();
  }

  requestPlayIntro() {
    this.familiadaService.requestPlayIntro();
  }

  play() {
    const audio = new Audio();
    audio.src = "../../assets/audio/intro.ogg";
    audio.load();
    audio.play();
    setTimeout(() => (this.boom = true), 19000);
    this.familiadaService.clearEvent();
  }
}
