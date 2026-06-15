import { Routes } from "@angular/router";

import { ShowcaseStylePage } from "./pages/showcase-style-page/showcase-style-page";
import { ShowcaseFormPage } from "./pages/showcase-form-page/showcase-form-page";
import { ShowcaseVideoPage } from "./pages/showcase-video-page/showcase-video-page";
import { ShowcaseComponentPage } from "./pages/showcase-component-page/showcase-component-page";

export const SHOWCASE_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'style',
        pathMatch: 'full'
    },
    {
        path: 'style',
        component: ShowcaseStylePage
    },
    {
        path: 'form',
        component: ShowcaseFormPage
    },
    {
        path: 'video',
        component: ShowcaseVideoPage
    },
    {
        path: 'component',
        component: ShowcaseComponentPage
    }
];