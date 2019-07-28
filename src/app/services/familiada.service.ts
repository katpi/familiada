import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Team, GameStateEnum, GamePhase } from '../enums/enums';
import {
  FamiliadaResponse,
  RoundState,
  Scores,
  GameState,
  FamiliadaSettings,
  InitialPhaseState,
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
  private initialPhaseState: InitialPhaseState;
  private phase: GamePhase;

  getRoundState(): Observable<RoundState> {
    return this.db.roundState$;
  }
  getScores(): Observable<Scores> {
    return this.db.scores$;
  }
  getGameState(): Observable<GameState> {
    return this.db.gameState$;
  }

  constructor(private db: DatabaseService) {
    this.db.settings$.subscribe(settings => (this.settings = settings));
    this.db.gameState$.subscribe(gameState => this.gameState = gameState);
    this.db.scores$.subscribe(scores => this.scores = scores);
    this.db.roundState$.subscribe(roundState => this.roundState = roundState);
    this.db.questions$.subscribe(questionsState => this.questions = questionsState.questions);
  }

  init() {
    this.gameState = { state: GameStateEnum.START };
    this.db.updateGameState(this.gameState);
  }

  startGame() {
    this.roundState = {
      responsesCount: -1,
      questionId: -1,
      answers: [],
      team: null,
      sum: 0,
      wrong: 0
    };
    this.db.updateRoundState(this.roundState);
    this.scores = { team1: 0, team2: 0 };
    this.db.updateScores(this.scores);
    this.nextRound();
  }

  nextRound() {
    this.roundState.questionId = this.roundState.questionId + 1;
    this.roundState = {
      questionId: this.roundState.questionId,
      responsesCount: this.questions[this.roundState.questionId].answers.length,
      answers: [],
      team: null,
      sum: 0,
      wrong: 0
    };
    this.db.updateRoundState(this.roundState);
    this.gameState = { state: GameStateEnum.NEW_ROUND };
    this.db.updateGameState(this.gameState);
  }

  setFirstClaiming(team: Team) {
    this.phase = GamePhase.FIRST;
    this.initialPhaseState = {
      firstClaiming: team,
      firstClaimingPoints: 0,
      secondClaimingPoints: 0
    };
    this.setTeam(team);
  }

  claimWrong() {
    this.roundState.wrong = this.roundState.wrong + 1;
    this.db.updateRoundState(this.roundState);
    switch (this.phase) {
      case GamePhase.FIRST:
        if (this.roundState.team === this.initialPhaseState.firstClaiming) {
          this.switchTeam();
        } else {
          this.switchTeam();
          if (this.initialPhaseState.firstClaimingPoints > 0) {
            this.secondPhase();
          }
        }
        break;
      case GamePhase.SECOND:
        if (this.roundState.wrong > 2) {
          this.switchTeam();
          this.thirdPhase();
        }
        break;
      case GamePhase.THIRD:
        this.switchTeam();
        this.endRound();
        break;
    }
  }

  claimAnswer(answer: FamiliadaResponse) {
    if (!this.roundState.answers.includes(answer.id)) {
      this.roundState.answers = [...this.roundState.answers, answer.id];
      this.roundState.sum = this.roundState.sum + answer.points;
    }
    this.db.updateRoundState(this.roundState);
    switch (this.phase) {
      case GamePhase.FIRST:
        if (this.roundState.team === this.initialPhaseState.firstClaiming) {
          this.initialPhaseState.firstClaimingPoints = answer.points;
          if (answer.id === 0) {
            this.secondPhase();
          } else { this.switchTeam(); }
        } else {
          this.initialPhaseState.secondClaimingPoints = answer.points;
          if (
            this.initialPhaseState.firstClaimingPoints >=
            this.initialPhaseState.secondClaimingPoints
          ) {
            this.switchTeam();
          }
          this.secondPhase();
          this.checkEndRound();
        }
        break;
      case GamePhase.SECOND:
      case GamePhase.THIRD:
        this.checkEndRound();
        break;
    }
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
      this.gameState.state = GameStateEnum.END;
    } else {
      this.gameState.state = GameStateEnum.ROUND_ENDED;
    }
    this.db.updateGameState(this.gameState);
  }

  private switchTeam() {
    const team = this.roundState.team === Team.TEAM1 ? Team.TEAM2 : Team.TEAM1;
    this.roundState.wrong = 0;
    this.setTeam(team);
  }

  private setTeam(team: string) {
    this.roundState.team = team;
    this.db.updateRoundState(this.roundState);
  }

  private secondPhase() {
    this.phase = GamePhase.SECOND;
    this.roundState.wrong = 0;
  }

  private thirdPhase() {
    this.phase = GamePhase.THIRD;
    this.roundState.wrong = 0;
  }
}
