import {
  FamiliadaResponse,
  RoundState,
  GameState,
  Scores
} from "../models/interfaces";
import { Observable } from "rxjs";

export interface Familiada {
  initGame();
  setTeam(team: string);
  claimAnswer(element: FamiliadaResponse);
  claimWrong();
  getRoundState(): Observable<RoundState>;
  getScores(): Observable<Scores>;
  getGameState(): Observable<GameState>;
}
