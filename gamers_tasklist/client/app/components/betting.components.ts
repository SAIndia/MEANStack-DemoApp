import { Component } from '@angular/core';
import { IBetting } from '../../model/betting.model';
import { BettingService } from '../services/betting.service';

@Component({
  selector: 'betting',
  templateUrl: 'partial/_betting.html',
  providers: [BettingService]
})

export class BettingComponent { 
    public bettings: IBetting[];
    
    constructor(private bettingService: BettingService) {
        this.bettingService.getBettings().subscribe(response => {
            this.bettings = response;
        })

    }
    saveBetting(frmBetting: IBetting){
        console.log(frmBetting)
    }
}