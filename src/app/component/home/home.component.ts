import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class HomeComponent {
  features = [
    {
      title: 'Feature 1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
      icon: '📊'
    },
    {
      title: 'Feature 2',
      description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      icon: '🔒'
    },
    {
      title: 'Feature 3',
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      icon: '⚡'
    },
    {
      title: 'Feature 4',
      description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      icon: '📱'
    }
  ];

  testimonials = [
    {
      name: 'John Doe',
      position: 'CEO, Company A',
      content: 'This platform has transformed how we operate. Highly recommended!',
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      name: 'Jane Smith',
      position: 'CTO, Company B',
      content: 'The features and support are outstanding. A game-changer for our business.',
      image: 'https://randomuser.me/api/portraits/women/44.jpg'
    }
  ];
} 