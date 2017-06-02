import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TournamentComponent } from './components/tournament/tournament.component';

const routes: Routes = [
    { path: '', redirectTo: 'login',  pathMatch: 'full'},
    { path: 'login', component: LoginComponent, pathMatch: 'full' },
    { path: 'tournament', component: TournamentComponent, pathMatch: 'full' }   
]

export const routing =  RouterModule.forRoot(routes);