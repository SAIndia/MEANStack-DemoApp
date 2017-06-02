import { Component, Inject } from '@angular/core';
import { TournamentStatusInfo } from '../../../model/tournamentstatus.model';
import { TournamentInfo } from '../../../model/tournament.model';
import { PagerInfo } from '../../../model/pager.model';
import { RoundInfo } from '../../../model/round.model';
import { TournamentService } from '../../services/tournament/tournament.service';

import { FileUploader } from 'ng2-file-upload';
import { ModalModule } from 'ng2-modal';
import { APP_CONFIG, IAppConfig } from '../../app.config';

var TournamentStatus = {
    Published: "58391d19dbbdd237f06b5117",
    Archived: "58391d19dbbdd237f06b5118",
    Draft: "5841211ff36d2847d850874e"
}

@Component({
    selector: 'tournament-listing',
    templateUrl: 'partial/tournament/_tournamentListing.html',
    styles: [
        `input.ng-invalid { border-left: 3px solid red; }
                 input.ng-valid { border-left: 3px solid green; }
                 textarea.ng-invalid { border-left: 3px solid red; }
                 textarea.ng-valid { border-left: 3px solid green; }`
    ],
    providers: [TournamentService]
})

export class TournamentListingComponent {

    public tournamentStatuses: TournamentStatusInfo[];
    public tournamentStausDefaultID: string;
    public tournaments: TournamentInfo[];
    public totalRecords: number;
    public currentPageNumber: number;
    public totalPages: number;
    public Tournament: TournamentInfo;
    public Pager: PagerInfo;
    public hideArchive: boolean = false;

    public showMessage: string;
    public hidden: boolean = true; 
    public showHideIndex?: number = null;  
    public ArchiveTournamentIds: any[];
    public SelectedArchiveTournamentIds: any[];
    public tournamentStatusDefaultName: string = "Published";

    public uploader: FileUploader = null;

    constructor(private _tournamentService: TournamentService, @Inject(APP_CONFIG) private _config: IAppConfig) {

        this.uploader = new FileUploader({ url: this._config.apiEndpoint + '/upload' });//iniitialize post method 

        _tournamentService.GetTournamentStatus().subscribe(response => {
            this.tournamentStatuses = response;
            this.tournamentStausDefaultID = this.tournamentStatuses[0]._id;
           
            this.getAllTournamentsByTournamentStatus(1, this.tournamentStausDefaultID);
        });

    }

    ngOnInit() {

        this.initializeComponentModel();

        this.Pager = {
            CurrentPage: 0,
            EndPage: 0,
            Pages: [],
            PageSize: 0,
            StartPage: 0,
            TotalPages: 0,
            TotalRecords: 0
        }
        this.ArchiveTournamentIds = []; this.SelectedArchiveTournamentIds = [];// initialize array 
    }

    initializeComponentModel() {
        let date: Date = new Date();

        this.Tournament = {
            _id: '',
            EndDate: null,
            Image: '',
            Info: '',
            LastBetDate: null,
            PlayersCount: 4,
            StartDate: null,
            StrEndDate: this.getDDMMYYYYFormatDate(date.toISOString()),
            StrLastBetDate: this.getDDMMYYYYFormatDate(date.toISOString()),
            StrStartDate: this.getDDMMYYYYFormatDate(date.toISOString()),
            Message: '',
            TournamentName: '',
            TournamentStatusId: '',
            TournamentTypeId: '',
            Players: [],
            Rounds: [],
            IsUserPredicted: false,
            Republish: true
        }
        this.Tournament.Players.push({ _id: '', TournamentId: '', Name: '' });
        this.Tournament.Players.push({ _id: '', TournamentId: '', Name: '' });
        this.Tournament.Players.push({ _id: '', TournamentId: '', Name: '' });
        this.Tournament.Players.push({ _id: '', TournamentId: '', Name: '' });

        this.clearFileInput();
    }

    getTournamentStaus(statusId: string) {
        this.tournamentStausDefaultID = statusId;
         if (this.tournamentStausDefaultID === TournamentStatus.Archived) {
            this.hideArchive = true;
        }
        else {
            this.hideArchive = false;
        }
        this.hidden = true;
        this.showHideIndex = null;
        this.tournamentStatusDefaultName = this.getTournamentStatusName(statusId);
        this.getAllTournamentsByTournamentStatus(1, this.tournamentStausDefaultID);
    }

