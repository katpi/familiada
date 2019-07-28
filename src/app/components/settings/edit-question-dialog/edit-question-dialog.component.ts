import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FamiliadaQuestion, FamiliadaResponse } from 'src/app/models/interfaces';

@Component({
  selector: 'app-edit-question-dialog',
  templateUrl: './edit-question-dialog.component.html',
  styleUrls: ['./edit-question-dialog.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class EditQuestionDialog {
  answers: FamiliadaResponse[];
  displayedColumns: string[] = ['response', 'points'];

  constructor(
    public dialogRef: MatDialogRef<EditQuestionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: FamiliadaQuestion,
  ) {
    this.answers = data.answers;
  }
}
