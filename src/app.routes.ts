import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { HeaderFrontOfComponent } from './app/front_office/header-front-of/header-front-of.component';
import { FooterFrontOfComponent } from './app/front_office/footer-front-of/footer-front-of.component';
import { AddOfferComponent } from './app/add-offer/add-offer.component';
import { OffersComponent } from './app/offers/offers.component';
export const appRoutes: Routes = [
    {
        path: '',
        
        component: AppLayout,
      
        children: [
            
            { path: '', component: Dashboard },
            { path: 'addOffer', component: AddOfferComponent },
            { path: 'JobOffers', component: OffersComponent },

            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path :'header', component : HeaderFrontOfComponent},
    
    {path: 'footer', component : FooterFrontOfComponent},
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
