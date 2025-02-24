import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQuestionInQuizComponent } from './add-question-in-quiz.component';

describe('AddQuestionInQuizComponent', () => {
  let component: AddQuestionInQuizComponent;
  let fixture: ComponentFixture<AddQuestionInQuizComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddQuestionInQuizComponent]
    });
    fixture = TestBed.createComponent(AddQuestionInQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
