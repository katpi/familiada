import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";
import {
  RoundState,
  Scores,
  GameState,
  FamiliadaSettings,
  FamiliadaQuestion
} from "../models/interfaces";
import { AngularFirestore } from "@angular/fire/firestore";
import { isNullOrUndefined } from "util";

@Injectable({
  providedIn: "root"
})
export class DatabaseService {
  private roundSource = new ReplaySubject<RoundState>();
  private scoresSource = new ReplaySubject<Scores>();
  private gameStateSource = new ReplaySubject<GameState>();
  private settingsSource = new ReplaySubject<FamiliadaSettings>();
  private questionsSource = new ReplaySubject<FamiliadaQuestion[]>();

  roundState$ = this.roundSource.asObservable();
  scores$ = this.scoresSource.asObservable();
  gameState$ = this.gameStateSource.asObservable();
  settings$ = this.settingsSource.asObservable();
  questions$ = this.questionsSource.asObservable();

  constructor(private db: AngularFirestore) {
    this.db
      .doc("familiada/round")
      .valueChanges()
      .subscribe((roundState: RoundState) => {
        if (isNullOrUndefined(roundState)) {
          return;
        }
        this.roundSource.next(roundState);
      });
    this.db
      .doc("familiada/scores")
      .valueChanges()
      .subscribe((scoresState: Scores) => {
        if (isNullOrUndefined(scoresState)) {
          return;
        }
        this.scoresSource.next(scoresState);
      });
    this.db
      .doc("familiada/state")
      .valueChanges()
      .subscribe((gameState: GameState) => {
        if (isNullOrUndefined(gameState)) {
          return;
        }
        this.gameStateSource.next(gameState);
      });
    this.db
      .doc("settings/settings")
      .valueChanges()
      .subscribe((settings: FamiliadaSettings) => {
        if (isNullOrUndefined(settings)) {
          return;
        }
        this.settingsSource.next(settings);
      });
      this.db
      .collection<FamiliadaQuestion>("questions")
      .valueChanges().subscribe((questions: FamiliadaQuestion[]) => {
        if (isNullOrUndefined(questions)) { return; }
        this.questionsSource.next(questions);
      });
    // this.qS.getQuestions().then(questions => {
    //   this.db.doc('settings/questions').set({questions});
    //   this.updateSettings({questionsCount: questions.length});
    // });
   
  }

  updateGameState(state: GameState) {
    this.db.doc("familiada/state").set(state);
  }
  updateScores(scores: Scores) {
    this.db.doc("familiada/scores").set(scores);
  }
  updateRoundState(roundState: RoundState) {
    this.db.doc("familiada/round").set(roundState);
  }
  updateSettings(settings: Partial<FamiliadaSettings>) {
    this.db.doc("settings/settings").update(settings);
  }

  addQuestion(question: FamiliadaQuestion) {
    this.db.collection<FamiliadaQuestion>("questions").add(question);
  }
}
