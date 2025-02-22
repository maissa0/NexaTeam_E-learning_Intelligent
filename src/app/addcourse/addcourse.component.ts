import { Component, OnInit } from '@angular/core';
import { Course } from '../models/course';
import { ProfessorService } from '../services/professor.service';
import $ from 'jquery';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';  
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';


@Component({
  selector: 'app-addcourse',
  standalone: true,  // Marks this as a standalone component
  imports: [CommonModule, FormsModule,HeaderComponent], 
  templateUrl: './addcourse.component.html',
  styleUrls: ['./addcourse.component.css']
})
export class AddcourseComponent implements OnInit {

  course = new Course();
  msg = ' ';

  constructor(private _professorService : ProfessorService, private _router : Router) { }

  ngOnInit(): void 
  {
    $("#websitelink, #youtubelink").css("display","none");
    $("#websitelink").hide();
    
    $("select").on('change', function() {
      $(this).find("option:selected").each(function() {
          var option = $(this).attr("value");
          if(option === "Website") {
            $("#websitelink").css("display","block");
            $("#youtubelink").css("display","none");
          } 
          else if(option === "Youtube")
          {
            $("#youtubelink").css("display","block");
            $("#websitelink").css("display","none");
          }
      });
    }).change();
  }

  addCourse()
  {
    this._professorService.addCourse(this.course).subscribe(
      data => {
        console.log("Course added Successfully !!!");
        this._router.navigate(['/addchapter']);
      },
      error => {
        console.log("Process Failed");
        console.log(error.error);
        this.msg = "Course with "+this.course.coursename+" already exists !!!";
      }
    )
  }

}
