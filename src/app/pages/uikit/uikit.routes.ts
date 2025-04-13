import { Routes } from '@angular/router';
import { ChartDemo } from './chartdemo';

import { InputDemo } from './inputdemo';

import { SubscriptionComponent } from './SubscriptionComponent ';



export default [
    { path: 'charts', data: { breadcrumb: 'Charts' }, component: ChartDemo },
    { path: 'input', data: { breadcrumb: 'Input' }, component: InputDemo },
    { path: 'message', data: { breadcrumb: 'Message' }, component: SubscriptionComponent },

    { path: '**', redirectTo: '/notfound' }
] as Routes;
