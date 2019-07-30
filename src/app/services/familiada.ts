import { Observable } from 'rxjs';

import { Team } from '../enums/enums';
import {
  FamiliadaGameState,
  FamiliadaResponse,
  FamiliadaRoundState,
  FamiliadaScores,
} from '../models/interfaces';

export interface Familiada {
  init();
  startGame();
  nextRound();
  setFirstClaiming(team: Team);
  claimAnswer(element: FamiliadaResponse);
  claimWrong();
  getRoundState(): Observable<FamiliadaRoundState>;
  getScores(): Observable<FamiliadaScores>;
  getGameState(): Observable<FamiliadaGameState>;
}
