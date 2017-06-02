import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserInfo } from '../../model/user.model';
import { UserService } from '../../service/user.service';
import { APP_CONFIG, IAppConfig } from '../../app.config';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css'],
    providers: [UserService]
})
export class AccountComponent implements OnInit {
    public showLogin: Boolean = true;
    public userInfo: UserInfo;
    public loginError:string = '';
    public registrationError: string = '';

    constructor(private _router: Router, private _userService: UserService, 
                @Inject(APP_CONFIG) private _config: IAppConfig, private _activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.userInfo = {
            Email: '',
            Name: '',
            Password: '',
            ConfirmPassword: ''
        }
        
        /*var url = this.getQueryString('returnUrl');
        if (url != undefined && url != null) {
            url = '/' + url;
            this._router.navigate([url]);
        }*/
    }

    showRegisteration(): void {
        this.showLogin = false;
    }

    userLogin(frmLogin: UserInfo) {
        this.loginError = '';        
        this._userService.UserLogin(frmLogin).subscribe(response => {           
            let url: string = response.url;
            if (url.indexOf('login') === -1) {
              //this._router.navigate(['/betting']);
              this.redirectUrl();
            }
            else {
              this.loginError = this._config.INVALID_LOGIN;
            }               
           
        });
    }

    userRegisteration(frmRegisteration: UserInfo) {
        this.registrationError = '';
        console.log(frmRegisteration);
        if(frmRegisteration.Password == frmRegisteration.ConfirmPassword) {
            this._userService.UserRegisteration(frmRegisteration).subscribe(response => {
                if (response.UserExist === true) {
                    this.registrationError = this._config.USER_EXISTS;
                }
                else {
                    this._router.navigate(['/betting']);               
                }
            });
        }
    }    

    /*getQueryString ( field: any ): string {
        var href = window.location.href;
        var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
        var string = reg.exec(href);
        return string ? string[1] : null;
    };*/
    redirectUrl(): void {
        this._activatedRoute.params.subscribe((params: Params) => {
            let redirect = params['returnUrl'];
            
            if (redirect != undefined && redirect != null) {
                this._router.navigate(['/' + redirect]);
            }
            else {
                this._router.navigate(['/betting']);                
            }
        });
    }

}
