import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';

import { AppComponent } from './app.component';
import { AccountComponent } from './component/account/account.component';
import { UserComponent } from './component/user/user.component';
import { HomeComponent } from './component/home/home.component';

import { RoutingModule } from './routing.module';
import { APP_CONFIG, AppConfig } from './app.config';
import { BettingComponent } from './component/betting/betting.component';
import { ResetpasswordComponent } from './component/resetpassword/resetpassword.component';
import { MyaccountComponent } from './component/myaccount/myaccount.component';


@NgModule({
  declarations: [
    AppComponent,
    AccountComponent,
    UserComponent,
    HomeComponent,
    BettingComponent,
    ResetpasswordComponent,
    MyaccountComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RoutingModule,
    SlimLoadingBarModule.forRoot()
  ],
  providers: [{ provide: APP_CONFIG, useValue: AppConfig }],
  bootstrap: [AppComponent],
  exports: [SlimLoadingBarModule],
})
export class AppModule { }
