import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable'; 
import { APP_CONFIG, IAppConfig } from '../../app.config';


@Injectable()

export class LoginService {
    private loggedIn = false;

    constructor (private _http: Http, @Inject(APP_CONFIG) private _config: IAppConfig) {

    }

    UserLogin (userInfo: any) {

        return new Promise((resolve) => {
        
            this._http.post(this._config.apiEndpoint + '/login',
                    JSON.stringify(userInfo),
                    {
                        headers: new Headers({
                            'Content-Type': 'application/json'
                        })
                    }).subscribe((response)=>{
                        resolve(response.json()._id);
                    })
            })

   } 
       
    AdminLogin (userInfo: any): Observable<any> {
        return Observable.create(observer => {
            this._http.post(this._config.apiEndpoint + '/login',
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
