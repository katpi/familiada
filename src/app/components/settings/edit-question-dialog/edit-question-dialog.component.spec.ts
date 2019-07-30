import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditQuestionDialog } from './edit-question-dialog.component';

describe('EditQuestionDialogComponent', () => {
  let component: EditQuestionDialog;
  let fixture: ComponentFixture<EditQuestionDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditQuestionDialog],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditQuestionDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
