import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // ⬅️ à importer !
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { Subscription } from '../../Models/Subsc';
import { SubscriptionServiceService } from '../../service/subscription-service.service';

@Component({
    selector: 'pricing-widget',
    imports: [DividerModule, ButtonModule, RippleModule,CommonModule],
    template: `
    <div id="pricing" class="py-6 px-6 lg:px-20 my-2 md:my-6">
      <div class="text-center mb-6">
        <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">Nos Abonnements</div>
        <span class="text-muted-color text-2xl">Choisissez l'abonnement qui vous convient</span>
      </div>

      <div class="grid grid-cols-12 gap-4 justify-between mt-20 md:mt-0">
        <div *ngFor="let subscription of subscriptions" class="col-span-12 lg:col-span-4 p-0 md:p-4 mt-6 md:mt-0">
          <div class="p-4 flex flex-col border-surface-200 dark:border-surface-600 pricing-card cursor-pointer border-2 hover:border-primary duration-300 transition-all" style="border-radius: 10px">
            <div class="text-surface-900 dark:text-surface-0 text-center my-8 text-3xl">{{ subscription.planName }}</div>
            <img [src]="subscription.status === 'ACTIVE' ? 'https://example.com/active.svg' : 'https://example.com/expired.svg'" class="w-10/12 mx-auto" alt="{{ subscription.planName }}" />
            <div class="my-8 flex flex-col items-center gap-4">
              <div class="flex items-center">
                <span class="text-5xl font-bold mr-2 text-surface-900 dark:text-surface-0">{{ subscription.price  }}</span>
                <span class="text-surface-600 dark:text-surface-200">par mois</span>
              </div>
              <button pButton pRipple label="Souscrire" class="p-button-rounded border-0 ml-4 font-light leading-tight bg-blue-500 text-white"></button>
            </div>
            <p-divider class="w-full bg-surface-200"></p-divider>
            <ul class="my-8 list-none p-0 flex text-surface-900 dark:text-surface-0 flex-col px-8">
              <li class="py-2 text-xl">{{ subscription.description }}</li>
              <li class="py-2">
                <span class="text-lg font-medium">Statut: </span><span class="text-cyan-500">{{ subscription.status }}</span>
              </li>
              <li class="py-2">
                <span class="text-lg font-medium">Expiration: </span><span class="text-cyan-500">{{ subscription.expiryDate }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    `
})
export class PricingWidget implements OnInit {
    subscriptions: Subscription[] = [];
  
    constructor(private subscriptionService: SubscriptionServiceService) {}
  
    ngOnInit() {
      this.subscriptionService.getAll().subscribe((subscriptions) => {
        this.subscriptions = subscriptions;
      });
    }
}
