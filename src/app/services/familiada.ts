import {
  FamiliadaResponse,
  RoundState,
  GameState,
  Scores
} from "../models/interfaces";
import { Observable } from "rxjs";
import { Team } from '../enums/enums';

export interface Familiada {
  init();
  startGame();
  nextRound();
  setFirstClaiming(team: Team);
  claimAnswer(element: FamiliadaResponse);
  claimWrong();
  getRoundState(): Observable<RoundState>;
  getScores(): Observable<Scores>;
  getGameState(): Observable<GameState>;
}
