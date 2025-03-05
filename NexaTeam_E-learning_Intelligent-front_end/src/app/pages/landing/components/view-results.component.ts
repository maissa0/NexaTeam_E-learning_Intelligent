import { Component } from '@angular/core';
import { AdminService } from '../../service/admin-service.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-view-results',
  imports: [CommonModule],
  template: `

<div style="padding: 20px;">
  <!-- Display Quiz Name (Title) -->
  <h2>{{ quizTitle }}</h2> <!-- This will now display the quiz title -->

  <table border="1" style="width: 100%; border-collapse: collapse; text-align: left;">
    <thead style="background-color: #f5f5f5;">
      <tr>
        <th style="padding: 10px;">Quiz Name</th>
        <th style="padding: 10px;">User Name</th>
        <th style="padding: 10px;">Total Question</th>
        <th style="padding: 10px;">Correct Answers</th>
        <th style="padding: 10px;">Percentage</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let data of resultsData" style="border-bottom: 1px solid #ddd;">
        <td style="padding: 10px;">{{ data.quizName }}</td>
        <td style="padding: 10px;">{{ data.userName }}</td>
        <td style="padding: 10px;">{{ data.totalQuestions }}</td>
        <td style="padding: 10px;">{{ data.correctAnswers }}</td>
        <td style="padding: 10px;">{{ data.percentage }}%</td>
      </tr>
    </tbody>
  </table>
</div>`,
  styles: `table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }
  
  thead {
    background-color: #f5f5f5;
  }
  
  th, td {
    padding: 10px;
    border: 1px solid #ddd;
  }
  
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  tr:hover {
    background-color: #f1f1f1;
  }
  
  th {
    font-weight: bold;
  }
  `
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