    getAllTournamentsByTournamentStatus(pageNumber: number, statusId: string) {

        this.showMessage = "";
        this.ArchiveTournamentIds = [];
        this.SelectedArchiveTournamentIds = [];
        var checkAll: any = document.getElementsByClassName("checkbox")[0];
        checkAll.checked = false;

        this._tournamentService.GetTournamentsByTournamentStatus(pageNumber, statusId).subscribe(response => {
            this.tournaments = response.tournaments;
            this.totalRecords = response.totalCount;
            this.currentPageNumber = pageNumber;
            this.tournaments.forEach((tournament, index) => {
                this.ArchiveTournamentIds.push({ TournamentId: tournament._id });
                tournament.StrStartDate = this.getDDMMYYYYFormatDate(tournament.StartDate + "");
                tournament.StrEndDate = this.getDDMMYYYYFormatDate(tournament.EndDate + "");
                tournament.StrLastBetDate = this.getDDMMYYYYFormatDate(tournament.LastBetDate + "");
                tournament.Image = this._config.tournamentLogo + "/" + tournament.Image + "?rand=" + Math.random();

                tournament.Rounds = this.populateRounds(response.tournaments[index].PlayerResults, tournament.PlayersCount);
                 
                if (response.tournaments[index].UserPredictions.length > 0) {
                    tournament.IsUserPredicted = true;
                    let predictedArray = []; 
                    predictedArray = response.tournaments[index].UserPredictions;
                    tournament.NumberOfBets = predictedArray.map(item => item.PredictedBy)
                                    .filter((value, index, self) => self.indexOf(value) === index).length;                   
                }
                else {
                    tournament.IsUserPredicted = false;
                    tournament.NumberOfBets = 0;
                }
                tournament.Republish = response.tournaments[index].TournamentStatusId === TournamentStatus.Published ? false : true;
                
            });
            console.log( this.tournaments);   

            this.Pager = this.setPaging(this.totalRecords, pageNumber, this._config.pageSize);

        });
    }

    getDDMMYYYYFormatDate(isoDate: string) {
        let dt = new Date(isoDate.trim());
        let dd = dt.getDate();
        let mm = dt.getMonth() + 1;
        let yyyy = dt.getFullYear();
        let day: string;
        let month: string;
        if (dd < 10) {
            day = '0' + dd;
        }
        else {
            day = dd.toString();
        }
        if (mm < 10) {
            month = '0' + mm;
        }
        else {
            month = mm.toString();
        }

        return (day + '/' + month + '/' + yyyy)
    }

    updateTournamentAsDraft(frmTournament: any, fileUploader: FileUploader, dialogModal: any, tournamentID: string) {
        let tournamentInfo: any = null;
         this._tournamentService.GetTournamentByTournamentID(tournamentID).subscribe(response => {
            tournamentInfo = response.tournament[0];   

            let userPredictedCount: number = tournamentInfo.UserPredictions.length; 
            console.log(userPredictedCount);
            if (userPredictedCount === 0) {
                frmTournament.Players = this.pushPlayers(frmTournament);
                this.updateTournament(frmTournament, fileUploader, TournamentStatus.Draft, dialogModal);
                
                //this.getTournamentStaus(TournamentStatus.Draft);
            }
            else {
                this.showMessage = "User prediction in progress." ;
                dialogModal.open();
            } 
        });
        
    }

    updateAndPublish(frmTournament: any, fileUploader: FileUploader, dialogModal: any, tournamentID: string) {
        let tournamentInfo: any = null;
         this._tournamentService.GetTournamentByTournamentID(tournamentID).subscribe(response => {
            tournamentInfo = response.tournament[0];   

            let userPredictedCount: number = tournamentInfo.UserPredictions.length; 
            console.log(userPredictedCount);
            if (userPredictedCount === 0) {
                frmTournament.Players = this.pushPlayers(frmTournament);
                this.updateTournament(frmTournament, fileUploader, TournamentStatus.Published, dialogModal);
                //this.getTournamentStaus(TournamentStatus.Published);
            }
            else {
                this.showMessage = "User prediction in progress." ;
                dialogModal.open();
            }
         });
        
    }

    saveAndPublish(frmAddTournament: any, fileUploader: FileUploader, dialogModal: any) {
        frmAddTournament.Players = this.pushPlayers(frmAddTournament);
        this.saveTournament(frmAddTournament, fileUploader, TournamentStatus.Published, dialogModal);       
    }

    saveTournamentAsDraft(frmAddTournament: any, fileUploader: FileUploader, dialogModal: any) {
        frmAddTournament.Players = this.pushPlayers(frmAddTournament);
        this.saveTournament(frmAddTournament, fileUploader, TournamentStatus.Draft, dialogModal);        
    }

