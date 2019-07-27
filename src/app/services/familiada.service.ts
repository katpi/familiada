import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { Team, GameStateEnum } from "../enums/enums";
import {
  FamiliadaResponse,
  RoundState,
  Scores,
  GameState
} from "../models/interfaces";
import { AngularFirestore } from "@angular/fire/firestore";
import { isNullOrUndefined } from "util";
import { Familiada } from "./familiada";

@Injectable({
  providedIn: "root"
})
export class FamiliadaService implements Familiada {
  private roundState: RoundState;
  private scores: Scores;
  private gameState: GameState;

  private roundSource = new Subject<RoundState>();
  private scoresSource = new Subject<Scores>();
  private gameStateSource = new Subject<GameState>();

  constructor(private db: AngularFirestore) {
    this.db
      .doc("familiada/round")
      .valueChanges()
      .subscribe((roundState: RoundState) => {
        if (isNullOrUndefined(roundState)) return;
        this.roundSource.next(roundState);
      });
    this.db
      .doc("familiada/scores")
      .valueChanges()
      .subscribe((scoresState: Scores) => {
        if (isNullOrUndefined(scoresState)) return;
        this.scoresSource.next(scoresState);
      });
    this.db
      .doc("familiada/state")
      .valueChanges()
      .subscribe((gameState: GameState) => {
        if (isNullOrUndefined(gameState)) return;
        this.gameStateSource.next(gameState);
      });

    this.gameState = { state: GameStateEnum.START };
    this.updateGameState(this.gameState);
  }

  getRoundState(): Observable<RoundState> {
    return this.roundSource.asObservable();
  }
  getScores(): Observable<Scores> {
    return this.scoresSource.asObservable();
  }
  getGameState(): Observable<GameState> {
    return this.gameStateSource.asObservable();
  }

  initGame() {
    this.roundState = {
      questionId: -1,
      answers: [],
      team: null,
      sum: 0,
      wrong: 0
    };
    this.updateRoundState(this.roundState);
    this.scores = { team1: 0, team2: 0 };
    this.updateScores(this.scores);
  }

  setTeam(team: Team) {
    this.roundState.team = team;
    this.updateRoundState(this.roundState);
  }

  claimAnswer(answer: FamiliadaResponse) {
    if (!this.roundState.answers.includes(answer.id)) {
      this.roundState.answers = [...this.roundState.answers, answer.id];
      this.roundState.sum = this.roundState.sum + answer.points;
    }
    this.updateRoundState(this.roundState);
  }

  claimWrong() {
    this.roundState.wrong = this.roundState.wrong + 1;
    this.updateRoundState(this.roundState);
  }

  changeTeam(): any {
    this.roundState.team =
      this.roundState.team === Team.TEAM1 ? Team.TEAM2 : Team.TEAM1;
    this.updateRoundState(this.roundState);
  }

  nextRound(): any {
    switch (this.roundState.team) {
      case Team.TEAM1:
        this.scores.team1 = this.scores.team1 + this.roundState.sum;
        break;
      case Team.TEAM2:
        this.scores.team2 = this.scores.team2 + this.roundState.sum;
        break;
    }
    this.updateScores(this.scores);
    this.gameState.state = GameStateEnum.ROUND_ENDED;
    this.updateGameState(this.gameState);
    this.roundState = {
      questionId: this.roundState.questionId + 1,
      answers: [],
      team: null,
      sum: 0,
      wrong: 0
    };
    this.updateRoundState(this.roundState);
    this.gameState.state = GameStateEnum.NEW_ROUND;
    this.updateGameState(this.gameState);
  }

  private updateGameState(state: GameState) {
    this.db.doc("familiada/state").set(state);
  }

  private updateScores(scores: Scores) {
    this.db.doc("familiada/scores").set(scores);
  }

  private updateRoundState(round: RoundState) {
    this.db.doc("familiada/round").set(this.roundState);
  }
}
