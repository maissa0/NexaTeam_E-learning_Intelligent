import { Component, OnInit } from '@angular/core';
import { StatsWidget } from "../dashboard/components/statswidget";
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FeedbackService } from '../service/feedback.service';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextareaModule } from 'primeng/textarea';
import { RecommondationComponent } from "../recommondation/recommondation.component";
import { array as englishBadWords } from 'badwords-list'; 
import { array as frenchBadWords } from 'french-badwords-list'; 

import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-feedback',
  imports: [StatsWidget, ButtonModule, AvatarModule, RatingModule, FormsModule, CommonModule, TextareaModule, RecommondationComponent, RecommondationComponent, MessageModule,RouterModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent implements OnInit {
  courseId!: number;
  feedbacks: any[] = [];
  displayedFeedbacks: any[] = []; 
  maxFeedbacksToShow: number = 5; 
  showAll: boolean = false;
  feedbackInvalid: boolean = false;
  feedbackErrorMessage: string = '';
  newFeedback = {
    feedback: '',
    emotion: 3
  };
  userId = 1;
  sortField: string = '';
  sortOrder: number = 1;
  badWords = [...englishBadWords, ...frenchBadWords];
  constructor(private route: ActivatedRoute, private feedbackService: FeedbackService) {}
  toggleShowMore() {
    this.showAll = !this.showAll;
    this.displayedFeedbacks = this.showAll ? this.feedbacks : this.feedbacks.slice(0, this.maxFeedbacksToShow);
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.courseId = +id; 
        this.loadFeedbacks();
      }
    });
  }

  loadFeedbacks(): void {
    this.feedbackService.getFeedbacksByCourse(this.courseId).subscribe({
      next: (data) => {
        this.feedbacks = data;
        this.sortFeedbacks();
        this.displayedFeedbacks = this.feedbacks.slice(0, this.maxFeedbacksToShow);
      },
      error: (err) => {
        console.error('Error fetching feedbacks:', err);
      }
    });
  }
  submitFeedback(): void {
    const feedbackText = this.newFeedback.feedback.trim();

    if (!feedbackText) {
      this.feedbackInvalid = true;
      this.feedbackErrorMessage = 'Feedback cannot be empty';
      return;
    }

    const containsBadWord = this.badWords.some(word => 
      new RegExp(`\\b${word}\\b`, 'i').test(feedbackText) 
    );

    if (containsBadWord) {
      this.feedbackInvalid = true;
      this.feedbackErrorMessage = 'Your feedback contains inappropriate words.';
      return;
    }

    this.feedbackInvalid = false;
    this.feedbackErrorMessage = '';

    const feedbackData = {
      feedbackText: this.newFeedback.feedback,
      emotion: this.newFeedback.emotion,
      userId: this.userId,
      courseId: this.courseId,
    };

    this.feedbackService.createFeedback(feedbackData).subscribe({
      next: (response) => {
        this.feedbacks.push(response);
        this.sortFeedbacks();
        this.newFeedback = { feedback: '', emotion: 3 };
      },
      error: (err) => {
        console.error('Error submitting feedback:', err);
      }
    });
  }
  toggleLike(feedbackId: number): void {
    this.feedbackService.toggleLike(feedbackId, this.userId).subscribe({
      next: (updatedFeedback) => {
        this.feedbacks = this.feedbacks.map(feedback =>
          feedback.id === updatedFeedback.id ? updatedFeedback : feedback
        );
        this.sortFeedbacks();
      },
      error: (err) => {
        console.error('Error toggling like:', err);
      }
    });
  }
  isLikedByUser(feedback: any): boolean {
    return feedback.likedByUsers?.some((user: any) => user.id === this.userId);
  }
  sortFeedbacks(): void {
    if (this.sortField) {
      this.feedbacks.sort((a, b) => {
        let valueA = a[this.sortField];
        let valueB = b[this.sortField];
        if (this.sortField === 'dateDeCreation') {
          valueA = new Date(valueA).getTime();
          valueB = new Date(valueB).getTime();
        }
        console.log(valueA)
        if (this.sortField === 'likedByUsers'){
          valueA = a.likedByUsers?.length || 0
          valueB= b.likedByUsers?.length || 0
        }
        console.log(valueA)
        console.log(valueB)

        return (valueA > valueB ? 1 : -1) * this.sortOrder;
      });
    }
    console.log(this.feedbacks)
  }

  setSortField(field: string): void {
    if (this.sortField === field) {
      this.sortOrder *= -1; 
    } else {
      this.sortField = field;
      this.sortOrder = 1; 
    }
    console.log("sortField: ",this.sortField)
    console.log("sortOder: ",this.sortOrder)
    this.sortFeedbacks();
  }
}
