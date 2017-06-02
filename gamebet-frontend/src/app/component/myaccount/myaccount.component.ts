import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserInfo } from '../../model/user.model';
import { TournamentInfo } from '../../model/tournament.model';
import { PlayerInfo } from '../../model/player.model';
import { UserService } from '../../service/user.service';
import { BettingService } from '../../service/betting.service';
import { APP_CONFIG, IAppConfig } from '../../app.config';
import { Helper } from '../../app.helper';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

@Component({
    selector: 'app-myaccount',
    templateUrl: './myaccount.component.html',
    styleUrls: ['./myaccount.component.css'],
    providers: [UserService, BettingService]
})
export class MyaccountComponent implements OnInit {

    public userInfo: UserInfo;
    public tournaments: TournamentInfo[];

    constructor(private _router: Router, private _userService: UserService, 
                  private _bettingService: BettingService,
                  @Inject(APP_CONFIG) private _config: IAppConfig,
                  private _slimLoadingBarService: SlimLoadingBarService,
                  private route: ActivatedRoute) { }

    ngOnInit() {
        this.initializeModels();
        this.isUserAuthenticated();
    }

    initializeModels(): void {
        this.userInfo = {
            Email: '',
            Name: '',
            Password: '',
            ConfirmPassword: ''
        }
    }

    isUserAuthenticated() {
        this._userService.IsUserAuthenticated().subscribe(response => {            
            let status: any = response.status;            
            if(status === false) {
                this._router.navigate(['/login/myaccount']);
            }
            else {
                this.userInfo = response.LoginUser;
                this.userPredictedTournaments();
            }
        });
    }

    userPredictedTournaments() {

        let activeId:string = "";

        this.route
        .queryParams
        .subscribe(params => {
            // Defaults to empty string if no query parameter present.
            activeId = params['activeId'] || '';
        });

        this.startLoading();
        this.showLoader()
        this._bettingService.FetchUserPredictedTournaments().subscribe(response => {
            this.tournaments = response.tournaments;
            console.log(this.tournaments);
            let i: number = 0;
            this.tournaments.forEach((tournament, index) => {
                tournament.StrStartDate = Helper.getDDMMYYYYFormatDate(tournament.StartDate+"");                
                tournament.StrEndDate = Helper.getDDMMYYYYFormatDate(tournament.EndDate+"")
                tournament.StrLastBetDate = Helper.getDDMMYYYYFormatDate(tournament.LastBetDate+"");
                tournament.Image = this._config.TournamentLogo + "/" + tournament.Image+"?rand="+Math.random();
                tournament.Rounds = this.populateRounds(response.tournaments[i].PlayerResults, response.tournaments[i].UserPredictions, tournament.PlayersCount, response.tournaments[i]); 
                tournament.Display = activeId == tournament._id ? "" : "none";
                tournament.ButtonText = activeId == tournament._id ? "Hide" : "View";
                ++i;
            });
            //console.log(this.tournaments)
            this.completeLoading();
            this.hideLoader();
        });
    }

