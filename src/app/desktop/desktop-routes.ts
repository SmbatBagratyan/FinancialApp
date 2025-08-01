import { Routes } from '@angular/router';
import { DesktopComponent } from './desktop.component';
import { RoutesEnum } from '../shared/enums/routes.enum';

export const desktopRoutes: Routes = [
    {
        path: '',
        component: DesktopComponent,
        children: [
            // may be in the future we will have some child routes
            { path: '**', redirectTo: RoutesEnum.DESKTOP, pathMatch: 'full' }
        ]
    }
];