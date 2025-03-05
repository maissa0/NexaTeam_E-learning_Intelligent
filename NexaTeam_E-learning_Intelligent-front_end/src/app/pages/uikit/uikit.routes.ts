import { Routes } from '@angular/router';
import { ChartDemo } from './chartdemo';

import { InputDemo } from './inputdemo';

import { MessagesDemo } from './messagesdemo';



export default [
    { path: 'charts', data: { breadcrumb: 'Charts' }, component: ChartDemo },
    { path: 'input', data: { breadcrumb: 'Input' }, component: InputDemo },
    { path: 'message', data: { breadcrumb: 'Message' }, component: MessagesDemo },

    { path: '**', redirectTo: '/notfound' }
] as Routes;
