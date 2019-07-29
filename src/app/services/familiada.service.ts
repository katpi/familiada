import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Team, GameStateEnum, GamePhase, FamiliadaEvent } from '../enums/enums';
import {
  FamiliadaResponse,
  RoundState,
  Scores,
  GameState,
  FamiliadaSettings,
  FamiliadaQuestion
} from '../models/interfaces';
import { Familiada } from './familiada';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class FamiliadaService implements Familiada {
  private roundState: RoundState;
  private scores: Scores;
  private gameState: GameState;
  private settings: FamiliadaSettings;
  private questions: FamiliadaQuestion[];

  getRoundState(): Observable<RoundState> {
    return this.db.roundState$;
  }
  getScores(): Observable<Scores> {
    return this.db.scores$;
  }
  getGameState(): Observable<GameState> {
    return this.db.gameState$;
  }
  getSettings(): Observable<FamiliadaSettings> {
    return this.db.settings$;
  }
  getEvent(): Observable<FamiliadaEvent> {
    return this.db.event$;
  }

  constructor(private db: DatabaseService) {
    this.db.settings$.subscribe(settings => (this.settings = settings));
    this.db.gameState$.subscribe(gameState => this.gameState = gameState);
    this.db.scores$.subscribe(scores => this.scores = scores);
    this.db.roundState$.subscribe(roundState => this.roundState = roundState);
    this.db.questions$.subscribe(questions => this.questions = questions);
  }

  requestPlayIntro() {
    this.db.requestPlayIntro();
  }
  requestJoke() {
    this.db.requestJoke();
  }
  finishJoke() {
    this.db.finishJoke();
  }
  requestApplause() {
    this.db.requestApplause();
  }
  clearEvent() {
    this.db.clearEvent();
  }

  init() {
    this.gameState = { state: GameStateEnum.START };
    this.db.updateGameState(this.gameState);
    this.logStatus('init');
  }

  startGame() {
    this.roundState = {
      responsesCount: -1,
      questionId: -1,
      answers: [],
      phase: null,
      team: null,
      sum: 0,
      wrong: 0,
      initialPhaseState: null,
    };
    this.db.updateRoundState(this.roundState);
    this.scores = { team1: 0, team2: 0 };
    this.db.updateScores(this.scores);
    this.nextRound();
    this.logStatus('startGame');
  }

  nextRound() {
    this.roundState.questionId = this.roundState.questionId + 1;
    this.roundState = {
      questionId: this.roundState.questionId,
      responsesCount: this.questions[this.roundState.questionId].answers.length,
      answers: [],
      phase: null,
      team: null,
      sum: 0,
      wrong: 0,
      initialPhaseState: null,
    };
    this.db.updateRoundState(this.roundState);
    this.gameState = { state: GameStateEnum.NEW_ROUND };
    this.db.updateGameState(this.gameState);
    this.logStatus('nextRound');
  }

  setFirstClaiming(team: Team) {
    this.firstPhase(team);
    this.setTeam(team);
    this.gameState = { state: GameStateEnum.ROUND };
    this.db.updateGameState(this.gameState);
    this.logStatus('setFirstClaiming');
  }

  claimWrong() {
    this.roundState.wrong = this.roundState.wrong + 1;
    this.db.updateRoundState(this.roundState);
    switch (this.roundState.phase) {
      case GamePhase[GamePhase.FIRST]:
        if (this.roundState.team === this.roundState.initialPhaseState.firstClaiming) {
          this.switchTeam();
        } else {
          this.switchTeam();
          if (this.roundState.initialPhaseState.firstClaimingPoints > 0) {
            this.secondPhase();
          }
        }
        break;
      case GamePhase[GamePhase.SECOND]:
        if (this.roundState.wrong > 2) {
          this.switchTeam();
          this.thirdPhase();
        }
        break;
      case GamePhase[GamePhase.THIRD]:
        this.switchTeam();
        this.endRound();
        break;
    }
    this.logStatus('claimWrong');
  }

  claimAnswer(answer: FamiliadaResponse) {
    if (!this.roundState.answers.includes(answer.id)) {
      this.roundState.answers = [...this.roundState.answers, answer.id];
      this.roundState.sum = this.roundState.sum + answer.points;
    }
    this.db.updateRoundState(this.roundState);
    switch (this.roundState.phase) {
      case GamePhase[GamePhase.FIRST]:
        if (this.roundState.team === this.roundState.initialPhaseState.firstClaiming) {
          this.roundState.initialPhaseState.firstClaimingPoints = answer.points;
          this.db.updateRoundState(this.roundState);
          if (answer.id === 0) {
            this.secondPhase();
          } else { this.switchTeam(); }
        } else {
          this.roundState.initialPhaseState.secondClaimingPoints = answer.points;
          this.db.updateRoundState(this.roundState);
          if (
            this.roundState.initialPhaseState.firstClaimingPoints >=
            this.roundState.initialPhaseState.secondClaimingPoints
          ) {
            this.switchTeam();
          }
          this.secondPhase();
          this.checkEndRound();
        }
        break;
      case GamePhase[GamePhase.SECOND]:
      case GamePhase[GamePhase.THIRD]:
        this.checkEndRound();
        break;
    }
    this.logStatus('claimAnswer');
  }

  switchTeam() {
    const team = this.roundState.team === Team.TEAM1 ? Team.TEAM2 : Team.TEAM1;
    this.roundState.wrong = 0;
    this.setTeam(team);
    this.logStatus('switchTeam');
  }

  private checkEndRound() {
    if (this.roundState.answers.length === this.roundState.responsesCount) {
      this.endRound();
    }
  }

  private endRound() {
    switch (this.roundState.team) {
      case Team.TEAM1:
        this.scores.team1 = this.scores.team1 + this.roundState.sum;
        break;
      case Team.TEAM2:
        this.scores.team2 = this.scores.team2 + this.roundState.sum;
        break;
    }
    this.db.updateScores(this.scores);
    if (this.roundState.questionId + 1 === this.settings.questionsCount) {
      this.endGame();
    } else {
      this.gameState.state = GameStateEnum.ROUND_ENDED;
      this.db.updateGameState(this.gameState);
    }
  }

private endGame() {
  this.roundState = {
    responsesCount: -1,
    questionId: -1,
    answers: [],
    phase: null,
    team: null,
    sum: 0,
    wrong: 0,
    initialPhaseState: null,
  };
  this.db.updateRoundState(this.roundState);
  this.gameState.state = GameStateEnum.END;
  this.db.updateGameState(this.gameState);
}

  private setTeam(team: string) {
    this.roundState.team = team;
    this.db.updateRoundState(this.roundState);
  }

  private firstPhase(team: Team) {
    this.roundState.phase = GamePhase[GamePhase.FIRST];
    this.roundState.initialPhaseState = {
      firstClaiming: team,
      firstClaimingPoints: 0,
      secondClaimingPoints: 0
    };
    this.roundState.wrong = 0;
    this.db.updateRoundState(this.roundState);
  }

  private secondPhase() {
    this.roundState.phase = GamePhase[GamePhase.SECOND];
    this.roundState.wrong = 0;
    this.roundState.initialPhaseState = null;
    this.db.updateRoundState(this.roundState);
  }

  private thirdPhase() {
    this.roundState.phase = GamePhase[GamePhase.THIRD];
    this.roundState.wrong = 0;
    this.db.updateRoundState(this.roundState);
  }

  private logStatus(method: string) {
    console.log({
      method,
      roundState: this.roundState,
      scores: this.scores,
      gameState: this.gameState,
      settings: this.settings,
      questions: this.questions
    });
  }
}
