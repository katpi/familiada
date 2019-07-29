export enum Team {
  TEAM1 = 'TEAM1',
  TEAM2 = 'TEAM2'
}

export enum GameStateEnum {
  BEFORE_START = 'BEFORE_START',
  START = 'START',
  END = 'END',
  NEW_ROUND = 'NEW_ROUND',
  ROUND = 'ROUND',
  ROUND_ENDED = 'ROUND_ENDED'
}

export enum GamePhase {
  FIRST,
  SECOND,
  THIRD
}

export enum FamiliadaEvent {
  PLAY_INTRO = 'PLAY_INTRO',
  JOKE = 'JOKE',
  END_JOKE = 'END_JOKE',
  APPLAUSE = 'APPLAUSE',
  GOOD_ANSWER = 'GOOD_ANSWER', 
  WRONG_ANSWER = 'WRONG_ANSWER',
  NEW_ROUND = 'NEW_ROUND',
}
