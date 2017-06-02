import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable'; 
import { APP_CONFIG, IAppConfig } from '../../app.config';


@Injectable()

export class TournamentService {
    //private baseUrl:string = "http://localhost:3000/api";
    
    constructor (private _http: Http, @Inject(APP_CONFIG) private _config: IAppConfig) {
        
    }

    GetTournamentStatus() {
        
        return this._http.get(this._config.apiEndpoint + '/tournamentstatuses')
                        .map(response => response.json());
    }

    GetTournamentsByTournamentStatus(pageNumber: number, statusId: string) {
        
         var parameter = "/tournaments/" + pageNumber + "/" + statusId;
          return this._http.get(this._config.apiEndpoint + parameter)
                        .map(response => response.json());
    }

    AddTournament (tournamentInfo: any) {

        return new Promise((resolve) => {
        
            this._http.post(this._config.apiEndpoint + '/AddTournament',
                    JSON.stringify(tournamentInfo),
                    {
                        headers: new Headers({
                            'Content-Type': 'application/json'
                        })
                    }).subscribe((response)=>{
                        resolve(response.json());
                    })
            });
    } 

    UpdateTournament (tournamentInfo: any) {
         return new Promise((resolve) => {
        
            this._http.post(this._config.apiEndpoint + '/updatetournament',
                    JSON.stringify(tournamentInfo),
                    {
                        headers: new Headers({
                            'Content-Type': 'application/json'
                        })
                    }).subscribe((response)=>{
                        resolve(response.json());
                    })
            });
    }

    AddPlayerResult (playerInfo: any) {

        return new Promise((resolve) => {
        
            this._http.post(this._config.apiEndpoint + '/addplayerresult',
                    JSON.stringify(playerInfo),
                    {
                        headers: new Headers({
                            'Content-Type': 'application/json'
                        })
                    }).subscribe((response)=>{
                        resolve(response.json());
                    })
            });
    }

    GetTournamentByTournamentID (tournamentId: string) {
        var parameter = "/tournament/" + tournamentId;
         return this._http.get(this._config.apiEndpoint + parameter)
                        .map(response => response.json());

    }

    SaveAsArchive (archiveTournamentInfo: any) {
        return new Promise((resolve) => {
        
            this._http.post(this._config.apiEndpoint + '/archivetournaments',
                    JSON.stringify(archiveTournamentInfo),
                    {
                        headers: new Headers({
                            'Content-Type': 'application/json'
                        })
                    }).subscribe((response)=>{
                        resolve(response.json());
                    })
            });
    }
    
}