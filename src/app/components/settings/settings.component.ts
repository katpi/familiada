import { Component } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { FamiliadaQuestion } from 'src/app/models/interfaces';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { EditQuestionDialog } from './edit-question-dialog/edit-question-dialog.component';
import { QuestionsService } from '../../services/questions.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent  {
  dataSource: FamiliadaQuestion[];
  displayedColumns: string[] = ['id', 'question', 'answers', 'actions'];
  teamNamesForm = this.fb.group({
    team1Name: [''],
    team2Name: [''],
  });

  constructor(
    private fb: FormBuilder,
    private db: DatabaseService,
    private questionService: QuestionsService,
    private dialog: MatDialog
    ) {
    this.db.questions$
    .pipe(
      map((questions: FamiliadaQuestion[]) => {
        return questions.sort((a: FamiliadaQuestion, b: FamiliadaQuestion) => {
          return a.id > b.id ? 1 : b.id > a.id ? -1 : 0;
        });
      })
    ).subscribe(questions => this.dataSource = questions);
  }

  saveTeamNames() {
    this.db.updateSettings(this.teamNamesForm.value);
  }

  addQuestion() {
    this.dialog.open(EditQuestionDialog);
  }

  editQuestion(question: FamiliadaQuestion) {
    this.dialog.open(EditQuestionDialog, {data: question});
  }

  deleteQuestion(question: FamiliadaQuestion) {
    this.questionService.deleteQuestion(question);
  }
}
