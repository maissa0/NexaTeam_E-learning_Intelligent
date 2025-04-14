import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet, CommonModule]
})
export class AppComponent {
  title = 'frontendApp';
  showLanding = true; // Set to true to show landing page by default

  constructor(private router: Router) {}

  navigateToLogin() {
    this.showLanding = false;
    this.router.navigate(['/auth/login']);
  }

  navigateToTest() {
    this.showLanding = false;
    this.router.navigate(['/test']);
  }
}
