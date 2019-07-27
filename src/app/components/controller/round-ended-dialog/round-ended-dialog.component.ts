import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FamiliadaService } from '../../../services/familiada.service';
import { Team } from '../../../enums/enums';

@Component({
  selector: 'app-round-ended-dialog',
  templateUrl: './round-ended-dialog.component.html',
  styleUrls: ['./round-ended-dialog.component.scss']
})
export class RoundEndedDialog {
  constructor(
    public dialogRef: MatDialogRef<RoundEndedDialog>,
    private familiadaService: FamiliadaService
  ) {}

  next() {
    this.familiadaService.nextRound();
    this.dialogRef.close();
  }
}
