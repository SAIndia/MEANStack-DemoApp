import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './component/account/account.component';
import { UserComponent } from './component/user/user.component';
import { HomeComponent } from './component/home/home.component';
import { BettingComponent } from './component/betting/betting.component';
import { ResetpasswordComponent } from './component/resetpassword/resetpassword.component';
import { MyaccountComponent } from './component/myaccount/myaccount.component';

const routes: Routes = [  
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component:HomeComponent }, 
    { path: 'login', component:AccountComponent }, 
    { path: 'login/:returnUrl', component:AccountComponent },
    { path: 'user', component:UserComponent },
    { path: 'betting', component:BettingComponent },
    { path: 'resetpassword', component:ResetpasswordComponent },
    { path: 'myaccount', component:MyaccountComponent }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class RoutingModule {

}