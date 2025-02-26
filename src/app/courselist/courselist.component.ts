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

@Component({
  selector: 'app-courselist',
  templateUrl: './courselist.component.html',
  styleUrls: ['./courselist.component.css'],
  imports: [CommonModule, FormsModule, FooterComponent, RouterModule, CarouselModule, HeaderComponent],
})
export class CourselistComponent implements OnInit {
  youtubecourselist: Observable<Course[]> | undefined;
  websitecourselist: Observable<Course[]> | undefined;
  courselist: Observable<Course[]> | undefined;
  wishliststatus: Observable<any[]> | undefined;
  enrollment = new Enrollment();
  wishlist = new Wishlist();

  loggedUser = '';
  currRole = '';

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
