import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FamiliadaQuestion, FamiliadaResponse } from 'src/app/models/interfaces';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-question-dialog',
  templateUrl: './edit-question-dialog.component.html',
  styleUrls: ['./edit-question-dialog.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class EditQuestionDialog {
  answers: FamiliadaResponse[];
  displayedColumns: string[] = ['response', 'points'];
  questionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditQuestionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: FamiliadaQuestion,
  ) {
    this.answers = data.answers;
    const formFields = {question: [data.question]};
    this.answers.forEach(answer => {
      formFields['response' + answer.id] = [answer.response];
      formFields['points' + answer.id] = [answer.points];
    });
    this.questionForm = this.fb.group(formFields);
  }

  saveQuestion() {
    console.log(this.questionForm.value);
  }
}
