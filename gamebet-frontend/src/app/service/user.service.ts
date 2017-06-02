import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable'; 
import { APP_CONFIG, IAppConfig } from '../app.config';
import { UserInfo } from '../model/user.model';

@Injectable()
export class UserService {

    constructor(private _http: Http, @Inject(APP_CONFIG) private _config: IAppConfig) { 

    }

    UserLogin (userInfo: any): Observable<any> {
        return Observable.create(observer => {
            this._http.post(this._config.apiEndpoint + '/userlogin',
                    JSON.stringify(userInfo),
                    {
                        headers: new Headers({
                            'Content-Type': 'application/json'
                        })
                    }).subscribe((response) => {
                        observer.next(response);
                        //console.log(response.statusText);
                        observer.complete();
                    });
        });
    }

    UserLogOut() {
        return this._http.get(this._config.apiEndpoint + '/userlogout')
                        .map(response => response);
    }

    IsUserAuthenticated() {
        return this._http.get(this._config.apiEndpoint + '/isUserAuthenticated')
                        .map(response => response.json());
    }

    UserRegisteration(userInfo: UserInfo): Observable<any> {
        return Observable.create(observer => {
            this._http.post(this._config.apiEndpoint + '/userRegisteration',
                    JSON.stringify(userInfo),
                    {
                        headers: new Headers({
                            'Content-Type': 'application/json'
                        })
                    }).subscribe((response) => {
                        observer.next(response.json());
                        //console.log(response.statusText);
                        observer.complete();
                    });
        });
    }
    
    ResetUserPassword(userInfo: UserInfo): Observable<any> {
        return Observable.create(observer => {
            this._http.post(this._config.apiEndpoint + '/passwordReset',
                    JSON.stringify(userInfo),
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
}
