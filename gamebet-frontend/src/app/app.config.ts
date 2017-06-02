import { OpaqueToken } from "@angular/core";

export let APP_CONFIG = new OpaqueToken("app.config");

export interface IAppConfig {
    apiEndpoint: string;
    TournamentLogo: string;
    INVALID_LOGIN: string;
    USER_EXISTS: string;
    RESET_PASSWORD_MISSMATCH_ERROR: string;
}

export const AppConfig: IAppConfig = {    
    apiEndpoint: "http://sagamebet.com:4200/api", 
    TournamentLogo: "http://192.168.0.179:3000/uploads/tournamentimages",
    INVALID_LOGIN: "Invalid Username or Password.",
    USER_EXISTS: "User email is already exists.",
    RESET_PASSWORD_MISSMATCH_ERROR: 'Current password is missmatching.' 

};