import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { FavoritesComponent } from './favorites/favorites.component';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: 'favorites', component: FavoritesComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
