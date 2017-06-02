import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfo } from '../../../model/user.model';
import { LoginService } from  '../../services/login/login.service';


@Component({
    templateUrl: 'partial/login/_login.html',
    providers: [LoginService]
})

export class LoginComponent {

    public UserDto: UserInfo;
    public errorMessage: string;
    
    constructor(private _router: Router, private _loginService: LoginService ) {
        if (localStorage.getItem('auth_token') != null && localStorage.getItem('auth_token') != "") {
            this._router.navigate(['/tournament']);
        }
    }

    ngOnInit() {
        this.UserDto = {
            Name: '',
            Email: '',
            Password: ''
        }
    }
    login(frmLogin: UserInfo) {
        //console.log(frmLogin);
        this._loginService.UserLogin(frmLogin).then((response)=>{
           if(response != undefined) {
               this.errorMessage = '';
               
               localStorage.setItem('auth_token', response+"");
               this._router.navigate(['/tournament']);
           }
           else{
               this.errorMessage = 'Inalid Username or Password';               
           }
           console.log(response)
        })
        
    }
    adminLogin(frmLogin: UserInfo) {
        this._loginService.AdminLogin(frmLogin).subscribe(response => {
            if (response != undefined) {
                if (response.message === undefined) {
                    this.errorMessage = '';
                    localStorage.setItem('auth_token', response._id);
                    localStorage.setItem('auth_name', response.Name);
                    this._router.navigate(['/tournament']);
                }
                else {
                    this.errorMessage = response.message;               
                }
            }
            else {
               this.errorMessage = response.message;               
           }            
           
        });
    }

    loginByKeypress(event: any, frmLogin: UserInfo) {        
        if (event.keyCode == 13) {
            this.adminLogin(frmLogin);
        }
    }
}
