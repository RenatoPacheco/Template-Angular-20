import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'showcase',
        pathMatch: 'full'
    },
    {
        path: 'showcase',
        loadChildren: () => import('./feature/showcases/showcase.route').then(r => r.SHOWCASE_ROUTES),
        canLoad: [ ],
        canActivate: [ ],
        data: { }
    }
];
