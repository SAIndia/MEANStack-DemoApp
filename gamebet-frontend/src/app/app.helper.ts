export class Helper {    
    static getDDMMYYYYFormatDate(isoDate: string): string {        
        let dt = new Date(isoDate.trim());    
        let dd = dt.getDate();
        let mm = (dt.getMonth()+1); 
        let yyyy = dt.getFullYear();
        let day: string;
        let month: string;
        if(dd<10) {
            day= '0'+dd;
        } 
        else {
            day=dd.toString();
        }
        if(mm<10) {
            month='0'+mm;
        } 
        else {
            month=mm.toString();
        }
        
        return(day+'/'+month+'/'+yyyy)
    }

    static getTheFinalRound (playersCount): number {
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

    static getMaximumPoint(playersCount: number): number {
        let point: number = 0;
        switch (playersCount) {
            case 4: point = 3; break;
            case 8: point = 7; break;
            case 16: point = 15; break;
            case 32: point = 31; break;
            default: point = 0; break;
        }
        return point;
    }

}