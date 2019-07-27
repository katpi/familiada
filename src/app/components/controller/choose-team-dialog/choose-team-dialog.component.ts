import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { FamiliadaService } from "../../../services/familiada.service";
import { Team } from '../../../enums/enums';

@Component({
  selector: "app-choose-team-dialog",
  templateUrl: "./choose-team-dialog.component.html",
  styleUrls: ["./choose-team-dialog.component.scss"]
})
export class ChooseTeamDialog {
  constructor(
    public dialogRef: MatDialogRef<ChooseTeamDialog>,
    private familiadaService: FamiliadaService
  ) {}

  setTeam(team: string) {
    this.familiadaService.setFirstClaiming(Team[team]);
    this.dialogRef.close();
  }
}
