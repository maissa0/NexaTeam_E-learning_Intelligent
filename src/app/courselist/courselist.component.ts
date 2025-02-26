import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Chapter } from '../models/chapter';
import { Enrollment } from '../models/enrollment';
import { Wishlist } from '../models/wishlist';
import { ProfessorService } from '../services/professor.service';
import { UserService } from '../services/user.service';
import { Course } from '../models/course';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { HeaderComponent } from '../header/header.component';
import $ from 'jquery';

@Component({
  selector: 'app-courselist',
  templateUrl: './courselist.component.html',
  styleUrls: ['./courselist.component.css'],
  imports: [CommonModule, FormsModule, FooterComponent, RouterModule, CarouselModule, HeaderComponent],
})
export class CourselistComponent implements OnInit {
 
  youtubecourselist : Observable<Course[]> | undefined;
  websitecourselist : Observable<Course[]> | undefined;
  courselist : Observable<Course[]> | undefined;
  enrollmentstatus : Observable<any[]> | undefined;
  wishliststatus : Observable<any[]> | undefined;
  enrollment = new Enrollment();
  wishlist = new Wishlist();
  loggedUser = '';
  currRole = '';
  enrolledID = '';
  enrolledURL = '';
  enrolledName = '';
  enrolledInstructorName = '';
  enrolledStatus : any;
  enrolledStatus2 = '';
  @ViewChild('alertOne') alertOne: ElementRef | undefined;

  constructor(private _service: ProfessorService, private userService: UserService, private _router: Router) {}

  ngOnInit() {
    this.loggedUser = JSON.stringify(sessionStorage.getItem('loggedUser') || '{}').replace(/"/g, '');
    this.currRole = JSON.stringify(sessionStorage.getItem('ROLE') || '{}').replace(/"/g, '');
    this.youtubecourselist = this.userService.getYoutubeCourseList();
    this.websitecourselist = this.userService.getWebsiteCourseList();
  }

  getcoursedetails(coursename: string) {
    this.courselist = this.userService.getCourseListByName(coursename);
    this.wishliststatus = this.userService.getWishlistStatus(coursename, this.loggedUser);
  }

  visitCourse(coursename: string) {
    this._router.navigate(['/fullcourse', coursename]);
    console.log('Navigating to:', coursename);
  }

  gotoURL(url: string) {
    (window as any).open(url, '_blank');
  }
  addToWishList(course : Course, loggedUser : string, currRole : string)
{
  this.wishlist.courseid = course.courseid;
  this.wishlist.coursename = course.coursename;
  this.wishlist.likeduser = loggedUser;
  this.wishlist.likedusertype = currRole;
  this.wishlist.instructorname = course.instructorname;
  this.wishlist.instructorinstitution = course.instructorinstitution;
  this.wishlist.enrolledcount = course.enrolledcount;
  this.wishlist.coursetype = course.coursetype;
  this.wishlist.websiteurl = course.websiteurl;
  this.wishlist.skilllevel = course.skilllevel;
  this.wishlist.language = course.language;
  this.wishlist.description = course.description;
  $("#wishlistbtn").hide();
  $("#likedbtn").css('display','block');
  this.userService.addToWishlist(this.wishlist).subscribe(
    data => {
      console.log("Added To Wishlist Successfully !!!");
    },
    error => {
      console.log("Adding Process Failed !!!");
      console.log(error.error);
    }
  );
}
backToCourseList()
{
    $("#youtubecoursecard").css('display','block');
    $("#websitecoursecard").css('display','block');
    $("#coursedetailscard").hide();
}
  enrollcourse(course : Course, loggedUser : string, currRole : string)
{
  this.enrollment.courseid = course.courseid;
  this.enrollment.coursename = course.coursename;
  this.enrollment.enrolledusertype = currRole;
  this.enrollment.instructorname = course.instructorname;
  this.enrollment.instructorinstitution = course.instructorinstitution;
  this.enrollment.enrolledcount = course.enrolledcount;
  this.enrollment.youtubeurl = course.youtubeurl;
  this.enrollment.websiteurl = course.websiteurl;
  this.enrollment.coursetype = course.coursetype;
  this.enrollment.skilllevel = course.skilllevel;
  this.enrollment.language = course.language;
  this.enrollment.description = course.description;
  this.enrolledID = course.courseid;
  this.enrolledURL = course.youtubeurl;
  this.enrolledName = course.coursename;
  this.enrolledInstructorName = course.instructorname;
  this.enrolledStatus2 = "enrolled"
  $("#enrollbtn").hide();
  $("#enrolledbtn").show();
  setTimeout(() => {
    $("#youtubecoursecard").css('display','none');
    $("#websitecoursecard").css('display','none');
    $("#coursedetailscard").hide();
    $("#enrollsuccess").show();
  },5000);
  this.userService.enrollNewCourse(this.enrollment,loggedUser,currRole).subscribe(
    data => {
      console.log("Course enrolled Successfully !!!");
    },
    error => {
      console.log("Enrollment Failed !!!");
      console.log(error.error);
    }
  );
}


  owlOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    margin: 50,
    stagePadding: 20,
    pullDrag: true,
    dots: false,
    navSpeed: 1000,
    autoplay: true,
    navText: ['Previous', 'Next'],
    responsive: {
      0: { items: 1 },
      400: { items: 2 },
      767: { items: 2 },
      1024: { items: 3 },
    },
    nav: true,
  };
}
