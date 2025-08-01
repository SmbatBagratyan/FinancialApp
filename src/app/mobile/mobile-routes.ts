import { Routes } from '@angular/router';
import { MobileComponent } from './mobile.component';
import { RoutesEnum } from '../shared/enums/routes.enum';

export const mobileRoutes: Routes = [
    {
        path: '',
        component: MobileComponent,
        children: [
            // may be in the future we will have some child routes
            { path: '**', redirectTo: RoutesEnum.MOBILE, pathMatch: 'full' }
        ]
    }
];