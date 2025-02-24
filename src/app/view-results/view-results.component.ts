import { Component } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-results',
  templateUrl: './view-results.component.html',
  styleUrls: ['./view-results.component.css']
})
export class ViewResultsComponent {
  quizTitle: string = '';

  resultsData:any;
  constructor(private quizService: AdminService){}

  ngOnInit(){
    
    this.getQuizResults();
  }

  getQuizResults(){
    this.quizService.getQuizResults().subscribe(res => {
      this.resultsData = res;
      console.log(this.resultsData);

  })
}
    
}
