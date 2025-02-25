import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Professor } from '../models/professor';
import { User } from '../models/user';
import { ProfessorService } from '../services/professor.service';
import { RegistrationService } from '../services/registration.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration',
  standalone: true,  // Marks this as a standalone component
      imports: [CommonModule, FormsModule,
  
        RouterModule  ,
      ],  
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  user = new User();
  professor = new Professor();
  msg = ' ';

  constructor(private _registrationService : RegistrationService, private _professorService : ProfessorService, private _router : Router) { }

  ngOnInit(): void 
  {
    $(".nav1").addClass("highlight1")
    $("#home-tab").click(function(){
      $("#profile").hide();
      $("#home").show();
      $(".nav1").addClass("highlight1")
      $(".nav2").removeClass("highlight2")
    });
    $("#profile-tab").click(function(){
      $("#home").hide();
      $("#profile").show();
      $(".nav2").addClass("highlight2")
      $(".nav1").removeClass("highlight1")
    });
  }

  registerUser()
  {
    this._registrationService.registerUserFromRemote(this.user).subscribe(
      data => {
        console.log("Registration Success");
        sessionStorage.setItem("username",this.user.username);
        sessionStorage.setItem("gender",this.user.gender);
        this._router.navigate(['/registrationsuccess']);
      },
      error => {
        console.log("Registration Failed");
        console.log(error.error);
        this.msg = "User with "+this.user.email+" already exists !!!";
      }
    )
  }

  registerProfessor()
  {
    this._registrationService.registerProfessorFromRemote(this.professor).subscribe(
      data => {
        console.log("Registration Success");
        sessionStorage.setItem("doctorname",this.professor.professorname);
        sessionStorage.setItem("gender",this.professor.gender);
        this._router.navigate(['/registrationsuccess']);
      },
      error => {
        console.log("Registration Failed");
        console.log(error.error);
        this.msg = "Professor with "+this.professor.email+" already exists !!!";
      }
    )
  }

}