    populateRounds(playerResults: any[], userPredictions: any[], playersCount: number, tournament: TournamentInfo) {
       
        var Rounds = [];
        var secondPlayerId, secondPlayerName, winnerId = '', adminMarkedWinnerId = '', winnerCSS = '';
        let scoredPoints: number = 0;
        let losePoints: number = 0;

        if (userPredictions.length > 0) {

            //retrieve maximum Round value from 'userPredictions' array object 
            let finalRound : number = Math.max.apply(null, userPredictions.map(x=>x.Round));
            if(finalRound === Helper.getTheFinalRound(playersCount)) {
                tournament.IsFinalRound = true;
            }
            else {
                tournament.IsFinalRound = false;
            }

            let maxPoint: number = Helper.getMaximumPoint(playersCount);
            tournament.MaximumPoints = maxPoint;

            for (var i=1; i<=6; ++i) {
               var round:any = new Object();
               round.RoundNumber = i;
               round.RoundResults = new Array();               
               try {

               
                    userPredictions.forEach((player, index) => {
                        adminMarkedWinnerId = '';
                        winnerId = '';
                        
                        if (player.Round === i) {
                            if (player.Player2 != undefined) {
                                secondPlayerId = player.Player2._id
                                secondPlayerName = player.Player2.Name
                            }
                            else {
                                secondPlayerId = ''
                                secondPlayerName = '';
                            }
                            
                            if (player.Winner != undefined) {
                                winnerId = player.Winner._id;

                                var playersPerRound = [] = playerResults.filter(x=>x.Round === i);
                                                            
                                if (playersPerRound.find(x=>x.Winner != undefined)) 
                                {
                                        var winnerInfo = playersPerRound.find(x=>x.Winner != undefined && x.Winner._id === winnerId) 
                                        if (winnerInfo != undefined) {                                   
                                            adminMarkedWinnerId = winnerInfo.Winner._id;
                                            winnerCSS = 'winner';
                                            if(winnerId === adminMarkedWinnerId && winnerInfo.Player2 != undefined) {
                                                ++scoredPoints;                                        
                                            }
                                            
                                        }
                                        else {                                   
                                            winnerInfo = playersPerRound.find(x=> x.Player1._id === player.Player1._id && x.Player2._id === player.Player2._id)                                   
                                            if(winnerInfo != undefined && winnerInfo.Winner != undefined && winnerInfo.Winner._id === winnerId) {                                        
                                                adminMarkedWinnerId = winnerInfo.Winner._id;
                                                winnerCSS = 'winner';
                                                if(winnerInfo.Player2 != undefined) {
                                                ++scoredPoints; 
                                                }                                        
                                            }
                                            else if(winnerInfo != undefined && winnerInfo.Winner != undefined) {                                       
                                                adminMarkedWinnerId = '0000000000';
                                                winnerCSS = '';                                      
                                            }
                                            else if(winnerInfo == undefined ){
                                                adminMarkedWinnerId = '0000000000';
                                                winnerCSS = ''; 
                                            }
                                        }
                                }
                                else {
                                    adminMarkedWinnerId = '1111111111';
                                    winnerCSS = '';     
                                }
                                tournament.ScoredPoints = scoredPoints;                          
                            }
                            else {
                                winnerId = ''
                                adminMarkedWinnerId = '';
                                winnerCSS = '';
                            }
                            
                            round.RoundResults.push({
                                    Round: player.Round, 
                                    FirstPlayerId: player.Player1._id, 
                                    FirstPlayerName: player.Player1.Name,
                                    SecondPlayerId: secondPlayerId,
                                    SecondPlayerName: secondPlayerName,
                                    TournamentId: player.TournamentId,
                                    WinnerId: winnerId,
                                    PlayersCount: playersCount,
                                    AdminMarkedWinnerId: adminMarkedWinnerId,
                                    WinnerCSS: winnerCSS
                            });
                        }
                        
                    }); 
               } catch(error) {}
               if(round.RoundResults.length > 0) {
                    Rounds.push(round);
               }
            }
        }
        
        return Rounds;
    }

    saveUserPrediction(event: any, tournament: any, playerId: string, players:PlayerInfo[], roundNumber: number) {
        
        let round: number = roundNumber;
        ++ round;
        // Get the final round
        var finalRound = Helper.getTheFinalRound(tournament.PlayersCount);
        let isWinner: boolean = false;

        if (round == finalRound) {
            isWinner = true;
        }

        var playerInfo = {
            PlayerId: playerId,
            TournamentId: tournament._id,
            Round: round,
            TotalPlayers: tournament.PlayersCount,
            IsWinner: isWinner,
            IsFirstClick: false,
            Players: players
        };

       
         if (event.target.className === '') {
            this.startLoading();
            this.showLoader();
            if (event.target.nextElementSibling) {
                event.target.className += ' default';
                event.target.nextElementSibling.className += ' loser';
            }
            else {
                event.target.className += ' default';
                event.target.previousElementSibling.className += ' loser'            
            }

            this._bettingService.SaveUserPrediction(playerInfo).subscribe(response => {                
                if (response.Status === true) {                    
                     this._bettingService.GetTournamentByTournamentID(tournament._id).subscribe(response => {
                        tournament.PlayerResults = response.tournament[0].PlayerResults;
                        tournament.UserPredictions = response.tournament[0].UserPredictions;
                        tournament.Rounds = this.populateRounds(tournament.PlayerResults, tournament.UserPredictions, tournament.PlayersCount, tournament);                
                        this.completeLoading();
                        this.hideLoader();
                    });
                }
            });
           
        }
    }

    userLogOut() {
        this._userService.UserLogOut().subscribe(response => {            
            let url: string = response.url;
            if (url.indexOf('home') != -1) {
              this._router.navigate(['/home']);
            }
            else {
              //console.log('Invalid');
            }  
        });
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
