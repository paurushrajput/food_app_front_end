import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone';
import * as momentv1 from 'moment';
import { AppService } from 'src/app.service';

@Pipe({
  name: 'gmt'
})
export class GmtPipe implements PipeTransform {

  constructor(public _appService: AppService,
  ) {
  }
  transform(gmtTime: string): string {
    if (!gmtTime) return 'N/A';
    const gmtMoment = moment.tz(gmtTime, 'GMT');
    const gstMoment = gmtMoment.tz('Asia/Dubai');
    const formattedDate = gstMoment.format('DD-MMM-YY HH:mm').split(' ');
    // console.log(formattedDate[0] + '<br/>' + formattedDate[1])
    return formattedDate[0] + '<br/>' + formattedDate[1]
  }
  // transform(value: any): any {
  //   if (!value) return 'N/A';
  //   this._appService.getMonths("f")
  //   let convertDate = new Date(value);
  //   convertDate.setHours(convertDate.getHours() - 5);
  //   convertDate.setMinutes(convertDate.getMinutes() - 30);
  //   let minutes = convertDate.getMinutes()
  //   var minutesTwoDigit = minutes.toString().padStart(2, '0');
  //   let formattedData = [convertDate.getDate(), this._appService.getMonths(convertDate.getMonth()), convertDate.getFullYear()].join('-') + ' ' + [convertDate.getHours(),
  //     minutesTwoDigit].join(':');
  //   return formattedData;
  // }
}