    playersCountKeyPress(event, frmAddTournament: TournamentInfo) {
        let playersCount: string = event.target.value;
        var totalCount = parseInt(playersCount, 10);
        let currentPlayersCount = this.Tournament.Players.length;
        let total: number = totalCount - currentPlayersCount;
        if (totalCount != NaN && this.isInSequence(totalCount.toString())) {
            if (totalCount > currentPlayersCount) {

                for (var i = 1; i <= total; ++i) {
                    this.Tournament.Players.push({ _id: '', TournamentId: '', Name: '' });
                }
            }
            else {
                this.Tournament.Players.splice(totalCount, currentPlayersCount);
            }
        }

        switch (totalCount) {
            case 4 : 
            case 8 :
            case 16 :
            case 32 :
                event.target.classList.remove('ng-invalid');
                event.target.className += ' ng-valid';
                break;
            default :
                event.target.classList.remove('ng-valid');
                event.target.className += ' ng-invalid';            
        }

    }

    populatePlayersCountKeyPress(event, frmTournament: TournamentInfo) {
        let playersCount: string = event.target.value;
        var totalCount = parseInt(playersCount, 10);
        let currentPlayersCount = frmTournament.Players.length;
        let total: number = totalCount - currentPlayersCount;

        if (totalCount != NaN && this.isInSequence(totalCount.toString())) {

            if (totalCount > currentPlayersCount) {

                for (var i = 1; i <= total; ++i) {
                    frmTournament.Players.push({ _id: '', TournamentId: '', Name: '' });
                }
            }
            else {
                frmTournament.Players.splice(totalCount, currentPlayersCount);
            }
        }

        switch (totalCount) {
            case 4 : 
            case 8 :
            case 16 :
            case 32 :
                event.target.classList.remove('ng-invalid');
                event.target.className += ' ng-valid';
                break;
            default :
                event.target.classList.remove('ng-valid');
                event.target.className += ' ng-invalid';            
        }
       
    }

    addPlayerResult(event, playerId, tournamentId, round, playersCount, tournament, dialogModal: any) {

        round = parseInt(round);
        ++round;
        //findout the final winner 
        var finalRound = this.getTheFinalRound(parseInt(playersCount, 10));
        let isWinner: boolean = false;

        if (round == finalRound) {
            isWinner = true;
        }


        var playerInfo = {
            PlayerId: playerId,
            TournamentId: tournamentId,
            Round: round,
            TotalPlayers: playersCount,
            IsWinner: isWinner
        };

        if (event.target.className === '') {

            if (event.target.nextElementSibling) {
                event.target.className += ' winner';
                event.target.nextElementSibling.className += ' loser';
            }
            else {
                event.target.className += ' winner';
                event.target.previousElementSibling.className += ' loser'
            }

            this._tournamentService.AddPlayerResult(playerInfo).then(response => {
                var message = response;
                this._tournamentService.GetTournamentByTournamentID(tournamentId).subscribe(response => {
                    tournament.PlayerResults = response.tournament[0].PlayerResults;
                    tournament.Rounds = this.populateRounds(response.tournament[0].PlayerResults, playersCount);
                    this.showMessage = "" + message;
                    dialogModal.open();
                });

            });

        }
        else {
            this.showMessage = this._config.INVALID_ATTEMPT;
            dialogModal.open();
        }

    }

