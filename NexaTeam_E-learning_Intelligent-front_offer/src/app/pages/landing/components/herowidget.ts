import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'hero-widget',
    standalone: true,
    imports: [ButtonModule, RippleModule],
    template: `
        <div
            id="hero"
            class="flex flex-col pt-6 px-6 lg:px-20 overflow-hidden"
            style="background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #4CAF50 0%, #2196F3 100%); clip-path: ellipse(150% 87% at 93% 13%)"
        >
            <div class="mx-6 md:mx-20 mt-0 md:mt-6">
                <h1 class="text-6xl font-bold text-white leading-tight">
                    <span class="font-light block">Welcome to</span>
                    NexaTeam HR Management
                </h1>
                <p class="font-normal text-2xl leading-normal md:mt-4 text-white">
                    Streamline your recruitment process, manage job applications, and find the perfect talent for your organization. 
                    Our comprehensive HR management solution helps you build stronger teams.
                </p>
                <div class="flex gap-4 mt-8 mb-20">
                    <button pButton pRipple label="Post a Job" routerLink="/addOffer" class="p-button-success p-button-rounded text-xl px-5 py-3"></button>
                    <button pButton pRipple label="Browse Offers" routerLink="/JobOffers" class="p-button-outlined p-button-rounded text-xl px-5 py-3 text-white border-white"></button>
                </div>
            </div>
            <div class="flex justify-center md:justify-end mt-8">
                <img src="assets/layout/images/hero-hr.png" alt="HR Management Dashboard" class="w-10/12 md:w-7/12 shadow-2xl rounded-xl" />
            </div>
        </div>
    `,
    styles: [`
        :host ::ng-deep {
            .p-button.p-button-outlined {
                color: white;
                border-color: white;
            }
            .p-button.p-button-outlined:hover {
                background: rgba(255,255,255,0.1);
            }
        }
    `]
})
export class HeroWidget {}
