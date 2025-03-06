import { Component, OnInit } from '@angular/core';
import { RecommondationService } from '../service/recommondation.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PickListModule } from 'primeng/picklist';
import { OrderListModule } from 'primeng/orderlist';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { FeedbackService } from '../service/feedback.service';

@Component({
  selector: 'app-recommondation',
    imports: [CommonModule, DataViewModule, FormsModule, SelectButtonModule, PickListModule, OrderListModule, TagModule, ButtonModule,RouterModule],
  templateUrl: './recommondation.component.html',
  styleUrl: './recommondation.component.scss'
})
export class RecommondationComponent implements OnInit{
  layout: string = 'grid'; 
  courses: any[] = [];
  courseId!: number;
  constructor(private route: ActivatedRoute,private recommondationService:RecommondationService, private feedbackService: FeedbackService) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.courseId = +id; 
        this.fetchRecommendedCourses();
      }
    });  }

  fetchRecommendedCourses() {
    this.recommondationService.getRecommendedCourses(this.courseId) 
      .subscribe((data: any[]) => {
        this.courses = data;
        this.courses.forEach(course => {
          this.fetchAverageEmotionForCourse(course.id);
        });
      });
  }
  fetchAverageEmotionForCourse(courseId: number) {
    this.feedbackService.getAverageEmotionForCourse(courseId).subscribe({
      next: (emotion) => {
        const course = this.courses.find(course => course.id === courseId);
        if (course) {
          course.averageEmotion = emotion;
        }
      },
      error: (err) => {
        console.error('Error fetching average emotion', err);
      }
    });
  }


}