    saveTournament(frmAddTournament: any, fileUploader: FileUploader, tournamentStatusId: string, dialogModal: any) {
        this.showMessage = "";
        let count: number = (fileUploader.queue.length);
        if(frmAddTournament.StartDate > frmAddTournament.LastBetDate) {
            if(frmAddTournament.EndDate >= frmAddTournament.StartDate) {            
                if(this.isValidPlayerCount(parseInt(frmAddTournament.PlayersCount))) {
                    if (count > 0) {
                        fileUploader.queue[count - 1].upload();
                        fileUploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
                            var responseMessage = JSON.parse(response);
                            let fileName: string = responseMessage.filename;

                            fileUploader.clearQueue();
                            frmAddTournament.Image = fileName;
                            frmAddTournament.TournamentStatusId = tournamentStatusId;

                            this._tournamentService.AddTournament(frmAddTournament).then(response => {
                                this.getTournamentStaus(tournamentStatusId);
                                this.tournamentStausDefaultID = tournamentStatusId;
                                this.showMessage = response + "";
                                dialogModal.open();
                                this.initializeComponentModel();
                                this.hidden = true;

                            });
                        };
                    }
                    else {
                        this.showMessage = 'Tournament logo should be added.';
                        dialogModal.open();
                    }
                }
                else {
                    this.showMessage = "Invalid Player Count";
                    dialogModal.open();
                }
            }
            else {
                this.showMessage = "End date should be grater than or equal to begin date";
                dialogModal.open();
            }
        }
        else {
            this.showMessage = "Begin date should be grater than last betdate";
            dialogModal.open();
        }

        
    }

    updateTournament(frmTournament: any, fileUploader: FileUploader, tournamentStatusId: string, dialogModal: any) {
        this.showMessage = "";
        frmTournament.TournamentStatusId = tournamentStatusId;

        let count: number = (fileUploader.queue.length);
        console.log(frmTournament);
        if(frmTournament.StartDate > frmTournament.LastBetDate) {
            if(frmTournament.EndDate >= frmTournament.StartDate) { 
                if(this.isValidPlayerCount(parseInt(frmTournament.PlayersCount))) {
                    if (count > 0) {
                        fileUploader.queue[count - 1].upload();
                        fileUploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
                            var responseMessage = JSON.parse(response);
                            let fileName: string = responseMessage.filename;

                            fileUploader.clearQueue();
                            frmTournament.Image = fileName;

                            this._tournamentService.UpdateTournament(frmTournament).then(response => {
                                this.getAllTournamentsByTournamentStatus(this.currentPageNumber, this.tournamentStausDefaultID);
                                this.getTournamentStaus(tournamentStatusId);
                                this.tournamentStausDefaultID = tournamentStatusId;
                                this.showMessage = "" + response;
                                dialogModal.open();
                                this.hideDiv();
                                this.hidden = true;                   
                            });
                        };
                    }
                    else {
                        frmTournament.Image = "";
                        this._tournamentService.UpdateTournament(frmTournament).then(response => {
                            this.showMessage = "" + response;
                            //this.getAllTournamentsByTournamentStatus(this.currentPageNumber, this.tournamentStausDefaultID);
                            
                            this.getTournamentStaus(tournamentStatusId);
                            this.tournamentStausDefaultID = tournamentStatusId;
                            this.showMessage = "" + response;
                            dialogModal.open();
                            this.hideDiv();
                            this.hidden = true;
                        });
                    }
                }
                else {
                    console.log("Invalid Player Count");

                    this.showMessage = "Invalid Player Count";
                    dialogModal.open();
                }
            }
            else {
                this.showMessage = "End date should be grater than or equal to begin date";
                dialogModal.open();
            }
        }
        else {
            this.showMessage = "Begin date should be grater than last betdate";
            dialogModal.open();
        }

    }

    pushPlayers(frmObject: any) {
        let totalPlayers: number = frmObject.PlayersCount;
        let name: string = "Name";
        var players = [];
        for (var i = 0; i < totalPlayers; ++i) {
            name = "Name" + i;
            players.push(frmObject[name]);
        }
        return players;
    }

    setPaging(totalRecords: number, currentPage: number, pageSize: number) {
        currentPage = currentPage || 1; //default to first page
        pageSize = pageSize || 10; // default to page size
        let totalPages: number = Math.ceil(totalRecords / pageSize);

        let startPage, endPage: number;

        if (totalPages <= 10) {
            startPage = 1;
            endPage = totalPages;
        }
        else {
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }

        // create an array of pages to ng-repeat in the pager control
        var pages = [];
        for (var i = startPage; i <= endPage; ++i) {
            pages.push(i);
        }

        return {
            TotalRecords: totalRecords,
            CurrentPage: currentPage,
            PageSize: pageSize,
            TotalPages: totalPages,
            StartPage: startPage,
            EndPage: endPage,
            Pages: pages
        }
    }

    populateRounds(playerResults: any[], playersCount) {

        var Rounds = [];
        var secondPlayerId, secondPlayerName, winnerId = '';
        
        if (playerResults.length > 0) {

            for (var i = 1; i <= 6; ++i) {
                var round: any = new Object();
                round.RoundNumber = i;
                round.RoundResults = new Array();

                playerResults.forEach((player, index) => {
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
                        }
                        else {
                            winnerId = ''
                        }

                        round.RoundResults.push({
                            Round: player.Round,
                            FirstPlayerId: player.Player1._id,
                            FirstPlayerName: player.Player1.Name,
                            SecondPlayerId: secondPlayerId,
                            SecondPlayerName: secondPlayerName,
                            TournamentId: player.TournamentId,
                            WinnerId: winnerId,
                            PlayersCount: playersCount
                        });
                    }
                });
                Rounds.push(round);
            }
        }

        return Rounds;
    }

    getTheFinalRound(playersCount) {
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

    isInSequence(findElement: string) {
        var sequence = [4, 8, 16, 32];
        var find = parseInt(findElement, 10)
        if (sequence.indexOf(find) >= 0) {
            return true;
        }
        else {
            return false;
        }
    }

    checkAllTournaments(event) {
        var elements: any = document.getElementsByClassName("checkbox");
        for (var i = 0; i < elements.length; ++i) {
            elements[i].checked = event.target.checked;
        }

        if (event.target.checked) {

            this.SelectedArchiveTournamentIds = []
            this.SelectedArchiveTournamentIds = this.ArchiveTournamentIds.slice();

        }
        else {

            this.SelectedArchiveTournamentIds = [];
        }
    }

    addAsArchive(event, tournamentId: string) {
        if (event.target.checked) {

            this.SelectedArchiveTournamentIds.push({ TournamentId: tournamentId })
        }
        else {
            var index = this.SelectedArchiveTournamentIds.findIndex(x => x.TournamentId === tournamentId);
            if (index > -1) {
                this.SelectedArchiveTournamentIds.splice(index, 1);
            }
        }
    }

    saveAsArchive(event, dialogModal: any) {
        if (this.SelectedArchiveTournamentIds.length > 0) {
            var ArchiveTournaments: any = new Object();
            ArchiveTournaments.ArchiveTournamets = new Array();
            ArchiveTournaments.ArchiveTournamets = this.SelectedArchiveTournamentIds.slice();
            ArchiveTournaments.TournamentStatus = TournamentStatus.Archived;

            this._tournamentService.SaveAsArchive(ArchiveTournaments).then(response => {
                this.getAllTournamentsByTournamentStatus(this.currentPageNumber, this.tournamentStausDefaultID);
                this.getTournamentStaus(TournamentStatus.Archived);
                this.showMessage = "" + response;
                dialogModal.open();
            });

        }
        else {
            this.showMessage = this._config.ARCHIVE_NOT_CHECKED_ERROR;
            dialogModal.open();
        }
        this.hidden = true;
        this.showHideIndex = null;
        this.tournamentStatusDefaultName = "Archived";
    }

    clearFileInput() {
        var files: any = document.getElementsByName('single');
        for (var i = 0, n = files.length; i < n; i++) {
            files[i].value = "";
        }
    }

    showHide(index: number): void {    
        this.showHideIndex = index;
        this.hidden = true;
    }

    hideMe(): void {
        this.showHideIndex = null;
        this.hidden = true;
    }
    addTournament(): void {        
        if (this.showHideIndex != null) {
            if (!confirm('Are you sure to cancel the edit?')) {
                this.hidden = true;
            }
            else {                
                this.hideDiv();                
            }            
        }
        else {
            this.hidden = false;
            this.showHideIndex = null
        }        
    }

    hideDiv(): void {
        let div1: any = document.getElementsByClassName("edit-tournament-wrap")[this.showHideIndex];
        let div2: any = document.getElementsByClassName("results-area")[this.showHideIndex];
        div1.style.display = "none";
        div2.style.display = "none";
        this.hidden = false;
        this.showHideIndex = null;
    }

    getTournamentStatusName(statusId: string): string {
        let status: string = "";
        switch (statusId) {
            case TournamentStatus.Published: 
                status = "Published";
                break;
            case TournamentStatus.Draft:
                status = "Draft";
                break;
            case TournamentStatus.Archived:
                status = "Archived";
                break;
            default: status = "Published"; break;
        }
        return status;
    }

    isValidPlayerCount(playerCount: number): boolean {
        let isvalid = false;
        switch (playerCount) {
            case 4: 
            case 8: 
            case 16: 
            case 32: 
                isvalid = true;
                break;
            default: isvalid =false; break;
        }
        return isvalid;
    }

    getTournamentById (tournamentId: string): any {
        let tournamentInfo: any = null;
        console.log(tournamentId);
        this._tournamentService.GetTournamentByTournamentID(tournamentId).subscribe(response => {
            tournamentInfo = response.tournament[0];   
            return tournamentInfo;     
        });
        return tournamentInfo;
    }

    deleteTournament(tournamentId): void {
        console.log(tournamentId);
    }

}