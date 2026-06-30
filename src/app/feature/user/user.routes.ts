import { Routes } from "@angular/router";

import { UserListPageComponent } from "./pages/user-list-page/user-list-page.component";
import { UserFormPageComponent } from "./pages/user-form-page/user-form-page.component";
import { UserDetailsPageComponent } from "./pages/user-details-page/user-details-page.component";
import { SearchResolver } from "./user.resolver";

export const USER_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
    },
    {
        path: 'list',
        component: UserListPageComponent,
        resolve: {
            resolved: SearchResolver
        }
    },
    {
        path: 'new',
        component: UserFormPageComponent
    },
    {
        path: 'patch/:id',
        component: UserFormPageComponent
    },
    {
        path: 'detail/:id',
        component: UserDetailsPageComponent
    }
];