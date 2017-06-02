import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable'; 
import { APP_CONFIG, IAppConfig } from '../app.config';

@Injectable()
export class BettingService {

    constructor(private _http: Http, @Inject(APP_CONFIG) private _config: IAppConfig) { }

    GetActiveTournaments() {
        return this._http.get(this._config.apiEndpoint + '/tournaments')
                  .map(response => response.json());
    }

    SaveUserPrediction(playerInfo: any): Observable<any> {
        return Observable.create(observer => {
            this._http.post(this._config.apiEndpoint + '/adduserprediction',
                    JSON.stringify(playerInfo),
                    {
                        headers: new Headers({
                            'Content-Type': 'application/json'
                        })
                    }).subscribe((response) => {
                        observer.next(response.json());                        
                        observer.complete();
                    });
        });
    }

    FetchUserPredictedTournaments() {
        return this._http.get(this._config.apiEndpoint + '/mytournaments')
                    .map(response => response.json());
    }

    GetTournamentByTournamentID(tournamentId: string) {
        var parameter = "/tournament/" + tournamentId;
         return this._http.get(this._config.apiEndpoint + parameter)
                        .map(response => response.json());
    }
}
