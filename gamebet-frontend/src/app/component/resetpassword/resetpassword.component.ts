import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfo } from '../../model/user.model';
import { UserService } from '../../service/user.service';
import { APP_CONFIG, IAppConfig } from '../../app.config';

@Component({
    selector: 'app-restpassword',
    templateUrl: './resetpassword.component.html',
    styleUrls: ['./resetpassword.component.css'],
    providers: [UserService]
})
export class ResetpasswordComponent implements OnInit {

  public userInfo: UserInfo;
  public resetPasswordError: string = '';

  constructor(private _router: Router, private _userService: UserService, @Inject(APP_CONFIG) private _config: IAppConfig) { }

  ngOnInit() {
      this.initUser();
      this.isUserAuthenticated();     
  }

  resetPassword(frmResetPassword: UserInfo) {
      this.resetPasswordError = '';
      if (frmResetPassword.NewPassword == frmResetPassword.ConfirmPassword) {
           this._userService.ResetUserPassword(frmResetPassword).subscribe(response => {
                if (response.Status === true) {
                    this._router.navigate(['/betting']);
                }
                else {
                    this.resetPasswordError = this._config.RESET_PASSWORD_MISSMATCH_ERROR;
                }
            });
      }
  }

  initUser(): void {
      this.userInfo = {
          Name: '',
          Email: '',
          Password: '',
          ConfirmPassword: '',
          NewPassword: ''
      };
  }
  isUserAuthenticated() {
        this._userService.IsUserAuthenticated().subscribe(response => {            
            let status: any = response.status;            
            if(status === false) {
                this._router.navigate(['/login/resetpassword']);
            }
            else {
                this.userInfo = response.LoginUser;
            }
        });
    }

}
