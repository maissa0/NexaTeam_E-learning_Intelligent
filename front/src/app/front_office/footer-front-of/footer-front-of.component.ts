import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer-front-of',
  imports: [RouterModule],
  templateUrl: './footer-front-of.component.html',
  styleUrl: './footer-front-of.component.scss'
})
export class FooterFrontOfComponent {
  constructor(public router: Router) {}

}
