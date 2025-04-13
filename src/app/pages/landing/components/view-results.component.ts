import { Component } from '@angular/core';
import { AdminService } from '../../service/admin-service.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-view-results',
  imports: [CommonModule],
  template: `

<table class="modern-table">
  <thead>
    <tr>
      <th>Quiz</th>
      <th>Utilisateur</th>
      <th>Questions</th>
      <th>Réponses Correctes</th>
      <th>Score</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let data of resultsData">
      <td>{{ data.quizName }}</td>
      <td>{{ data.userName }}</td>
      <td>{{ data.totalQuestions }}</td>
      <td>{{ data.correctAnswers }}</td>
      <td>
        {{ data.percentage }}%
        <span *ngIf="data.percentage === 100" class="trophy">🏆</span>
        <span *ngIf="data.percentage === 0" class="retry">❌</span>
      </td>
    </tr>
  </tbody>
</table>



`,
  styles: `.modern-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-family: 'Arial', sans-serif;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  thead {
    background-color: #007BFF;
    color: white;
  }
  
  th, td {
    padding: 12px 30px;
    border-bottom: 1px solid #ddd;
  }
  
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  tr:hover {
    background-color: #eef5ff;
    transition: 0.3s ease-in-out;
  }
  
  th {
    font-weight: bold;
  }
  
  .trophy {
    color: gold;
    font-size: 20px;
    margin-left: 8px;
  }
  
  .retry {
    color: red;
    font-size: 20px;
    margin-left: 8px;
  }
  

  `
})
export class ViewResultsComponent {
  quizTitle: string = '';
  message: string = '';
  messageClass: string = '';
  showMessage: boolean = false;

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
