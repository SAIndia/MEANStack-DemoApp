import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    templateUrl: 'partial/tournament/_tournament.html'
})

export class TournamentComponent {
    public fullName: string;
    constructor(private _router: Router) {
        this.fullName = localStorage.getItem('auth_name');
    }
    adminLogOut() {
        localStorage.setItem('auth_token',"");
        localStorage.setItem('auth_name', "");
        this._router.navigate(['/login']);
    }
}

