import { Injectable } from "@angular/core";
import { Subject, ReplaySubject, Observable } from "rxjs";
import {
  RoundState,
  Scores,
  GameState,
  FamiliadaSettings
} from "../models/interfaces";
import { AngularFirestore } from "@angular/fire/firestore";
import { isNullOrUndefined } from "util";

@Injectable({
  providedIn: "root"
})
export class DatabaseService {
  private roundSource = new Subject<RoundState>();
  private scoresSource = new ReplaySubject<Scores>();
  private gameStateSource = new Subject<GameState>();
  private settingsSource = new Subject<FamiliadaSettings>();

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
    this.db
      .doc("familiada/settings")
      .valueChanges()
      .subscribe((settings: FamiliadaSettings) => {
        if (isNullOrUndefined(settings)) return;
        this.settingsSource.next(settings);
      });
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
  getSettings(): Observable<FamiliadaSettings> {
    return this.settingsSource.asObservable();
  }

  updateGameState(state: GameState) {
    console.log(state);
    this.db.doc("familiada/state").set(state);
  }
  updateScores(scores: Scores) {
    this.db.doc("familiada/scores").set(scores);
  }
  updateRoundState(roundState: RoundState) {
    this.db.doc("familiada/round").set(roundState);
  }
}
