import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    providers: [UserService]
})
export class HomeComponent implements OnInit {

    public isLoggedin: boolean = false;

    constructor(private _router: Router, private _userService: UserService) { }

    ngOnInit() {
        this.isUserAuthenticated();
    }

    isUserAuthenticated() {
        this._userService.IsUserAuthenticated().subscribe(response => {            
            let status: any = response.status;            
            if(status === false) {
                this.isLoggedin = true;
            }
            else {
               this.isLoggedin = false;
            }
        });
    }

     userLogOut() {
        this._userService.UserLogOut().subscribe(response => {            
            this.isLoggedin = true;
        });
    }

}
