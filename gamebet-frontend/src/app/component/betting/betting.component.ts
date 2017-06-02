import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { UserInfo } from '../../model/user.model';
import { TournamentInfo } from '../../model/tournament.model';
import { PlayerInfo } from '../../model/player.model';
import { UserService } from '../../service/user.service';
import { BettingService } from '../../service/betting.service';
import { APP_CONFIG, IAppConfig } from '../../app.config';
import { Helper } from '../../app.helper';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

@Component({
    selector: 'app-betting',
    templateUrl: './betting.component.html',
    styleUrls: ['./betting.component.css'],
    providers: [UserService, BettingService]
})

export class BettingComponent implements OnInit {

    public userInfo: UserInfo;
    public tournaments: TournamentInfo[];

    constructor(private _router: Router, private _userService: UserService, 
                private _bettingService: BettingService, @Inject(APP_CONFIG) private _config: IAppConfig,
                private _slimLoadingBarService: SlimLoadingBarService) { }

    ngOnInit() {
        this.initializeModels();
        this.isUserAuthenticated();
    }

    initializeModels(): void {
        this.userInfo = {
            Email: '',
            Name: '',
            Password: ''
        }
    }

    userLogOut() {
        this._userService.UserLogOut().subscribe(response => {            
            let url: string = response.url;
            if (url.indexOf('home') != -1) {
              this._router.navigate(['/home']);
            }
            else {
              console.log('Invalid');
            }  
        });
    }

    isUserAuthenticated() {
        this._userService.IsUserAuthenticated().subscribe(response => {            
            let status: any = response.status;            
            if(status === false) {
                this._router.navigate(['/login']);
            }
            else {
                this.userInfo = response.LoginUser;
                this.getActiveTournaments();
            }
        });
    }

    getActiveTournaments() {
        this.startLoading();
        this.showLoader();
        this._bettingService.GetActiveTournaments().subscribe(response => {            
            this.tournaments = response.tournaments;
            this.tournaments.forEach((tournament, index) => {
                tournament.StrStartDate = Helper.getDDMMYYYYFormatDate(tournament.StartDate+"");
                tournament.StrEndDate = Helper.getDDMMYYYYFormatDate(tournament.EndDate+"");
                tournament.StrLastBetDate = Helper.getDDMMYYYYFormatDate(tournament.LastBetDate+"");
                tournament.Image = this._config.TournamentLogo + "/" + tournament.Image+"?rand="+Math.random();
            });
            console.log(this.tournaments)
            this.completeLoading();
            this.hideLoader();
        });
    }

    saveUserPrediction(event: any, tournament: TournamentInfo, player: PlayerInfo, players:PlayerInfo[] ) {
        
        let round: number = 2;
        
        //findout the final winner 
        var finalRound = this.getTheFinalRound(tournament.PlayersCount);
        let isWinner: boolean = false;

        if (round == finalRound) {
            isWinner = true;
        }


        var playerInfo = {
            PlayerId: player._id,
            TournamentId: tournament._id,
            Round: round,
            TotalPlayers: tournament.PlayersCount,
            IsWinner: isWinner,
            IsFirstClick: true,
            Players: players
        };

        let index: number = parseInt(event.target.getAttribute('data-sectionvalue'), 10);
        if (event.target.className === '') {
            if (index % 2 != 0) {
                event.target.className += ' winner';
                event.target.nextElementSibling.className += ' loser';
            }
            else {
                event.target.className += ' winner';
                event.target.previousElementSibling.className += ' loser'  
            }

            this._bettingService.SaveUserPrediction(playerInfo).subscribe(response => {
                if (response.Status === true) {
                    this._router.navigate(['/myaccount'],{ queryParams: { activeId : tournament._id } });
                }
            });
            
        }       
    }

    getTheFinalRound (playersCount) {
        var round = 0;
        switch (playersCount) {
            case 4: round = 3; break;
            case 8: round = 4; break;
            case 16: round = 5; break;
            case 32: round = 6; break;
            default: round = 0; break;
        }
        return round;
    }

    startLoading() {
        this._slimLoadingBarService.start(() => {
            console.log('Loading Complete...');
        });
    }
    stopLoading() {
        this._slimLoadingBarService.stop();
    }

    completeLoading() {
        this._slimLoadingBarService.complete();
    }

    showLoader() {
        document.getElementById("loader").style.display = "block";
        document.getElementById('transparant').style.display = "block";
    } 

    hideLoader() {
        document.getElementById("loader").style.display = "none";
        document.getElementById('transparant').style.display = "none";
    }

}
