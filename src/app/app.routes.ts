import { Routes } from '@angular/router';
import { RoutesEnum } from './shared/enums/routes.enum';

export const routes: Routes = [
    {
        path: RoutesEnum.DESKTOP, loadChildren: () => import('../app/desktop/desktop-routes').then((m) => m.desktopRoutes)
    },
    {
        path: RoutesEnum.MOBILE, loadChildren: () => import('../app/mobile/mobile-routes').then((m) => m.mobileRoutes)
    }
];
