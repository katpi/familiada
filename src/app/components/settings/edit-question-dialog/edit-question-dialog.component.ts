import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FamiliadaQuestion, FamiliadaResponse } from 'src/app/models/interfaces';
import { FormBuilder, FormGroup } from '@angular/forms';
import { QuestionsService } from 'src/app/services/questions.service';

@Component({
  selector: 'app-edit-question-dialog',
  templateUrl: './edit-question-dialog.component.html',
  styleUrls: ['./edit-question-dialog.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class EditQuestionDialog {
  answers: FamiliadaResponse[];
  displayedColumns: string[] = ['response', 'points', 'actions'];
  questionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditQuestionDialog>,
    private questionsService: QuestionsService,
    @Inject(MAT_DIALOG_DATA) public data: FamiliadaQuestion,
  ) {
    this.answers = data.answers;
    this.questionForm = this.fb.group({
      question: [data.question],
      answer: [''],
      points: [''],
    });
  }

  addResponse() {
    const response: FamiliadaResponse = {
        id: null,
        points: this.questionForm.value.points,
        response: this.questionForm.value.answer,
      };
    this.answers = [...this.answers, response];
    this.questionForm.patchValue({
      answer: [''],
      points: [''],
    });
  }

  saveQuestion() {
    const answers = this.answers.sort((a: FamiliadaResponse, b: FamiliadaResponse) => {
      return (a.points > b.points) ? -1 : ((b.points > a.points) ? 1 : 0);
    });
    for (let i = 0; i < this.answers.length; i++) {
      this.answers[i].id = i;
    }
    const question: FamiliadaQuestion = {
      id: this.data.id,
      question: this.questionForm.value.question,
      answers
    };
    this.questionsService.saveQuestion(question);
  }
}
