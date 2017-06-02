import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent }   from './app.component';
import { BettingComponent } from './components/betting.components';
import { HttpModule } from '@angular/http'

import { routing } from './app.routes';
import { LoginComponent } from './components/login/login.component';
import { TournamentComponent } from './components/tournament/tournament.component';
import { TournamentListingComponent } from './components/tournament/tournament.listing.component';

import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';

import { APP_CONFIG, AppConfig } from './app.config';
import { Ng2DatetimePickerModule } from 'ng2-datetime-picker';
import { ModalModule } from 'ng2-modal';

@NgModule({ 
  imports:      [ BrowserModule, FormsModule, HttpModule, routing, Ng2DatetimePickerModule, ModalModule ],
  declarations: [ AppComponent, LoginComponent, FileSelectDirective,
                  TournamentComponent, TournamentListingComponent, BettingComponent ],
  bootstrap:    [ AppComponent ],
  providers:    [{ provide: APP_CONFIG, useValue: AppConfig }]

})

/*@NgModule({
  imports:      [ BrowserModule, FormsModule, HttpModule, AppRoutingModule ],
  declarations: [ AppComponent, BettingComponent, routingComponents ],
  bootstrap:    [ AppComponent ]
})*/

export class AppModule { }