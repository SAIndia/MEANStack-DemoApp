import { OpaqueToken } from "@angular/core";

export let APP_CONFIG = new OpaqueToken("app.config");

export interface IAppConfig {
    apiEndpoint: string;
    tournamentLogo: string;
    pageSize: number;
    ARCHIVE_NOT_CHECKED_ERROR: string;
    INVALID_ATTEMPT: string;
}

export const AppConfig: IAppConfig = {    
    apiEndpoint: "http://192.168.0.179:3000/api",
    tournamentLogo: "http://192.168.0.179:3000/uploads/tournamentimages",
    pageSize: 10,
    ARCHIVE_NOT_CHECKED_ERROR: "Please select tournament.",
    INVALID_ATTEMPT: "Invalid Attempt"
};