import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FamiliadaQuestion, FamiliadaResponse } from 'src/app/models/interfaces';
import { FormBuilder, FormGroup } from '@angular/forms';
<<<<<<< HEAD
import { QuestionsService } from 'src/app/services/questions.service';
=======
>>>>>>> 406f961e5848a8e30694fcd88bde4865a0295f0c

@Component({
  selector: 'app-edit-question-dialog',
  templateUrl: './edit-question-dialog.component.html',
  styleUrls: ['./edit-question-dialog.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class EditQuestionDialog {
  answers: FamiliadaResponse[];
<<<<<<< HEAD
  displayedColumns: string[] = ['response', 'points', 'actions'];
=======
  displayedColumns: string[] = ['response', 'points'];
>>>>>>> 406f961e5848a8e30694fcd88bde4865a0295f0c
  questionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditQuestionDialog>,
    private questionsService: QuestionsService,
    @Inject(MAT_DIALOG_DATA) public data: FamiliadaQuestion,
  ) {
    this.answers = data.answers;
<<<<<<< HEAD
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
=======
    const formFields = {question: [data.question]};
    this.answers.forEach(answer => {
      formFields['response' + answer.id] = [answer.response];
      formFields['points' + answer.id] = [answer.points];
    });
    this.questionForm = this.fb.group(formFields);
  }

  saveQuestion() {
    console.log(this.questionForm.value);
>>>>>>> 406f961e5848a8e30694fcd88bde4865a0295f0c
  }
}
