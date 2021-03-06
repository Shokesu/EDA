import { Routes, RouterModule } from '@angular/router';

// Components
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersLlistaComponent } from './users-management/users-list/users-list.component';
import { DataSourcesComponent } from './data-sources/data-sources.component';
import { DataSourceListComponent } from './data-sources/data-source-list/data-source-list.component';

// Guard
import { VerifyTokenGuard } from '../../services/guards/verify-token.guard';
import { GroupListComponent } from './groups-management/group-list/group-list.component';


const pagesRoutes: Routes = [

    { path: 'home', component: HomeComponent, canActivate: [VerifyTokenGuard] },
    { path: 'dashboard/:id', component: DashboardComponent, canActivate: [VerifyTokenGuard] },
    { path: 'account-settings', component: AccountSettingsComponent, canActivate: [VerifyTokenGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [VerifyTokenGuard] },
    { path: 'data-source', component: DataSourcesComponent, canActivate: [VerifyTokenGuard] },
    { path: 'data-source/:id', component: DataSourceListComponent, canActivate: [VerifyTokenGuard], runGuardsAndResolvers: 'paramsChange' },

    { path: 'groups-management', component: GroupListComponent, canActivate: [VerifyTokenGuard] },
    { path: 'users-management', component: UsersLlistaComponent, canActivate: [VerifyTokenGuard]},
    { path: '', redirectTo: 'home', pathMatch: 'full' }
];

export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
