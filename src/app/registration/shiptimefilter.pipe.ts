import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'shiptimefilter',
  pure: false
})
export class ShipPipeFilterPipe implements PipeTransform {
  transform(items: any[], shiptime:any): any[] {
    if(!items) return []; 
    if(shiptime==0) return items;      
    return items.filter( it => {
        if( parseInt(it.ShipTimeDays)<=shiptime){         
            // console.log(it);     
            return it;
        }
    });
 }
} 