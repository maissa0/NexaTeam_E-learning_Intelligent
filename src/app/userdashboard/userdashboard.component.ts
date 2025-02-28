import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminService } from '../services/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { MenuItem } from 'primeng/api';
import { Footer } from 'primeng/api';
import { CardModule } from 'primeng/card'; 
import { PanelMenuModule } from 'primeng/panelmenu'; // Import PanelMenuModule

@Component({
  selector: 'app-userdashboard',
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.css'],
  imports: [CommonModule, FormsModule,FooterComponent,
    
    RouterModule  ,HeaderComponent,CardModule,PanelMenuModule
  ],  
})
export class UserdashboardComponent implements OnInit {
  model: MenuItem[] = [];

  loggedUser = '';
  currRole = '';
  courses: Observable<any[]> | undefined;
  enrollments: Observable<any[]> | undefined;
  enrollmentcount: Observable<any[]> | undefined;
  wishlist: Observable<any[]> | undefined;
  chapters: Observable<any[]> | undefined;

  constructor(private _service: AdminService) {}

  ngOnInit(): void 
  {

    this.loggedUser = JSON.stringify(sessionStorage.getItem('loggedUser')|| '{}');
    this.loggedUser = this.loggedUser.replace(/"/g, '');

    this.currRole = JSON.stringify(sessionStorage.getItem('ROLE')|| '{}'); 
    this.currRole = this.currRole.replace(/"/g, '');
    this.model = [
      {
        label: 'User',
        items: [
          { label: 'Edit Profile', icon: 'pi pi-user-edit', routerLink: ['/edituserprofile'] },
          { label: 'Start Learning', icon: 'pi pi-trophy', routerLink: ['/courselist'] },
          { label: 'My Learning', icon: 'pi pi-graduation-cap', routerLink: ['/mycourses'] },
          { label: 'My Wishlist', icon: 'pi pi-heart', routerLink: ['/mywishlist'] },
          { label: 'Chat', icon: 'pi pi-comments', routerLink: ['/chat'] },
          { label: 'Courses', icon: 'pi pi-list', routerLink: ['/courselist'] },
          { label: 'Professors', icon: 'pi pi-users', routerLink: ['/professorlist'] },
          { label: 'Users', icon: 'pi pi-user', routerLink: ['/userlist'] },
          { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout() }
        ]
      }
    ];

    // Fetch data from the service
    this.courses = this._service.getTotalCourses();
    this.enrollments = this._service.getTotalEnrollments();
    this.enrollmentcount = this._service.getTotalEnrollmentCount();
    this.wishlist = this._service.getTotalWishlist();
    this.chapters = this._service.getTotalChapters();
  }

  // Toggle sidebar using Angular-native approach
  toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.toggle('open');
      this.menuBtnChange();
    }
  }

  // Change menu button icon
  menuBtnChange() {
    const btn = document.getElementById('btn');
    if (btn) {
      if (document.querySelector('.sidebar')?.classList.contains('open')) {
        btn.classList.remove('fa-bars');
        btn.classList.add('fa-ellipsis-v');
      } else {
        btn.classList.remove('fa-ellipsis-v');
        btn.classList.add('fa-bars');
      }
    }
  }

  // Logout method
  logout() {
    sessionStorage.clear();
    window.location.href = '/login'; // Redirect to login page
  }
}