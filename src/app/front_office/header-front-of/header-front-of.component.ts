import { Component } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AppConfigurator } from '../../layout/component/app.configurator';
import { LayoutService } from '../../layout/service/layout.service';


@Component({
  selector: 'app-header-front-of',
  imports: [RouterModule, StyleClassModule, ButtonModule, RippleModule, CommonModule, StyleClassModule, AppConfigurator],
  templateUrl: './header-front-of.component.html',
  styleUrl: './header-front-of.component.scss'
})
export class HeaderFrontOfComponent {

  //constructor(public router: Router) {}

   items!: MenuItem[];
  
      constructor(public layoutService: LayoutService) {}
  
      toggleDarkMode() {
          this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
      }

      logoPath = '../../../assets/logo.png';
}
