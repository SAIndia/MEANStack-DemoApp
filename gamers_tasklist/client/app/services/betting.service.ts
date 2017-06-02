import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()

export class BettingService {
    constructor(private http:Http){
        console.log('http service started...');
    }

    getBettings() {
        return this.http.get('http://localhost:3000/api/tasks')
                        .map(response => response.json());
                                    
    }
}