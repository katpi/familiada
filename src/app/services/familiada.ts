import { Observable } from 'rxjs';

import { Team } from '../enums/enums';
import {
  FamiliadaResponse,
  GameState,
  RoundState,
  Scores,
} from '../models/interfaces';

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
