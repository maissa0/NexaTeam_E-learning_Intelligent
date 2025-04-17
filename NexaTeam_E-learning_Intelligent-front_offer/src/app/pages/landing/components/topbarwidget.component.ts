import { Component } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'topbar-widget',
    standalone: true,
    imports: [RouterModule, StyleClassModule, ButtonModule, RippleModule],
    template: `
        <div class="flex items-center">
            <img src="assets/layout/images/logo-hr.png" alt="NexaTeam Logo" class="h-12 mr-2" />
            <span class="text-surface-900 dark:text-surface-0 font-medium text-2xl leading-normal mr-20">NexaTeam</span>
        </div>

        <a pButton [text]="true" severity="secondary" [rounded]="true" pRipple class="lg:!hidden" pStyleClass="@next" enterClass="hidden" leaveToClass="hidden" [hideOnOutsideClick]="true">
            <i class="pi pi-bars !text-2xl"></i>
        </a>

        <div class="items-center bg-surface-0 dark:bg-surface-900 grow justify-between hidden lg:flex absolute lg:static w-full left-0 top-full px-12 lg:px-0 z-20 rounded-border">
            <ul class="list-none p-0 m-0 flex lg:items-center select-none flex-col lg:flex-row cursor-pointer gap-8">
                <li>
                    <a (click)="router.navigate(['/landing'], { fragment: 'home' })" pRipple class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                        <span>Home</span>
                    </a>
                </li>
                <li>
                    <a (click)="router.navigate(['/landing'], { fragment: 'offers' })" pRipple class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                        <span>Job Offers</span>
                    </a>
                </li>
                <li>
                    <a (click)="router.navigate(['/landing'], { fragment: 'features' })" pRipple class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                        <span>Features</span>
                    </a>
                </li>
                <li>
                    <a (click)="router.navigate(['/landing'], { fragment: 'contact' })" pRipple class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                        <span>Contact</span>
                    </a>
                </li>
            </ul>
            <div class="flex border-t lg:border-t-0 border-surface py-4 lg:py-0 mt-4 lg:mt-0 gap-2">
                <button pButton pRipple label="Post a Job" routerLink="/addOffer" [rounded]="true" [text]="true" class="p-button-success"></button>
                <button pButton pRipple label="Sign In" routerLink="/auth/login" [rounded]="true"></button>
            </div>
        </div>
    `,
    styles: [`
        :host {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
        }
    `]
})
export class TopbarWidget {
    constructor(public router: Router) {}
}
