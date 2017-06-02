import { PlayerInfo } from '../model/player.model';
import { RoundInfo } from '../model/round.model';
export class TournamentInfo {
    _id: string;
    TournamentName: string;
    Info: string;
    StartDate: Date;
    EndDate: Date;
    LastBetDate: Date;
    Image: string;
    TournamentTypeId: string;
    PlayersCount: number;
    TournamentStatusId: string;
    StrStartDate: string;
    StrEndDate: string;
    StrLastBetDate: string;
    Message: string;
    Players: PlayerInfo[];
    Rounds: RoundInfo[];
    IsUserPredicted: boolean;
    Republish: boolean;
    NumberOfBets?: number;
}