import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[hashTruncate]'
})
export class HashTruncateDirective {
  private isTruncated = false;
  private originalValue: string;

  constructor(private elementRef: ElementRef) {
    this.originalValue = this.elementRef.nativeElement.innerText;
    this.elementRef.nativeElement.innerText = this.truncateString(this.originalValue);
  }

  @HostListener('click') onClick() {
    if (this.isTruncated) {
      this.elementRef.nativeElement.innerText = this.originalValue;
    } else {
      this.elementRef.nativeElement.innerText = this.truncateString(this.originalValue);
    }
    this.isTruncated = !this.isTruncated;
  }

  private truncateString(value: string): string {
    if (value.length <= 3) {
      console.log
      return value;
    } else {
      return value.substring(0, 3) + '...';
    }
  }
}
