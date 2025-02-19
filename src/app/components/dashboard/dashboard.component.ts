import { Component } from '@angular/core';
import { of, Observable } from 'rxjs';
import { isNullOrUndefined } from 'util';

import { FamiliadaEvent, GameState, Team } from '../../enums/enums';
import {
  FamiliadaResponse,
  FamiliadaRoundState,
  FamiliadaSettings,
} from '../../models/interfaces';
import { FamiliadaService } from '../../services/familiada.service';
import { QuestionsService } from '../../services/questions.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  displayedColumns: string[] = ['response', 'points'];
  dataSource: Observable<FamiliadaResponse[]>;
  questionId: number;
  roundNumber: number;
  question: string;
  otherAnswers: string[];
  team: string;
  sum: number;
  answers: FamiliadaResponse[];
  state: string = GameState.START;
  settings: FamiliadaSettings = {
    questionsCount: -1,
    team1Name: 'A',
    team2Name: 'B',
  };
  joke = false;
  applause = false;

  constructor(
    private familiadaService: FamiliadaService,
    private questionsService: QuestionsService,
  ) {
    this.questionId = -1;
    this.roundNumber = -1;
    this.sum = 0;
    this.answers = [];
    this.otherAnswers = [];
    this.familiadaService.getRoundState().subscribe((roundState) => {
      this.roundNumber = roundState.roundNumber;
      switch (roundState.team) {
        case Team.TEAM1:
          this.team = this.settings.team1Name;
          break;
        case Team.TEAM2:
          this.team = this.settings.team2Name;
          break;
        default:
          this.team = null;
          break;
      }
      this.refreshResponses(roundState);
      if (this.questionId !== roundState.questionId) {
        this.questionsService
          .getQuestion(roundState.questionId)
          .then((question) => {
            this.otherAnswers = question.otherAnswers;
            if (isNullOrUndefined(question)) {
              return;
            }
            this.question = question.question;
            this.answers = question.answers;
            this.refreshResponses(roundState);
          });
      }
      this.questionId = roundState.questionId;
      this.sum = roundState.sum;
    });
    this.familiadaService.getGameState().subscribe((gameState) => {
      this.state = gameState.state;
      if (this.state === GameState.ROUND_ENDED) {
        this.dataSource = of(this.answers);
      }
    });
    this.familiadaService
      .getSettings()
      .subscribe((settings: FamiliadaSettings) => {
        this.settings = settings;
      });
    this.familiadaService.getEvent().subscribe((event: FamiliadaEvent) => {
      const audio = new Audio();
      switch (event) {
        case FamiliadaEvent.JOKE:
          this.joke = true;
          break;
        case FamiliadaEvent.END_JOKE:
          this.joke = false;
          break;
        case FamiliadaEvent.APPLAUSE:
          this.applause = true;
          this.familiadaService.clearEvent();
          setTimeout(() => (this.applause = false), 3000);
          break;
        case FamiliadaEvent.GOOD_ANSWER:
          audio.src = '../../assets/audio/good_answer.ogg';
          audio.load();
          audio.play();
          this.familiadaService.clearEvent();
          break;
        case FamiliadaEvent.WRONG_ANSWER:
          audio.src = '../../assets/audio/wrong_answer.ogg';
          audio.load();
          audio.play();
          this.familiadaService.clearEvent();
          break;
        case FamiliadaEvent.NEW_ROUND:
          audio.src = '../../assets/audio/new_round.ogg';
          audio.load();
          audio.play();
          this.familiadaService.clearEvent();
          break;
      }
    });
  }

  private refreshResponses(roundState: FamiliadaRoundState) {
    const responses = Array(this.answers.length);
    roundState.answers.forEach(
      (id: number) => (responses[id] = this.answers[id]),
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
