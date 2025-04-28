import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customTitlecase'
})
export class TitlecasePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;

    // Remove underscores and split the string into words
    let words = value.replace(/_/g, ' ').toLowerCase().split(' ');

    // Capitalize the first letter of each word
    words = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));

    // Join the words back into a single string
    return words.join(' ');
  }

}
