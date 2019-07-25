export const UPDATE_TEAMS_STATE = "UpdateTeamsState";

export const CHANGE_TEAM_STORAGE = "NewTeamStorage";

export const CHANGE_TEAM = "NewTeam";
export function changeTeam(state: { team: string }) {
  return {
    type: CHANGE_TEAM as typeof CHANGE_TEAM,
    payload: { team: state.team === "TEAM1" ? "TEAM2" : "TEAM1" }
  };
}

export type TeamActions = ReturnType<typeof changeTeam>;
