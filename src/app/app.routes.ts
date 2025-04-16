import { Routes } from '@angular/router';
import { EvaluationFormComponent } from './pages/uikit/evaluation-form.component';
import uikitRoutes from './pages/uikit/uikit.routes';

export const routes: Routes = [
    {
        path: 'uikit',
        children: uikitRoutes
    },
    // ... other routes
    {
        path: 'evaluation-form',
        component: EvaluationFormComponent
    }
];

export default routes; 