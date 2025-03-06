import { Component, OnInit } from '@angular/core';
import { FeedbackService } from '../pages/service/feedback.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DialogModule } from 'primeng/dialog';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-feedback',
  imports: [   TableModule,
          MultiSelectModule,
          SelectModule,
          InputIconModule,
          TagModule,
          InputTextModule,
          SliderModule,
          ProgressBarModule,
          ToggleButtonModule,
          ToastModule,
          CommonModule,
          FormsModule,
          ButtonModule,
          RatingModule,
          RippleModule,
          IconFieldModule,
          DialogModule,
          RouterModule],
  templateUrl: './admin-feedback.component.html',
  styleUrl: './admin-feedback.component.scss'
})
export class AdminFeedbackComponent implements OnInit {
  groupedFeedbacks: { [courseId: number]: { [courseTitle: string]: any[] } } = {};
  loading: boolean = true;
  feedbackList: any[]= [];
  constructor(private feedbackService: FeedbackService) {}
  feedbackToDelete: any;
  displayConfirmation: boolean = false;
  ngOnInit(): void {
    this.loadFeedbacks();
  }

  loadFeedbacks(): void {
    this.feedbackService.getGroupedFeedbacks().subscribe({
      next: (data) => {
        this.groupedFeedbacks = data;
        this.feedbackList=this.getFeedbackArray()
        console.log(this.feedbackList)
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching grouped feedback:', err);
        this.loading = false;
      }
    });
  }

  getFeedbackArray() {
    let feedbackArray: any[] = [];
  
    for (const courseId in this.groupedFeedbacks) {
      for (const courseTitle in this.groupedFeedbacks[courseId]) {
        feedbackArray.push({
          isHeader: true,
          courseId: courseId,
          courseTitle: courseTitle
        });
        
        this.groupedFeedbacks[courseId][courseTitle].forEach(feedback => {
          const date = new Date(feedback.dateDeCreation); 
          feedbackArray.push({
            courseId: courseId,
            courseTitle: courseTitle,
            likes: feedback.likedByUsers?.length ?? 0,
            ...feedback,
            dateDeCreation: date,
          });
        });
      }
    }
    
    return feedbackArray;
  }
  
  deleteFeedback(): void {
 

    this.feedbackService.deleteFeedback(this.feedbackToDelete.id).subscribe({
      next: () => {   const index = this.feedbackList.indexOf(this.feedbackToDelete);
        console.log(index)
        if (index !== -1) {
          this.feedbackList.splice(index, 1); 
          this.feedbackList = [...this.feedbackList];
        }},
      error: (err: any) => console.error("Error deleting feedback:", err)
    });
    this.closeConfirmation();
  }
  clearFilters(table: Table) {
    table.clear();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  openConfirmation(feedbackToDelete: any) {
    this.feedbackToDelete = feedbackToDelete;
    this.displayConfirmation = true;
}

closeConfirmation() {
    this.displayConfirmation = false;
}
}