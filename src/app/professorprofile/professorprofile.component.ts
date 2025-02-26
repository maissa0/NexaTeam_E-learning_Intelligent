import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Professor } from '../models/professor';
import { ProfessorService } from '../services/professor.service';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import $ from 'jquery';

@Component({
  selector: 'app-professorprofile',
  templateUrl:   './professorprofile.component.html',
  styleUrls: ['./professorprofile.component.css'],
  imports: [CommonModule, FormsModule,FooterComponent,
    HeaderComponent,
    
          RouterModule  ,
        ],  
})
export class ProfessorprofileComponent implements OnInit {
 
  profileDetails : Observable<Professor[]> | undefined;
  professor: Professor = new Professor;
  msg = ' ';
  currRole = '';
  loggedUser = '';
  temp = false;

  constructor(private _service: ProfessorService, private activatedRoute: ActivatedRoute, private _router : Router) { }

  ngOnInit(): void 
  {
    this.loggedUser = JSON.stringify(sessionStorage.getItem('loggedUser')|| '{}');
    this.loggedUser = this.loggedUser.replace(/"/g, '');

    this.currRole = JSON.stringify(sessionStorage.getItem('ROLE')|| '{}'); 
    this.currRole = this.currRole.replace(/"/g, '');

    $("#profilecard").show();
    $("#profileform").hide();
    this.getProfileDetails(this.loggedUser);
  }

  editProfile()
  {
    $("#profilecard").hide();
    $("#profileform").show();
  }

  getProfileDetails(loggedUser : string)
  {
    this.profileDetails = this._service.getProfileDetails(this.loggedUser);
    console.log(this.profileDetails);
  }

  updateProfessorProfile()
  {
    this._service.UpdateUserProfile(this.professor).subscribe(
      () => {
        console.log("Professor Profile Updated succesfully");
        this.msg = "Profile Updated Successfully !!!";
        $(".editbtn").hide();
        $("#message").show();
        this.temp = true;
        $("#profilecard").show();
        $("#profileform").hide();
        setTimeout(() => {
            this._router.navigate(['/professordashboard']);
          }, 6000);
      },
      // .error => {
      //   console.log("Profile Updation Failed");
      //   console.log(error.error);
      //   this.msg = "Profile Updation Failed !!!";
      // }
    )
  }

}
